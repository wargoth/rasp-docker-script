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
    new google.maps.LatLng(34.3320389, -124.5985718), // SW
    new google.maps.LatLng(40.9218674, -118.8122559)  // NE
);
corners.Centre[4] = new google.maps.LatLng(37.6269531, -121.7054138);
