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
        new google.maps.LatLng(35.9410553, -122.3207550), // SW
        new google.maps.LatLng(37.4182892, -120.5683594)  // NE
    );
    corners.Centre[4] = new google.maps.LatLng(36.6796722, -121.4445572);


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
    'dir': 'OUT+0/FCST/',
    'bounds': corners.Bounds[4],
    'centre': corners.Centre[4],
}
forecasts.push(f);

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
forecasts.push(f);
    
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
forecasts.push(f);
