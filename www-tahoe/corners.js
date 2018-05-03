/****************************************
 *    corners.js                        *
 *                                      *
 *    Corner info for Google Maps       *
 * Look REGIONXYZ/LOG/ncl.out.* for corners
 ****************************************/ 

var corners = [];

corners["Bounds"]  = [];
corners["Centre"] = [];

corners.Bounds = new Array();
corners.Centre = new Array();

corners.Bounds[4] = new google.maps.LatLngBounds(
	new google.maps.LatLng(35.7808380, -122.7370911), // SW
	new google.maps.LatLng(42.1519356, -116.2817230)  // NE
);
corners.Centre[4] = new google.maps.LatLng(38.9663849, -119.5094070);

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
    'dir': 'OUT/FCST/',
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
    'dir': 'OUT+1/FCST/',
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
    'dir': 'OUT+2/FCST/',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)

T.setTime(Now + mS_Day * 3);
var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()],
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT+3/FCST/',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)

T.setTime(Now + mS_Day * 4);
var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()],
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT+4/FCST/',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)

T.setTime(Now + mS_Day * 5);
var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()],
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT+5/FCST/',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)

T.setTime(Now + mS_Day * 6);
var f = {
    'name': dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()],
    'latlon_file': 'latlon2d.json',
    'date': T.getTime(),
    'default_t': '1400',
    'dir': 'OUT+6/FCST/',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f)
