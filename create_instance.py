"""The following script:
- Starts specified instance
- watches if it has been preempted or not
- shuts down after specified timeout
- restarts in case of preemption
"""

import argparse
import googleapiclient.discovery
import time
import os
from datetime import datetime, timedelta
import ConfigParser
import string


def get_operations(compute, project_id, zone, target_id):
    return compute.zoneOperations().list(project=project_id, zone=zone, filter='targetId=%s' % target_id).execute()


def get_status(compute, project_id, name, zone):
    return compute.instances().get(project=project_id, zone=zone, instance=name).execute()['status']


def stop_instance(compute, project_id, name, zone):
    print 'Stopping instance (%s/%s/%s)' % (project_id, zone, name)
    op = compute.instances().stop(project=project_id, zone=zone, instance=name).execute()
    wait_for_operation(compute, project_id, zone, op['name'])


def start_instance(compute, project_id, name, zone):
    print 'Starting instance (%s/%s/%s)' % (project_id, zone, name)
    assert get_status(compute, project_id, name, zone) == 'TERMINATED', 'Instance (%s/%s/%s) is already running' % (project_id, zone, name)
    instance = compute.instances().start(project=project_id, zone=zone, instance=name).execute()
    instance['startTime'] = datetime.utcnow()
    wait_for_operation(compute, project_id, zone, instance['name'])
    assert get_status(compute, project_id, name, zone) != 'TERMINATED', 'Instance (%s/%s/%s) must have been started' % (project_id, zone, name)
    return instance


def wait_for_termination(instance_data, compute, project_id, name, zone, timeout):
    print "Waiting for %s to terminate" % name
    
    force_shutdown_time = datetime.utcnow() + timedelta(minutes=timeout)

    while get_status(compute, project_id, name, zone) != 'TERMINATED':
        if datetime.utcnow() > force_shutdown_time:
            print 'Instance (%s/%s/%s) timeout!' % (project_id, zone, name)
            stop_instance(compute, project_id, name, zone)
            return False
        time.sleep(60)

    ops = get_operations(compute, project_id, zone, instance_data['targetId'])
    ops = [o['operationType'] for o in ops['items'] if dt_parse(o['endTime']) > instance_data['startTime']]

    return 'compute.instances.preempted' in ops


def wait_for_operation(compute, project, zone, operation):
    print('Waiting for operation %s to finish...' % operation)
    while True:
        time.sleep(3)
        result = compute.zoneOperations().get(project=project, zone=zone, operation=operation).execute()

        if result['status'] == 'DONE':
            if 'error' in result:
                raise Exception(result['error'])
            return result


def populate_template(template, params):
    for k, v in params.iteritems():
        template = template.replace("${%s}" % k.upper(), v)
    return template

def create_instance(compute, project, zone, name, params, ssh_private_key_path, machine_type):
    # Get the latest Debian Jessie image.
    image_response = compute.images().getFromFamily(
        project='cos-cloud', family='cos-stable').execute()
    source_disk_image = image_response['selfLink']

    # Configure the machine
    ssh_private_key = open(
        os.path.join(
            os.path.dirname(__file__), ssh_private_key_path), 'r').read()
    startup_script = open(
        os.path.join(
            os.path.dirname(__file__), 'user_data_template.yaml'), 'r').read()
    startup_script = populate_template(startup_script, params)

    config = {
        'name': name,
        'machineType': "zones/%s/machineTypes/%s" % (zone, machine_type),

        # Specify the boot disk and the image to use as a source.
        'disks': [
            {
                'boot': True,
                'autoDelete': True,
                'initializeParams': {
                    'sourceImage': source_disk_image,
                }
            }
        ],

        # Specify a network interface with NAT to access the public
        # internet.
        'networkInterfaces': [{
            'network': 'global/networks/default',
            'accessConfigs': [
                {'type': 'ONE_TO_ONE_NAT', 'name': 'External NAT'}
            ]
        }],

        # Allow the instance to access cloud storage and logging.
        'serviceAccounts': [{
            'email': 'default',
            'scopes': [
                'https://www.googleapis.com/auth/devstorage.read_write',
                'https://www.googleapis.com/auth/logging.write'
            ]
        }],
            
        # Preemptible image
        'scheduling': {
            'preemptible': True
        },

        # Metadata is readable from the instance and allows you to
        # pass configuration from deployment scripts to instances.
        'metadata': {
            'items': [{
                'key': 'user-data',
                'value': startup_script
            }, {
               'key': 'private-key',
               'value': ssh_private_key
            }]
        }
    }

    instance = compute.instances().insert(
        project=project,
        zone=zone,
        body=config).execute()

    instance['startTime'] = datetime.utcnow()
    wait_for_operation(compute, project, zone, instance['name'])
    assert get_status(compute, project, name, zone) != 'TERMINATED', 'Instance (%s/%s/%s) must have been started' % (project_id, zone, name)

    return instance


def delete_instance(compute, project, zone, name):
    print 'Deleting instance %s' % name
    return compute.instances().delete(
        project=project,
        zone=zone,
        instance=name).execute()


def main(project_id, name, zone, timeout, max_restarts, ssh_private_key_path, params, machine_type):
    compute = googleapiclient.discovery.build('compute', 'v1')
    
    instance = create_instance(compute, project_id, zone, name, params, ssh_private_key_path, machine_type)

    while max_restarts > 0:
        preempted = wait_for_termination(instance, compute, project_id, name, zone, timeout)
        if not preempted:
            print 'Instance (%s/%s/%s) terminated normally' % (project_id, zone, name)
            break
        else:
            max_restarts -= 1
            if max_restarts > 0:
                print 'Restarting preempted instance (%s/%s/%s)' % (project_id, zone, name)
                instance = start_instance(compute, project_id, name, zone)
            else:
                print 'Instance (%s/%s/%s) has been preempted and will not be restarted' % (project_id, zone, name)
    delete_instance(compute, project_id, zone, name)


def dt_parse(t):
    ret = datetime.strptime(t[:23], '%Y-%m-%dT%H:%M:%S.%f')
    if t[23] == '+':
        ret -= timedelta(hours=int(t[24:26]), minutes=int(t[27:]))
    elif t[23] == '-':
        ret += timedelta(hours=int(t[24:26]), minutes=int(t[27:]))
    return ret

def str_generator(size=6, chars=string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('config', help='Configuration file for the instance.')
    parser.add_argument('day', help='Day of the forecast. 0 for today, 1 for today+1, etc.')
    parser.add_argument('name', help='Instance name.')
    parser.add_argument('--timeout', default='60', help='Maximum time instance allowed to run in minutes.')
    parser.add_argument('--max-restarts', default='3', help='Maximum number of restarts for preempted instance.')

    args = parser.parse_args()
    
    config = ConfigParser.RawConfigParser()
    config.read(args.config)
    
    params = {
        'day': args.day
    }
    
    ssh_private_key_path = config.get('Instance', 'ssh_private_key_path')
    machine_type = config.get('Instance', 'machine_type')

    for key in ['host', 'rasp_dir', 'rasp_name', 'docker_image']:
        params[key] = config.get('Instance', key)

    main(config.get('Instance', 'project_id'), args.name, config.get('Instance', 'zone'), 
         int(args.timeout), int(args.max_restarts), ssh_private_key_path, params, machine_type)
