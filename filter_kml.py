from pykml import parser
from lxml import etree
import shapely.geometry
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

boundaries = shapely.geometry.box(-124.780098, 32.864088, -113.505454, 41.937594)


with open('/tmp/allusa.kml') as f:
	doc = parser.parse(f)

def poly_within_boundaries(bs, pp):
	for poly in pp:
		for outer in poly.outerBoundaryIs.LinearRing:
			op = Polygon([tuple(float(t) for t in p.split(',')[:2]) for p in outer.coordinates.text.strip().split(' ')])
			if boundaries.contains(op):
				return True


def within_boundaries(bs, p):
	if hasattr(p, 'Polygon'):
		if poly_within_boundaries(bs, p.Polygon):
			return True

	if hasattr(p, 'MultiGeometry'):
		if poly_within_boundaries(bs, p.MultiGeometry.Polygon):
			return True

for f in  doc.getroot().Document.Folder[0].Folder:
	for p in f.Placemark:
		if not within_boundaries(boundaries, p):
			f.remove(p)

doc.write('output.kml', xml_declaration=True, encoding='UTF-8')
