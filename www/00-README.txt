You will need to customise this for your locality.


Edit the corners.js file
Do a run and refer to one of the $BASEDIR/REGIONXYZ/LOG/ncl.out.* files


Edit the soundings.js file in the light of your
$BASEDIR/GM/rasp.region_data.ncl file

Edit the Disclaimer file for your requirements

You may find Airspace files at http://soaringweb.org/Airspace
Look for a .kmz file for your domain
They can be split out into class_A.kmz etc using google-earth

The topo files can be produced using replot to plot "wrf=HGT" for your region
Rename the wrf=HGT*.body.png file to topo<R>.body.png where <R> is the domain resolution
And similarly for other .png files 
Copy to the RASPtableGM directory.
See the code for more details.

The Turnpts file is derived from the British Gliding Association Turning Point List
http://www.newportpeace.co.uk/turningpoints.htm

Maybe there is a similar list for your area
The TurnPts file indicates the format

Note that this file has been updated for RASP-UK to show the Turning Points in "Specify Task"

