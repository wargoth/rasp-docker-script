/****************************************
 *    corners.js                        *
 *                                      *
 *    Corner info for Google Maps       *
 * Look REGIONXYZ/LOG/ncl.out.* for corners
 ****************************************/ 

var corners = new Array();
var tmp;

corners["Bounds"]
corners["Centre"]

corners.Bounds = new Array();
corners.Centre = new Array();

corners.Bounds[4] = new google.maps.LatLngBounds(
    new google.maps.LatLng(35.7808380, -122.7370911), // SW
    new google.maps.LatLng(42.1519356, -116.2817230)  // NE
);
corners.Centre[4] = new google.maps.LatLng(38.9663849, -119.5094070);
