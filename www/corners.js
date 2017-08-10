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
        new google.maps.LatLng(34.8888855, -123.2350464), // SW
        new google.maps.LatLng(38.5593872, -119.3888397)  // NE
    );
corners.Centre[2] = new google.maps.LatLng(36.7241364, -121.3119431);

// UK 4km (Tomorrow)
corners.Bounds[4] = new google.maps.LatLngBounds(
        new google.maps.LatLng(34.8888855, -123.2350464), // SW
        new google.maps.LatLng(38.5593872, -119.3888397)  // NE
);
corners.Centre[4] = new google.maps.LatLng(36.7241364, -121.3119431);


// UK 5km (Not currently used)
corners.Bounds[5] = new google.maps.LatLngBounds(
        new google.maps.LatLng(35.1222992, -123.4807129), // SW
        new google.maps.LatLng(38.6755066, -119.7176514)  // NE
          );
corners.Centre[5] = new google.maps.LatLng( 36.8989029, -121.5991821 );


// UK 12km (Rest of week)
corners.Bounds[12] = new google.maps.LatLngBounds(
        new google.maps.LatLng(35.1222992, -123.4807129), // SW
        new google.maps.LatLng(38.6755066, -119.7176514)  // NE
);
corners.Centre[12] = new google.maps.LatLng(36.8989029, -121.5991821);

