import json
import re
import argparse

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
            row.append(tuple(map(float, re.split(r'\s+', line))))

        return table

def main(fname):
    table = parse_latlon(fname)
    return json.dumps(table, separators=(',',':'))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Transforms latlon2d.d02.dat files into json')
    parser.add_argument('-i','--input', help='Input file path', required=True)
    args = parser.parse_args()
    print main(args.input)
