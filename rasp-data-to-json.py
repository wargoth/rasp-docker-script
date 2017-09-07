import json
import re
import argparse


def get_single_value(name, line):
    v = re.search(name + r'= ([^\s]+)', line)
    assert len(v.groups()) == 1
    return v.groups()[0]

def parse_file(path):
    '''
    Parses forecast data files
    Format description:
    http://www.drjack.info/twiki/bin/view/RASPop/DataFileDescription
    '''
    with open(path) as f:
        data = {}
        header = data['header'] = {}
        init = False
        # The first data row is for the grid row having the smallest y index, i.e. the most "southerly" row, 
        # with subsequent rows being for increasing y index values. The actual value at each grid point is the 
        # printed data value divided by the given multiplication factor.
        table = data['table'] = []
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


def main(fname):
    data = parse_file(fname)
    return json.dumps(data, separators=(',',':'))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Transforms RASP *.data files into json')
    parser.add_argument('-i','--input', help='Input file path', required=True)
    args = parser.parse_args()
    print main(args.input)
