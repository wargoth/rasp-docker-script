"""The following script:
- Starts specified instance
- watches if it has been preempted or not
- shuts down after specified timeout
- restarts in case of preemption
"""

import argparse
import googleapiclient.discovery
import time
from datetime import datetime, timedelta


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


def main(project_id, name, zone, timeout, max_restarts):
    compute = googleapiclient.discovery.build('compute', 'v1')

    while max_restarts > 0:
        instance = start_instance(compute, project_id, name, zone)
        preempted = wait_for_termination(instance, compute, project_id, name, zone, timeout)
        if not preempted:
            print 'Instance (%s/%s/%s) terminated normally' % (project_id, zone, name)
            break
        else:
            max_restarts -= 1
            if max_restarts > 0:
                print 'Restarting preempted instance (%s/%s/%s)' % (project_id, zone, name)
            else:
                print 'Instance (%s/%s/%s) has been preempted and will not be restarted' % (project_id, zone, name)


def dt_parse(t):
    ret = datetime.strptime(t[:23], '%Y-%m-%dT%H:%M:%S.%f')
    if t[23] == '+':
        ret -= timedelta(hours=int(t[24:26]), minutes=int(t[27:]))
    elif t[23] == '-':
        ret += timedelta(hours=int(t[24:26]), minutes=int(t[27:]))
    return ret


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('project_id', help='Google Cloud project ID.')
    parser.add_argument('name', help='Instance name.')
    parser.add_argument('--zone', default='us-west1-b', help='Compute Engine zone to deploy to.')
    parser.add_argument('--timeout', default='60', help='Maximum time instance allowed to run in minutes.')
    parser.add_argument('--max-restarts', default='3', help='Maximum number of restarts for preempted instance.')

    args = parser.parse_args()

    main(args.project_id, args.name, args.zone, int(args.timeout), int(args.max_restarts))
