/****************************************
 *    corners.js                        *
 *                                      *
 *    Corner info for Google Maps       *
 * Look REGIONXYZ/LOG/ncl.out.* for corners
 ****************************************/ 

var corners = [];

corners["Bounds"]  = [];
corners["Centre"] = [];

corners.Bounds[1] = new google.maps.LatLngBounds(
    new google.maps.LatLng(37.6421509, -122.2215881), // SW
    new google.maps.LatLng(38.0634804, -121.6869354)  // NE
);
corners.Centre[1] = new google.maps.LatLng(37.8528137, -121.9542618);

corners.Bounds[4] = new google.maps.LatLngBounds(
    new google.maps.LatLng(34.0473289, -124.8150177), // SW
    new google.maps.LatLng(41.2036285, -118.6347809)  // NE
);
corners.Centre[4] = new google.maps.LatLng(37.6254807, -121.7248993);


var dayName   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var forecasts = [];

var Now = new Date().getTime();
var T = new Date();
T.setTime(Now);
var mS_Day = 24 * 60 * 60 * 1000;

var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()] + " - Today",
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)

T.setTime(Now + mS_Day);
var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()],
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT+1',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)
    
T.setTime(Now + mS_Day * 2);
var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()],
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT+2',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)
