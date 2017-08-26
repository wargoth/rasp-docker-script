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

// UK 2km (Today)
corners.Bounds[2] = new google.maps.LatLngBounds(
        new google.maps.LatLng(34.8913345, -123.2319031), // SW
        new google.maps.LatLng(38.5569267, -119.3918457)  // NE
    );
corners.Centre[2] = new google.maps.LatLng(36.7241287, -121.3118744);

// UK 4km (Tomorrow)
corners.Bounds[4] = new google.maps.LatLngBounds(
        new google.maps.LatLng(34.9011726, -123.2193756), // SW
        new google.maps.LatLng(38.5470505, -119.4039154)  // NE
);
corners.Centre[4] = new google.maps.LatLng(36.7241135, -121.3116455);


// UK 5km (Not currently used)
corners.Bounds[5] = new google.maps.LatLngBounds(
        new google.maps.LatLng(34.9011726, -123.2193756), // SW
        new google.maps.LatLng(38.5470505, -119.4039154)  // NE
);
corners.Centre[5] = new google.maps.LatLng( 36.7241135, -121.3116455 );


// UK 12km (Rest of week)
corners.Bounds[12] = new google.maps.LatLngBounds(
        new google.maps.LatLng(34.9011726, -123.2193756), // SW
        new google.maps.LatLng(38.5470505, -119.4039154)  // NE
);
corners.Centre[12] = new google.maps.LatLng(36.7241135, -121.3116455);

