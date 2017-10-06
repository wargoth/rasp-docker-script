/****************************************
 * Domain specific configuraiton        *
 *    parameters                        *
 *                                      *
 * Look REGIONXYZ/LOG/ncl.out.* for corners
 ****************************************/ 

var corners = [];

corners["Bounds"]  = [];
corners["Centre"] = [];

corners.Bounds[4] = new google.maps.LatLngBounds(
    new google.maps.LatLng(37.4281273, -122.4656525), // SW
    new google.maps.LatLng(38.2707405, -121.3985596)  // NE
);
corners.Centre[4] = new google.maps.LatLng(37.8494339, -121.9321060);


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
