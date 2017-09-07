import re
from dateutil.parser import parse
import xml.etree.ElementTree as ET
import urllib2
from matplotlib import path
import datetime
from collections import defaultdict
from dateutil import tz


def get_single_value(name, line):
    v = re.search(name + r'= ([^\s]+)', line)
    assert len(v.groups()) == 1
    return v.groups()[0]


class Data:
    header = None
    table = None


def parse_file(path):
    '''
    Parses forecast data files
    Format description:
    http://www.drjack.info/twiki/bin/view/RASPop/DataFileDescription
    '''
    with open(path) as f:
        data = Data()
        header = data.header = {}
        init = False
        # The first data row is for the grid row having the smallest y index, i.e. the most "southerly" row, 
        # with subsequent rows being for increasing y index values. The actual value at each grid point is the 
        # printed data value divided by the given multiplication factor.
        table = data.table = []
        for line in f:
            line = line.strip()
            if line == '---':
                continue
            if not init:  # ignore header line
                init = True
                continue
            if line.startswith('Model'):  # Model line
                continue
            if line.startswith('Day'):  # date, etc line
                # Day= 2017 8 22 TUE ValidLST= 1400 CES ValidZ= 1200 Fcst= 24.0 Init= 12 Param= sfcwind Direction Unit= m/sec Mult= 1 Min= 170 Max= 190
                header['Mult'] = int(get_single_value('Mult', line))
                header['Unit'] = get_single_value('Unit', line)
                continue

            table.append(map(lambda v: int(v) * header['Mult'], line.split(' ')))

        return data


def parse_metar(stations, start_time, end_time):
    '''
    Fetches and parses METARs between start_time and end_time for the list of stations
    '''
    url = 'https://aviationweather.gov/adds/dataserver_current/httpparam?' \
          'dataSource=metars&requestType=retrieve&format=xml&stationString=%s' \
          '&startTime=%sZ&endTime=%sZ' % (','.join(stations), start_time.isoformat(), end_time.isoformat())
    print "Getting data from %s" % url
    f = urllib2.urlopen(url)
    # with open('/tmp/httpparam.xml') as f:
    tree = ET.parse(f)
    root = tree.getroot()
    metars = []
    process = {
        'station_id': lambda v: v,
        'temp_c': lambda v: int(float(v)),
        'dewpoint_c': lambda v: int(float(v)),
        'wind_dir_degrees': lambda v: int(float(v)),
        'wind_speed_kt': lambda v: int(float(v)),
        'observation_time': lambda v: parse(v),
        'latitude': float,
        'longitude': float
    }
    for m in root.findall('data')[0].iter('METAR'):
        metar = {}
        metars.append(metar)
        for v in m:
            if v.tag in process.keys():
                metar[v.tag] = process[v.tag](v.text)
    return metars


def parse_latlon(path):
    '''
    Parses latlon2d file
    '''
    with open(path) as f:
        table = []
        row = []
        for line in f:
            line = line.strip()
            if not line:  # row separator
                table.append(row)
                row = []
                continue
            row.append(tuple(re.split(r'\s+', line)))

        return table


def latlon2ij(point, ll_table):
    '''
    Findes i,j correspoinding to specified coordinates
    '''
    for j in xrange(len(ll_table) - 1):
        for i in xrange(len(ll_table[0]) - 1):
            a = ll_table[j][i]
            b = ll_table[j][i + 1]
            c = ll_table[j + 1][i + 1]
            d = ll_table[j + 1][i]
            p = path.Path([a, b, c, d])
            if p.contains_points([point]):
                return (i, j)


def get_latest(metars):
    latest = defaultdict(list)
    to_zone = tz.gettz('America/Los_Angeles')
    for m in metars:
        hr = m['observation_time'].astimezone(to_zone).hour
        latest[hr].append(m)
    return latest


def c(f):
    '''
    Converts temperature in Fahrenheit to Celcius
    '''
    return (f - 32) * 5.0 / 9


# define start of the period
start_time = datetime.datetime.utcnow().replace(hour=18, minute=00, second=0, microsecond=0)
# comment out next line if running same julian day (day = z-day)
start_time = datetime.datetime.utcnow().replace(hour=18, minute=00, second=0, microsecond=0, day=start_time.day - 1 )
# define end of the period
end_time = datetime.datetime.utcnow().replace(hour=1, minute=59, second=59, microsecond=0, day=start_time.day + 1 )

# METAR stations within the area
stations = "KSFO KLVK KCCR KSJC KMRY KWVI KE16 KLSN KCVH 09CA KSNS CA37 KHDW KOAK KSQL KPAO KNUQ KRHV KMOD KSCK O889 KPRB KNLC".split()

# get METAR reports
metars = parse_metar(stations, start_time, end_time)
# group METARS by time
groups = get_latest(metars)
# metars = sorted(metars, key=lambda k: k['station_id'])


# list of available data
dirs = [
    ('/tmp/OUT_T1', 'drjack-wrf3-panoche-4k/latlon2d.d02.dat'),
    ('/tmp/OUT_T2', 'drjack-wrf3-panoche-4k/latlon2d.d02.dat')
]


def norm(deg):
    '''Returns degrees in [-180,180] range'''
    if deg < 180:
        return deg
    return abs(deg - 360) % 360


totals = defaultdict(dict)

# first, iterate of hours
for hour in sorted(groups.keys()):
    # second, iterate over available forecasts
    for option in range(len(dirs)):
        data_dir = dirs[option][0]

        metars = groups[hour]
        print "Getting forecast for %s @ %02d00" % (data_dir, hour)

        # parse forecast data files
        wspd = parse_file(data_dir + '/sfcwindspd.curr.%02d00lst.d2.data' % hour)
        wdir = parse_file(data_dir + '/sfcwinddir.curr.%02d00lst.d2.data' % hour)
        dewpt = parse_file(data_dir + '/sfcdewpt.curr.%02d00lst.d2.data' % hour)
        temp = parse_file(data_dir + '/sfctemp.curr.%02d00lst.d2.data' % hour)

        # parse latlon2d file
        table = parse_latlon(dirs[option][1])

        cumul = 0
        spd_err_cumul = 0
        spd_max_err = 0
        # third, iterate over METARs
        for m in metars:
            i, j = latlon2ij((m['latitude'], m['longitude']), table)
            print "Station: %s" % m['station_id']
            spd_diff = abs(wspd.table[j][i] - m['wind_speed_kt'])
            dir_diff = norm(abs(wdir.table[j][i] - m['wind_dir_degrees']))
            dir_err = dir_diff / 360.0
            temp_diff = abs(c(temp.table[j][i]) - m['temp_c'])
            temp_err = temp_diff / m['temp_c']
            dew_diff = abs(c(dewpt.table[j][i]) - m['dewpoint_c'])
            dew_err = dew_diff / m['dewpoint_c']

            cumul += dir_err + temp_err + dew_err
            spd_err_cumul += spd_diff
            spd_max_err  = max(spd_max_err, spd_diff)

            print "Wind expected %d@%d, got %d@%d" % (wspd.table[j][i], wdir.table[j][i], m['wind_speed_kt'], m['wind_dir_degrees']), \
                "Diff %d@%d" % (spd_diff, dir_diff), "Error %d @ %d%%" % (spd_diff, dir_err * 100)
            print "Temp expected %d, got %d" % (c(temp.table[j][i]), m['temp_c']), "Diff %d" % temp_diff, "Error %d%%" % (temp_err * 100)
            print "Dewp expected %d, got %d" % (c(dewpt.table[j][i]), m['dewpoint_c']), "Diff %d" % dew_diff, "Error %d%%" % (dew_err * 100)

        err = (cumul / len(metars) / 3 * 100)
        spd_err = spd_err_cumul / len(metars)
        totals[data_dir][hour] = (err, spd_err, spd_max_err)
        print "Average error: %d%%, wspeed error avg: %d, max %d" % (err, spd_err, spd_max_err)
        print "\n\n"

# output totals
for name, hours in totals.iteritems():
    print "Station %s" % name
    for hour, err in hours.iteritems():
        print "@%d Error %d%%, wspeed error avg: %d, max %d" % (hour, err[0], err[1], err[2])
    print "=================="
