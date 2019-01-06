/**********************
 *	RASPtableGM.js  *
 **********************/

/* 2013/06/27
 * Fix click throuh day for IE on Soundings
 * Line 1227
 */

/* 
 * Global Variables
 */

var oldDayIndex;
var Loaded        = [];
var Pics          = [];
var Overlays      = [];
var theTitles     = [];
var theScales     = [];
var theSideScales = [];

var ffversion;

var oldParam;
var times;

var map;
var overlay = null;
var markerArray = [];
var airspaceArray = [];
var Event;

var paramWindow = null;
var origTblHt;
var imgHt;
var imgWid;
var topHeight;

var map;
var opacity = 50;	// default opacity
var centre;
var zoom = typeof default_zoom !== 'undefined' ? default_zoom : 10;		// default zoom
var ctrFlag = false;
var OPACITY_MAX_PIXELS = 57; // Width of opacity control image
var opacity_control = "N";
var opacityCtrlKnob;

var waslong = false;	// longclick
var wasSounding = false ;

var latLon2d = [];

var def_param = typeof default_param !== 'undefined' ? default_param : 3; // default parameter index, see paramListFull


 /***********************
 * initIt()             *
 *                      *
 * Initialise Variables *
 * Build Menus, etc     *
 ***********************/
function initIt()
{
	document.body.style.overflow = "hidden"; // Disable Scrolling
	window.onresize = function(){setSize();}

    document.getElementById("hide_controls").onclick = function () {
        var hidable = document.getElementById("hidable");
        var button = document.getElementById("hide_controls");
        if (hidable.style.display == 'none') {
            hidable.style.display = 'block';
            button.value = 'Hide controls';
        } else {
            hidable.style.display = 'none';
            button.value = 'Show controls';
        }
    }

	oldDayIndex = document.getElementById("Day").options.selectedIndex;
	oldParam = document.getElementById("Param").options.value;

	/* There is a bug in FF 1.5 & 2 with DOMMouseScroll - look for ffversion below */
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
		ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
	}

	/**********************/
	/* Build the Day Menu */
	/**********************/

	var day = document.getElementById("Day");	// save typing
    
    for (var i = 0; i < forecasts.length; i++) {
        day.options[i] = new Option(forecasts[i].name);
    }


	/***********************/
	/* Set Default Options */
	/***********************/

	// Set Short Param List
	for(var i = 0; i < paramListFull.length; i++) {
        if (paramListFull[i][1] == 'nope1') {
            var optG = document.createElement("optgroup");
            optG.label = paramListFull[i][2];
            document.getElementById("Param").appendChild(optG);
        } else {
            var opt = document.createElement("option");
            var txt = document.createTextNode(paramListFull[i][2]);
            opt.appendChild(txt);
            opt.setAttribute('value', paramListFull[i][1])
            opt.setAttribute('class', paramListFull[i][0])
            opt.setAttribute('data-id', i)
            document.getElementById("Param").appendChild(opt)
        }
	}

	// Install Handlers
	document.getElementById("Param").onchange        = doChange;
	document.getElementById("Day").onchange          = doChange;
	document.getElementById("Time").onchange         = doChange;



	document.getElementById("Day").options[0].selected    = true;				// Today
	document.getElementById("Param").options[def_param].selected  = true;				// hcrit
	document.getElementById("desc").innerHTML = paramListFull[document.getElementById("Param").selectedIndex][def_param] ;
    
    document.getElementById("help_button").onclick = function() {
        alert((document.getElementById("desc")).innerHTML);
    }
    

    setTimes();

	for(i = 0; i < document.getElementById("Time").options.length; i++){
		theScales[i]     = new Image();
		theSideScales[i] = new Image();
		theTitles[i]     = new Image();
		Overlays[i]      = null;
		Loaded[i]        = false;
	}

	var fid = document.getElementById("Day").options.selectedIndex;
	centre = forecasts[fid].centre;

	// Save the original Selector Table Height
	origTblHt = document.getElementById("selectors").offsetHeight;

	/*****************************************
	 * Process URL tail and set menu values  *
	 *****************************************/
	if( location.href.split("?")[1]){ // Any args?
		args=location.href.split("?")[1].split("&");

		for(i = 0; i < args.length; i++){
			prams = args[i].split("=");
			if(prams[0] == "param"){
				for(j = 0; j < document.getElementById("Param").options.length; j++){
					if(document.getElementById("Param").options[j].value == prams[1]){
						document.getElementById("Param").options[j].selected = true;
						break;
					}
				}
				if(j == document.getElementById("Param").options.length){
					for(j = 0; j < document.getElementById("Param").options.length; j++){
						if(document.getElementById("Param").options[j].value == prams[1]){
							document.getElementById("Param").options[j].selected = true;
							break;
						}
					}
				}
			}
			if(prams[0] == "time"){
				for(j = 0; j < document.getElementById("Time").options.length; j++){
					if(document.getElementById("Time").options[j].value == prams[1])
						document.getElementById("Time").options[j].selected = true;
				}
			}
				
			if(prams[0] == "date"){
				var dateNow = new Date();
				dateNow.setHours(0, 0, 0, 0);
				// Build requested date
				var newDate = new Date(prams[1].substr(0,4), prams[1].substr(4,2) - 1, prams[1].substr(6,2), 0, 0, 0, 0);
				if(newDate >= dateNow){
					// Set forecast date Menu Option
					for(j = 1; j < 7; j++){
						dateNow.setDate(dateNow.getDate() + 1);
						// alert("dateNow = " + dateNow + "\nnewDate = " + newDate);
						if(  newDate.getFullYear() == dateNow.getFullYear()
							&& newDate.getMonth() == dateNow.getMonth()
							&& newDate.getDate() == dateNow.getDate()
						){
							day.options[j+1].selected = true;	// Have to add 1 because of 12Km for Today!!!
						}
					}
					dateNow.setDate(dateNow.getDate());
					if(newDate > dateNow)
						alert("No forecast for " + newDate.toDateString() + " - Too far ahead!");
				}
			}
			if(prams[0] == "opacity"){
				opacity = parseInt(prams[1]);
			}
			if(prams[0] == "zoom"){
				zoom = parseInt(prams[1]);
			}
			if(prams[0] == "centre"){
				latlon = prams[1].split(',');
				lat = latlon[0];
				lon = latlon[1];
				centre = new google.maps.LatLng(lat, lon);
			}
		}
	}


	map = newMap();

	new LongClick(map, 1000);	// longclick

	// map.fitBounds(Bnds);	// This seems to zoom out rather too much!

	setSize();

	// Install handlers for the map
	google.maps.event.addListener(map, 'rightclick',     function(event) { newclick(event); });
	google.maps.event.addListener(map, 'dragend',        function(event) { constrainMap(event);         });
	google.maps.event.addListener(map, 'zoom_changed',   function(event) { constrainMap(event);         });

	/** Longpress implementation start **/
	var longpress = null;
	var touchEvent = null;
	var pressEvent = null;
	
	function dist(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
	}
	
	document.body.addEventListener('touchstart', function(event) {
		if(event.touches.length == 1) {
			pressEvent = event
			clearTimeout(longpress);
			longpress = setTimeout(function () {
				if (touchEvent == null) {
					return;
				}
				var t1 = pressEvent.touches[0]
				var t2 = event.touches[0]
				if (dist(t1.clientX, t1.clientY, t2.clientX, t2.clientY) < 10) {
					newclick(touchEvent); 
					touchEvent = null;
				}
			}, 500);
		} else {
			clearTimeout(longpress);
		}
	}, true);

	document.body.addEventListener('touchend', function(event) {
		clearTimeout(longpress);
	}, true);

	document.body.addEventListener('touchmove', function(event) {
		pressEvent = event
		if(event.touches.length > 1) {
			clearTimeout(longpress);
		}
	}, true);

	google.maps.event.addListener(map, 'mousedown', function(event) {
		touchEvent = event;
	});

	google.maps.event.addListener(map, 'mouseup', function(event) {
		touchEvent = null;
	});
	/** Longpress implementation end **/


	createOpacityControl(map); 
	addSndMarkers();


	// Install airspaces
	var airspaceOpts = {
		map:		  null,	// Don't specify map yet - done when AS is switched on
		preserveViewport: true,
// 		suppressInfoWindows: true,
		zIndex:		  1000
	};

	var airspacetype = document.getElementsByClassName("airspace");
	for(i = 0; i < airspacetype.length; i++) {
		airspaceArray[i] = new google.maps.KmlLayer(airspacetype[i].value, airspaceOpts);
	}

	doAirspace();
   
    var marker = new google.maps.Marker({
        icon: "location.png"
    });


    if (navigator.geolocation) {

        navigator.geolocation.watchPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            marker.setPosition(pos);
            marker.setMap(map);
        }, function() {
            marker.setMap(null);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError();
    }


	google.maps.event.addListenerOnce(map, "tilesloaded", function() { doChange(null); } );
}

function handleLocationError() {
    console.warn('Location is not supported by the browser');
}



function getFile(fpath, onload) {
    var req = new XMLHttpRequest();
    req.open("GET", fpath);
    req.onload = onload;
    req.send(); // This line fetches the file
}

function parseLatLon2d (txt) {
    lines = txt.split('\n');
    table = []
    row = []
    for (var i = 0, j = lines.length; i < j; i++) {
        var line = lines[i].trim();
        
        if (!line) { // row separator
            table.push(row);
            row = [];
            continue;
        }
        var v = line.split(/\s+/);
        row.push({lat: parseFloat(v[0]), lng: parseFloat(v[1])});
    }
    return table;
}


/****************************************
 *      END OF INITIALISATION STUFF     *
 *      Start of functions              *
 ****************************************/

// Return "yyyymmdd" from T as string
function mkdat(T)
{
	var dom, mon, year;

	dom = T.getDate();
	if(dom < 10){dom = "0" + dom;}
	mon = T.getMonth() + 1;
	if(mon < 10){mon = "0" + mon;}
	year = T.getFullYear()
	return( "" + year + mon + dom);
}


// Called on end of drag or zoom change
function constrainMap(E)
{
	var VPbounds, URL;

	while(!(VPbounds = map.getBounds()))
		; // Hmmm! Busy wait?
	
	// Register new zoom & centre values in Page URL
	zoom = map.getZoom();
	centre = map.getCenter();

	URL = document.getElementById("Url").innerHTML;
	URL = URL.replace(/centre=-*\d+\.\d+,-*\d+\.\d+/, "centre=" + centre.toUrlValue() );
	URL = URL.replace(/zoom=\d+/, "zoom=" + zoom);
	document.getElementById("Url").innerHTML = URL;

	// Check that overlay corners are within ViewPort
    var fid = document.getElementById("Day").options.selectedIndex
    if( !VPbounds.intersects(forecasts[fid].bounds)){
		if(confirm("Map Outside ViewPort\nReCentre?")){
			map.setCenter(forecasts[fid].centre);
			centre = map.getCenter();
		}
	}
}


function newMap()
{
    var fid = document.getElementById("Day").options.selectedIndex
    var mapOptions = {
		zoom:               zoom,
		center:             forecasts[fid].centre,
		mapTypeId:          google.maps.MapTypeId.TERRAIN,
		scrollwheel:	    false,
		draggableCursor:    "crosshair",
		streetViewControl:  false,
		// overviewMapControl:  true,
		minZoom:            6,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_RIGHT
        },

	};

	return new google.maps.Map(document.getElementById("zoomBox"), mapOptions);
}


function view_sounding(n) {
	var sel = document.getElementById("Param");
	var opts = sel.options;
	
	for (var opt, j = 0; opt = opts[j]; j++) {
		if (opt.value == 'sounding' + n) {
			sel.selectedIndex = j;
			doChange();
			break;
		}
	}

	return false;
}

function addSoundingLink(marker, n)
{
	google.maps.event.addListener(
		marker,
		'click',
		function(){
			var text = "<a href='javascript:view_sounding(" + n + ");'>View " + soundings.NAM[n] + " sounding</a>"
			tooltip.close();
			tooltip = new google.maps.InfoWindow( { content: text });
			tooltip.open(map, marker);
		}
	);
}



// Needed for Status Report!
function popup(mylink, windowname, wid, ht)
{
	if (! window.focus)return true;
	var href;
	if (typeof(mylink) == 'string')
		href=mylink;
	else
		href=mylink.href;
	args = 'width=' + wid + ',height=' + ht + ',scrollbars=yes';
	// window.open(href, windowname, args);
	window.open(href, '', args);	// IE objects to a window name
	return false;
}



/********************************/
/* CallBack for onclick (image) */
/********************************/
function oneclick(E)
{
	// Catch a stupid selection
	if (document.getElementById("Param").value === "nope1") {
		return false;
	}
	if (document.getElementById("Param").value === "topo") {
		return false;
	}

	if(waslong){ // longclick
		waslong = false;
	}
	else {
		var i = document.getElementById("Time").selectedIndex;
		i = (i + 1) % times.length;
		document.getElementById("Time").options[i].selected   = true;
		doChange(E);
	}
}


/******************************************************
 * Check if "Value" or "Day" for param is implemented
 *
 * Returns: "" if not implemented
 *          Parameter name, or
 *          Two Parameter names for Vector Parameters
 ******************************************************/
function checkParam()
{
	var badParams = new Array();
	badParams[0]  = "";
	badParams[1]  = "boxwmax";
	badParams[2]  = "sounding1";
	badParams[3]  = "sounding2";
	badParams[4]  = "sounding3";
	badParams[5]  = "sounding4";
	badParams[6]  = "sounding5";
	badParams[7]  = "sounding6";
	badParams[8]  = "sounding7";
	badParams[9]  = "sounding8";
	badParams[10] = "sounding9";
	badParams[11] = "sounding10";
	badParams[12] = "sounding11";
	badParams[13] = "sounding12";
	badParams[14] = "sounding13";
	badParams[15] = "sounding14";
	badParams[16] = "sounding15";
	badParams[18] = "nope1";

	var param =document.getElementById("Param").value;
    if (badParams.includes(param))
        return "";
    
    if (param.startsWith('xbl_'))
        return '';

	/* Identify the Vector Params */
	if(param === "wstar_bsratio")	return("wstar bsratio");
	if(param === "sfcwind0")	return("sfcwind0spd sfcwind0dir");
	if(param === "sfcwind")		return("sfcwindspd sfcwinddir");
	if(param === "blwind")		return("blwindspd blwinddir");
	if(param === "bltopwind")	return("bltopwindspd bltopwinddir");
	if(param === "press1000")	return("press1000 press1000wspd press1000wdir");
	if(param === "press950")	return("press950 press950wspd press950wdir");
	if(param === "press850")	return("press850 press850wspd press850wdir");
	if(param === "press700")	return("press700 press700wspd press700wdir");
	if(param === "press500")	return("press500 press500wspd press500wdir");
	if(param === "wind950")		return("wind950spd wind950dir");
	if(param === "wind850")		return("wind850spd wind850dir");
	if(param === "zsfclclmask")		return("zsfclcl");
	if(param === "zblclmask")		return("zblcl");

	return param ;
}


/******************/
/* Set Image Size */
/******************/

var Format;

function setSize()
{
	var titleBox;
	var zoomBox;
	var scaleBox;
	var sideScaleBox;

	if(document.body.clientWidth !== undefined) {	// IE in various versions
		imgHt  = document.body.clientHeight;
		imgWid = document.body.clientWidth;
	}
	else if(document.documentElement && document.documentElement.clientWidth !== undefined) {
		imgHt  = document.documentElement.clientHeight;
		imgWid = document.documentElement.clientWidth;
	}
	else if(window.innerWidth !== undefined){
		imgHt  = window.innerHeight;
		imgWid = window.innerWidth;
	}
	else {	// FF etc
		imgHt  = document.body.scrollHeight;
		imgWid = document.body.scrollWidth;
	}

	// Subtract width of Selectors & add padding
	imgWid -= (document.getElementById("selectors").offsetWidth + 6 );
	imgHt  -= 6;

	// Determine whether image is Portrait or Landscape
	if(imgHt > imgWid){ Format = "Portrait";  }
	else              { Format = "Landscape"; }
	if(Format == "Landscape") {
		botHeight = 0  // Turn off Bottom Scale
		sideWidth = imgHt * 0.09;   // Ratio wid / ht
	}
	else {
		sideWidth = 0; // Turn Off Side Scale
		botHeight = imgWid * 0.09;
	}

	/* 
	 * See http://www.w3schools.com/Css/pr_class_position.asp
	 * for interaction of position = absolute, fixed, relative, static & inherit
	 */

	/* This messing allows variable size title in the centre */
	topWidth  =  imgWid - sideWidth;
	topHeight = topWidth * 0.08;		// Ht of Title: Ratio of img ht / wid

	titleD = document.getElementById("topDiv");
	titleD.style.overflow = "hidden";
	titleD.style.position = "relative";
	titleD.style. width = imgWid - sideWidth + "px";

	titleBox = document.getElementById("topTitle");
	titleBox.style.position = "relative" ;
	titleBox.style.left = (imgWid - sideWidth - topWidth) / 2 + "px";

	titleObj = document.getElementById("theTitle");
	titleObj.style.top      = 0 + "px";
	titleObj.style.height   = topHeight + "px";
	titleObj.style.width    = topWidth + "px";

	zoomBox = document.getElementById("zoomBox");
	zoomBox.style.left     = 0  + "px" ;
	zoomBox.style.top      = 0  + "px";
	zoomBox.style.height   = (imgHt - topHeight - botHeight ) + "px";
	zoomBox.style.width    = (imgWid - sideWidth) + "px";
	zoomBox.style.overflow = "hidden" ;
	zoomBox.style.position = "relative" ;

	sideScaleBox = document.getElementById("sideScale");
	sideScaleBox.style.overflow = "hidden" ;
	sideScaleBox.style.position = "relative" ;

	sideScaleObj = document.getElementById("theSideScale");
	sideScaleObj.style.left     = 0  + "px";
	sideScaleObj.style.top      = 0 + "px";
	sideScaleObj.style.width    = sideWidth  + "px";
	sideScaleObj.style.height   = zoomBox.style.height

	scaleBox = document.getElementById("botScale");
	scaleBox.style.overflow = "hidden" ;
	scaleBox.style.position = "relative" ;

	scaleObj = document.getElementById("theScale");
	scaleObj.style.left     = 0 + "px";
	scaleObj.style.top      = 0 + "px";
	scaleObj.style.height   = botHeight  + "px";
	scaleObj.style.width    = zoomBox.style.width;

	/* Now do the Selectors */

	tblHt = document.getElementById("selectors").offsetHeight;

	// alert("TableHt = " + tblHt + "ImgHt = " + imgHt);
			
	if( tblHt > imgHt ){
		document.getElementById("Param").size = 1;	// Number of visible Parameters
		document.getElementById("Time").size  = 1;	// Number of visible Times
		document.getElementById("Day").size   = 1;	// Number of visible Days
	}

	else { 							// The big Tables will fit
		document.getElementById("Param").size = 13;
		document.getElementById("Time").size  = 8;
		document.getElementById("Day").size   = 8;
	}
	doChange(null);
}


/* 
 * Set the times in the table for STD or DST
 *
 */
function setTimes()
{
	var dateJan = new Date(2012, 0, 1);
	var dateNow = new Date();

    var fid = document.getElementById("Day").selectedIndex;
    
    dateNow.setTime(forecasts[fid].date)

	if(dateNow.getTimezoneOffset() == dateJan.getTimezoneOffset())
		times = tzArray["STD"];
	else
		times = tzArray["DST"];

        // Keep the same time selected
	Tindex = document.getElementById("Time").selectedIndex;

	for(var i = 0; i < times.length; i++) {
		document.getElementById("Time").options[i] = new Option(times[i], times[i]);
		if(Tindex == i || (Tindex == -1 && times[i] == forecasts[fid].default_t))
			document.getElementById("Time").options[i].selected = true;
	}

}

function checkDate(strDate, expectedDate) {
    var d = strDate.split(' ')
    var gotDate = new Date(d[0], d[1] - 1, d[2])
    var expected = new Date()
    expected.setTime(expectedDate)
    
    var got = "{0} {1} {2}".format(gotDate.getFullYear(), gotDate.getMonth(), gotDate.getDate());
    var exp = "{0} {1} {2}".format(expected.getFullYear(), expected.getMonth(), expected.getDate());

    if (got != exp) {
        console.log("Got " + got);
        console.log("Exp " + exp);
        window.setTimeout( 'alert("Note: Forecast date doesn\'t match")', 1)
    }
}


function get_current_data_file(callback) {
        
    // check if the date is current or not
    var tIdx   = document.getElementById("Time").selectedIndex;
    var param  = checkParam();
    if (!param) {
        return;
    }
    var imgURL =  getBasedir() ;
    
    if (param.includes(' ')) {
        param = param.split(' ')[0]
    }

    var t = document.getElementById("Time").options[tIdx].value;
    var ximgURL = imgURL + "{0}.curr.{1}lst.d2.data".format(param, t);

    if (ximgURL in dataCache) {
        callback(dataCache[ximgURL])
    } else {
        getFile(ximgURL, function () {
            if (this.status != 200) return;

            data = parseData(ximgURL, this.response);
            dataCache[ximgURL] = data;
            callback(data)
        });
    }
}

/*******************************/
/* CallBack from the selectors */
/*******************************/
function doChange(E)
{
    tooltip.close();
	if(document.getElementById("Param").value === "nope1" ) {
		return 0;		// Catch a stupid selection
	}

	/*  Descriptions */
    var p = document.getElementById("Param");
    (document.getElementById("desc")).innerHTML = paramListFull[p.options[p.selectedIndex].getAttribute('data-id')][3] ;

	/* Clear saved images
	 * if changing to / from archiveMode,
	 * or Param or Day changes
	 */
	if(      (oldParam    !== document.getElementById("Param").value)
	      || (oldDayIndex !== document.getElementById("Day").selectedIndex)
	  ){
		for(i = 0; i < document.getElementById("Time").options.length; i++){
			Loaded[i] = false;
			if(Overlays[i]){
				Overlays[i].setMap(null);
				Overlays[i] = null;
			}
		}
		setTimes();
	}
	
	if (oldDayIndex !== document.getElementById("Day").selectedIndex) {
        // check if the date is current or not
        var fid = document.getElementById("Day").selectedIndex;
        
        get_current_data_file(function (data) {
            checkDate(data.header['Day'], forecasts[fid].date)
        })
    }


	/* Save current values, so can detect change */
	oldParam        = document.getElementById("Param").value;
	oldDayIndex     = document.getElementById("Day").selectedIndex;

	loadImage(1); // forwards
}

function getBasedir()
{
    return forecasts[document.getElementById("Day").selectedIndex].dir
}

function doUrl() // Set up URL link
{
	var T      = new Date();	// Initialised to "Now"
	var str = location.href.split("?")[0]
	offset = document.getElementById("Day").selectedIndex;
	if(offset > 1){
		T.setDate(T.getDate() + offset - 1);	// DayOfMonth - Deal with "Today-4Km"
	}
	month = T.getMonth() + 1;	// month now 1 to 12
	month = (month < 10) ? "0" + month : month;
	date  = T.getDate();
	date  = (date < 10) ? "0" + date : date;
	year  = T.getFullYear();

	str += "?"
		+ "date="     + year + month + date
		+ "&param="   + document.getElementById("Param").value
		+ "&time="    + document.getElementById("Time").value
		+ "&zoom="    + zoom
		+ "&opacity=" + opacity  
		+ "&centre="  + centre.toUrlValue(); 
	document.getElementById("Url").innerHTML = '<a href="' + str +'">Page URL</a>';
}


/************************************************/
/* Load the Image, and the next one             */
/* -1 => backwards; 0 => neither; 1 => forwards */
/************************************************/

function loadImage(dirn)
{
	var tIdx   = document.getElementById("Time").selectedIndex;
	var param  = document.getElementById("Param").value;

	if(paramWindow){	// and BLIPspot / skewT popup window
		paramWindow.close();
	}

	if(overlay){ // If already have an overlay, hide it
		overlay.hide();
	}

	// Sort out the img URL
	if(param == "topo"){
		var imgURL = "";
	}
	else {
		var imgURL =  getBasedir() ;
	}

	// Load image(s) / overlays and next one(s)
	for(x = tIdx, i = 0; i < 2; i++){
		if(!Loaded[x]){
			t = document.getElementById("Time").options[x].value;
			ximgURL = imgURL + param;
            ximgURL += ".curr." + t + "lst.d2" ;
			if(param.startsWith("sounding") || param == "boxwmax" || param.startsWith("xbl_")){
				isSounding = true;
				siz = (Format == "Landscape" ? imgHt : imgWid);
				Pics[x] = new Image(siz, siz);
				Pics[x].src = ximgURL + ".png" ;
			}
			else{
				isSounding = false;
				theTitles[x].src     = ximgURL + ".head.png";
				theSideScales[x].src = ximgURL + ".side.png";
				theScales[x].src     = ximgURL + ".foot.png";
				var fid = document.getElementById("Day").options.selectedIndex
				Overlays[x]          = new RASPoverlay(forecasts[fid].bounds,
				                                       ximgURL + ".body.png",
				                                       map,
				                                       i == 0 ? "visible" : "hidden" );
			}
			Loaded[x] = true;
		}
		x = (x + dirn) % times.length;
		x = (x < 0) ? times.length - 1 : x;
	}


	// Install the new Overlay or Sounding
	var imgData = document.getElementById("imgdata");
	if(!isSounding){	// Map
		if(wasSounding){
			wasSounding = false;
			if(!imgFragment)
				alert("Error! - No saved image fragment");
			imgData.replaceChild(imgFragment, imgData.firstChild);
		}

		for(x = 0; x < Overlays.length; x++){
			if(Overlays[x]){
				if(x == tIdx){ overlay = Overlays[x]; overlay.show(); }
				else         { Overlays[x].hide();    }
			}
		}

		document.getElementById("theTitle").src     = theTitles[tIdx].src;
		document.getElementById("theScale").src     = theScales[tIdx].src;
		document.getElementById("theSideScale").src = theSideScales[tIdx].src;

		overlay.setOpacity();
	}
	else {	// Sounding
		if(wasSounding == false){
			wasSounding = true;
			if(!imgFragment)
				imgFragment = document.createDocumentFragment();
			imgFragment.appendChild( document.getElementById("imgDiv")); // "appending" imgData removes it from old tree
			imgData.insertBefore( Pics[tIdx], imgData.firstChild);
		}
		else {
			imgData.replaceChild(Pics[tIdx], imgData.firstChild);
		}
		dunnit = imgData.firstChild.getAttribute("done");
		if( !dunnit || (dunnit && dunnit.length == 0)){	// null OR a zero-length string if no attribute
			if( typeof(attachEvent) != "undefined")
				imgData.firstChild.attachEvent('onclick', function(event) {oneclick(event);});
			else
				imgData.firstChild.addEventListener('click', function(event) {oneclick(event);});
			imgData.firstChild.setAttribute("done", true);
		}
	}
	doUrl();	// set up the Page URL
}

var imgFragment = null;


function doAirspace()
{
	var airspacetype = document.getElementsByClassName("airspace");

	for(i = 0; i < airspacetype.length; i++){
		if(airspacetype[i].checked){
			airspaceArray[i].setMap(map);
		}
		else{
			airspaceArray[i].setMap(null);
		}
	}
}

var Rect = function(ri, rj) {
    this.ri = ri;
    this.rj = rj;
}

Rect.prototype.splittable = function () {
    return this.ri.divisable() || this.rj.divisable();
}

Rect.prototype.split = function () {
    if (this.ri.length() > this.rj.length()) {
        var split = this.ri.split();
        return [new Rect(split[0], this.rj), new Rect(split[1], this.rj)];
    } else {
        var split = this.rj.split();
        return [new Rect(this.ri, split[0]), new Rect(this.ri, split[1])];
    }
}

Rect.prototype.ij = function () {
    return [this.ri.a, this.rj.a];
}

Rect.prototype.path = function (ll_table) {
    var path = [
        ll_table[this.rj.a][this.ri.a], 
        ll_table[this.rj.b][this.ri.a], 
        ll_table[this.rj.b][this.ri.b], 
        ll_table[this.rj.a][this.ri.b], 
    ];
        /*
    var j = this.rj.a;
    for (var i = this.ri.a, to = this.ri.b; i < to; i++) {
        path.push(ll_table[j][i]);
    }
    
    var i = this.ri.b;
    for (var j = this.rj.a, to = this.rj.b; j < to; j++) {
        path.push(ll_table[j][i]);
    }
    
    var j = this.rj.b;
    for (var i = this.ri.b, to = this.ri.a; i > to; i--) {
        path.push(ll_table[j][i]);
    }
    
    var i = this.ri.a;
    for (var j = this.rj.b, to = this.rj.a; j > to; j--) {
        path.push(ll_table[j][i]);
    }*/

    return path.map(function (p) { return {lat: p[0], lng: p[1] }});
}


var Range = function(a, b) {
    if (a >= b) {
        alert ("problem");
    }
    this.a = a;
    this.b = b;
}

Range.prototype.divisable = function () {
    return (this.a + 1) < this.b
}

Range.prototype.length = function () {
    return this.b - this.a;
}

Range.prototype.split = function () {
    var one = new Range(this.a, this.a + Math.floor(this.length() / 2));
    var two = new Range(this.a + Math.floor(this.length() / 2), this.b);
    return [one, two];
}

function _latlon2ij(latLng, rect, ll_table) {
    if (!rect.splittable()) {
        return rect.ij();
    }
    
    var split = rect.split()
    
    for (var i = 0; i < 2; i++) {
        var test = split[i];
        
        var path = test.path(ll_table);
                
        var poly = new google.maps.Polygon({paths: path});
        
//         debug mode
//         poly.setMap(map);

        if (google.maps.geometry.poly.containsLocation(latLng, poly)) {
            return _latlon2ij(latLng, test, ll_table);
        }
    }
}

// Finds i,j correspoinding to specified coordinates
function latlon2ij(latLng, ll_table) {
    iRange = new Range(0, ll_table[0].length - 1);
    jRange = new Range(0, ll_table.length - 1);
    var rect = new Rect(iRange, jRange);
    
    return _latlon2ij(latLng, rect, ll_table);
}

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function get_single_value(name, line) {
    rx = new RegExp(name + '= ([^\\s]+)');
    var v = rx.exec(line);
    return v[1];
}

function get_day(name, line) {
    rx = new RegExp(name + '= ([0-9\\s]+)');
    var v = rx.exec(line);
    return v[1];
}

var dataCache = {};

function parseData(fname, txt) {
    var lines = txt.split('\n');

    var data = {};
    var header = data.header = {};
    var init = false;
    // The first data row is for the grid row having the smallest y index, i.e. the most "southerly" row, 
    // with subsequent rows being for increasing y index values. The actual value at each grid point is the 
    // printed data value divided by the given multiplication factor.
    var table = data.table = [];
    for(var i = 0, maxi = lines.length - 1; i < maxi ; i ++) {
        var line = lines[i].trim();
        if (line == '---') continue;
        if (!init) { // ignore header line
            init = true;
            continue;
        }
        if (line.startsWith('Model'))   // Model line
            continue;
        if (line.startsWith('Day')) { // date, etc line
            // Day= 2017 8 22 TUE ValidLST= 1400 CES ValidZ= 1200 Fcst= 24.0 Init= 12 Param= sfcwind Direction Unit= m/sec Mult= 1 Min= 170 Max= 190
            header['Day'] = get_day('Day', line)
            header['Mult'] = parseInt(get_single_value('Mult', line));
            header['Unit'] = get_single_value('Unit', line);
            continue;
        }

        table.push(line.split(' ').map(function(v) { return parseInt(v) * header['Mult'] }));
    }
    
    return data;

}

function getUnit(unit) {
    switch (unit) {
        case '~K~Truncated':
            return '';
        case 'W/m~S~2~N~':
            return 'W/m<sup>2</sup>'
        default:
            return unit;
    }
}

var tooltip = new google.maps.InfoWindow({
    content: ""
});


var dist_start = null;

function measure_start(lat, lon) {
    tooltip.close();
    dist_start = new google.maps.LatLng(lat, lon);
    return false;
}

// Define the overlay, derived from google.maps.OverlayView
function Label(opt_options) {
	// Initialization
	this.setValues(opt_options);
	
	// Label specific
	var span = this.span_ = document.createElement('span');
	span.style.cssText = 'position: relative; left: -50%; top: -8px; ' +
	                     'white-space: nowrap; border: 1px solid blue; ' +
	                     'padding: 2px; background-color: white';
	
	var div = this.div_ = document.createElement('div');
	div.appendChild(span);
	div.style.cssText = 'position: absolute; display: none';
}
Label.prototype = new google.maps.OverlayView();

// Implement onAdd
Label.prototype.onAdd = function() {
	var pane = this.getPanes().floatPane;
	pane.appendChild(this.div_);
	
	// Ensures the label is redrawn if the text or position is changed.
	var me = this;
	this.listeners_ = [
		google.maps.event.addListener(this, 'position_changed',
			function() { me.draw(); }),
		google.maps.event.addListener(this, 'text_changed',
			function() { me.draw(); })
	];
};

// Implement onRemove
Label.prototype.onRemove = function() {
	var i, I;
	this.div_.parentNode.removeChild(this.div_);
	
	// Label is removed from the map, stop updating its position/text.
	for (i = 0, I = this.listeners_.length; i < I; ++i) {
		google.maps.event.removeListener(this.listeners_[i]);
	}
};

// Implement draw
Label.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.get('position'));
	
	var div = this.div_;
	div.style.left = position.x + 'px';
	div.style.top = position.y + 'px';
	div.style.display = 'block';
	
	this.span_.innerHTML = this.get('text').toString();
};

function measure_end(lat, lon) {
    tooltip.close();
    var dist_end = new google.maps.LatLng(lat, lon)
    var pathCoords = [dist_start, dist_end];
    var path = new google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path.setMap(map);
    
    var inBetween = google.maps.geometry.spherical.interpolate(dist_start, dist_end, 0.5);  
    
    var labelMarker = new google.maps.Marker({
        position: inBetween,  
        map: map,
        visible: false
    });
    var distance = google.maps.geometry.spherical.computeDistanceBetween(dist_start, dist_end);
    var myLabel = new Label();
    myLabel.bindTo('position', labelMarker, 'position');
    myLabel.set('text',  (distance / 1852).toFixed(1) + 'NM');
    myLabel.setMap(map);

    dist_start = null;
    return false;
}

function showTooltip(data, ij, latLng) {
    tooltip.close();
    content = '';
    if (data && ij) {
        content = data.table[ij[1]][ij[0]] + ' ' + getUnit(data.header.Unit);
    }
    if (content.length > 0) {
        content += '<br/><br/>';
    }
    if (dist_start == null) {
        content += '<a href="javascript:;" onclick="measure_start({0},{1})">Measure distance from here</a>'.format(latLng.lat(),
            latLng.lng());
    } else {
        content += '<a href="javascript:;" onclick="measure_end({0},{1})">Measure distance to here</a>'.format(latLng.lat(),
            latLng.lng());
    }
    tooltip.setContent(content);
    tooltip.setPosition(latLng)
    tooltip.open(map);
}

function newclick(E)
{
	var tail;
	var parameter;
    
//     console.log(E.latLng.lat(), E.latLng.lng())
    
    var fid = document.getElementById("Day").options.selectedIndex

	if( !forecasts[fid].bounds.contains(E.latLng)){ // Outside forecast area!
        console.log('Outside boundaries')
        showTooltip(null, null, E.latLng);
		return;
	}
	
	var latlon_file = forecasts[fid].latlon_file;

    if (!latLon2d[latlon_file]) {
        getFile(forecasts[fid].latlon_file, function () {
            if(this.status != 200) {
                console.warn(latlon_file + ' cannot be found')
                showTooltip(null, null, E.latLng);
                return;
            }
            latLon2d[latlon_file] = eval(this.response);
            newclick(E);
        });
        showTooltip(null, null, E.latLng);
        return;
    }
    
    ij = latlon2ij(E.latLng, latLon2d[latlon_file]);
    if (!ij) { 
        console.log('No IJ');
        showTooltip(null, null, E.latLng);
        return ;
    };
    
    get_current_data_file(function (data) {
        showTooltip(data, ij, E.latLng);
    });
}


function LongClick(map, length) {
    this.tId;
    this.length_ = length;
    var me = this;
    google.maps.event.addListener(map, 'mousedown', function(e) { return me.onMouseDown_(e); });
    document.addEventListener("mouseup", function(e) { return me.onMouseUp_(e); });
    google.maps.event.addListener(map, 'dragstart', function(event) {
        clearTimeout(me.tId);
    });
    google.maps.event.addListener(map, 'bounds_changed', function(event) {
        clearTimeout(me.tId);
    });

}

LongClick.prototype.onMouseUp_ = function(e) {
    var now = new Date();

    if (now - this.down_ < this.length_) {
        clearTimeout(this.tId);
    }
}

LongClick.prototype.onMouseDown_ = function(e) {
    this.down_ = new Date();
    this.tId = setTimeout(function () {
        waslong = true;
        google.maps.event.trigger(map, 'longpress', e);
    }, 1000);
}

/**** Subclass Google Maps OverlayView() to add Opacity ****/

function cancelEvent(e)
{
	e = e ? e : window.event;
	if(e.stopPropagation) e.stopPropagation();
	if(e.preventDefault)  e.preventDefault();
	e.cancelBubble = true;
	e.cancel = true;
	e.returnValue = false;
	return false;
}

/**
* Get the position of the mouse relative to the document.
* @param {Object} e  Mouse event
* @return {Object} left & top position
*/
function getMousePosition(e)
{
	var posX = 0, posY = 0;
	e = e || window.event;
	if (typeof e.pageX !== "undefined") {
		posX = e.pageX;
		posY = e.pageY;
	}
	else if (typeof e.clientX !== "undefined") {
		posX = e.clientX + (typeof document.documentElement.scrollLeft !== "undefined" ? document.documentElement.scrollLeft : document.body.scrollLeft);
		posY = e.clientY + (typeof document.documentElement.scrollTop  !== "undefined" ? document.documentElement.scrollTop  : document.body.scrollTop);
	}
	return {
		left: posX,
		top: posY
	};
};


/**
 * Get the position of an HTML element relative to the document.
 * @param {Object} h  HTML element
 * @return {Object} left & top position
 */
function getElementPosition(h)
{
	var posX = h.offsetLeft;
	var posY = h.offsetTop;
	var parent = h.offsetParent;
	// Add offsets for all ancestors in the hierarchy
	while (parent !== null) {
		// Adjust for scrolling elements which may affect the map position.
		//
		// See http://www.howtocreate.co.uk/tutorials/javascript/browserspecific
		//
		// "...make sure that every element [on a Web page] with an overflow
		// of anything other than visible also has a position style set to
		// something other than the default static..."
		if (parent !== document.body && parent !== document.documentElement) {
			posX -= parent.scrollLeft;
			posY -= parent.scrollTop;
		}
		posX += parent.offsetLeft;
		posY += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return {
		left: posX,
		top: posY
	};
};



function getMousePoint(e)
{
	var mousePosn = mousePos_;
	if (!mousePosn) {
		return null;
	}
	var mapPosn = getElementPosition(map.getDiv());
	return new google.maps.Point(mousePosn.left - mapPosn.left, mousePosn.top - mapPosn.top);
};


var mousePos_ = null;
function myMouseMove_(e) {
	mousePos_ = getMousePosition(e);
};



var p = null;

function myMouseWheel_(e)
{
	e = e || window.event;
	if (e.wheelDelta) { // IE/Opera/Chrome. 
		delta = e.wheelDelta/120;
		if (window.opera)
			delta = -delta; // In Opera 9, delta differs in sign as compared to IE
	}
	else if (e.detail) { // Mozilla & friends
		delta = -e.detail / 3.0; // Sgn(delta) opposite
	}
	if(e.shiftKey){	// Adjust Opacity
		opacity += 3 * delta; // "opacity" ensures all overlays have this opacity
		opacity = (opacity > 100) ? 100 : opacity;
		opacity = (opacity < 0)   ?   0 : opacity;
		overlay.setOpacity();
		// Set slider too
		var newsliderValue = OPACITY_MAX_PIXELS * (opacity/ 100);
		opacityCtrlKnob.setValueX(newsliderValue);
	}
	else{ // Adjust Zoom
		cancelEvent(e);
		p = getMousePoint(e);	// mouse posn on map in pixel coords - top left is (0,0)
		if (!p) {
			return;
		}
		var div = map.getDiv();
		var cX = div.offsetWidth  / 2;	// centre of map (pixel coords)
		var cY = div.offsetHeight / 2;
		var z = map.getZoom();

		if(delta > 0) {
			if(z < 12){
				z++;
				map.panBy((p.x-cX)/2, (p.y-cY)/2);
			}
		}
		else {
			if(z > 6){	// Do nothing if zoom == 6 (minZoom)
				z--;
				map.panBy(cX-p.x, cY-p.y);
			}
		}
		map.setZoom(z);
		zoom = z;
	}
}

RASPoverlay.prototype = new google.maps.OverlayView();

function RASPoverlay(bounds, image, map, vis)
{
	this.bounds_        = bounds;
	this.url_           = image;
	this.map_           = map;
	this.id             = image;
	this.div            = null;

	// Is this IE, if so we need to use AlphaImageLoader
	var agent = navigator.userAgent.toLowerCase();
	if ((agent.indexOf("msie") > -1) && (agent.indexOf("opera") < 1)) {
		this.ie = true ;
	}
	else {
	 this.ie = false ;
	}

	this.vis_	    = vis;
	this.setMap(map);
}

var L = null;	// Flags wheelListener Loaded

RASPoverlay.prototype.onAdd = function()
{
	var div = document.createElement("div") ;
	div.style.border      = "none";
	div.style.borderwidth = "0px";
	div.style.position    = "absolute" ;
	div.setAttribute('id',this.id) ;

	var img = document.createElement("img");
	img.src          = this.url_;
	img.style.border = "none";
	img.style.width  = "100%";
	img.style.height = "100%";
	img.style.position = "absolute";
	div.appendChild(img);

	this.div_ = div;

	var panes = this.getPanes();
 	panes.overlayLayer.appendChild(div);

	google.maps.event.addDomListener(this.map_.getDiv(), 'mousemove',      function (e) { myMouseMove_(e); },  true);

	if (!L){ L = google.maps.event.addDomListener(this.map_.getDiv(), 'wheel',     function (e) { myMouseWheel_(e); }, true); }

	var o = opacity / 100;
	if      (typeof(div.style.opacity)      == 'string') { div.style.opacity      = o ; }
	else if (typeof(div.style.KHTMLOpacity) == 'string') { div.style.KHTMLOpacity = o ; }
	else if (typeof(div.style.MozOpacity)   == 'string') { div.style.MozOpacity   = o ; }
	else if (typeof(div.style.filter)       == 'string') { div.style.filter = 'alpha(opacity=' + opacity + ')'; } //<IE9
 	div.style.visibility = this.vis_;
}

RASPoverlay.prototype.draw = function()
{
	var overlayProjection = this.getProjection();

	if(overlayProjection == undefined)
		return;

	var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

	// Position our DIV using our bounds
	var div = this.div_;
	div.style.left   = sw.x + "px";
	div.style.top    = ne.y + "px";
	div.style.width  = ne.x - sw.x + "px";
	div.style.height = sw.y - ne.y + "px";
}

// Remove the main DIV from the map pane
RASPoverlay.prototype.onRemove = function()
{
	this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
}

/* 
 * Opacity utility functions
 */
RASPoverlay.prototype.isVisible = function()
{
	return ( this.div_ ? ((this.div_.style.visibility == 'visible') ?  true : false ) : false);
}

RASPoverlay.prototype.hide = function()
{
	if(this.div_){
		this.div_.style.visibility = 'hidden';
	}
}

RASPoverlay.prototype.show = function()
{
	if(this.div_){
		this.div_.style.visibility = 'visible';
	}
}

RASPoverlay.prototype.setOpacity=function()
{
	var c = opacity/100 ;
	var d = document.getElementById( this.id ) ;

	if (d) {
		if      (typeof(d.style.opacity)      == 'string') { d.style.opacity      = c ; }
		else if (typeof(d.style.KHTMLOpacity) == 'string') { d.style.KHTMLOpacity = c ; }
		else if (typeof(d.style.MozOpacity)   == 'string') { d.style.MozOpacity   = c ; }
		else if (typeof(d.style.filter)       == 'string') { d.style.filter = 'alpha(opacity='+opacity+')'; } //<IE9

		doUrl();
	}
}


/* indexOf function - For Widnows Exploder < IE9 */
if (!Array.prototype.indexOf){
	Array.prototype.indexOf = function(val, fromIndex) {
		if (typeof(fromIndex) != 'number')
			fromIndex = 0;
		for(var index = fromIndex,len = this.length; index < len; index++)
			if (this[index] == val)
				return index;
			return -1;
	}
}

function createOpacityControl(map)
{
	var sliderImageUrl = "slider.png";

	// Create main div to hold the control.
	var opacityDiv = document.createElement('DIV');
	opacityDiv.setAttribute("style", "margin:5px;overflow-x:hidden;overflow-y:hidden;background:url(slider.png) no-repeat;width:71px;height:21px;cursor:pointer;");
	opacityDiv.setAttribute("class", "gmnoprint");	// Do not include on a printout

	// Create knob
	var opacityKnobDiv = document.createElement('DIV');
	opacityKnobDiv.setAttribute("style", "padding:0;margin:0;overflow-x:hidden;overflow-y:hidden;background:url(slider.png) no-repeat -71px 0;width:14px;height:21px;");
	opacityDiv.appendChild(opacityKnobDiv);

	opacityCtrlKnob = new ExtDraggableObject(opacityKnobDiv, {
		restrictY: true,
		container: opacityDiv
	});

	google.maps.event.addListener(opacityCtrlKnob, "drag", function () {
		setKnobOpacity(opacityCtrlKnob.valueX());
	});

	google.maps.event.addDomListener(opacityDiv, "click", function (e) {
		var left = findPosLeft(this);
		sliderPos = e.pageX - left - 5; // - 5 as we're using a margin of 5px on the div
		opacityCtrlKnob.setValueX(sliderPos);
		setKnobOpacity(opacityCtrlKnob.valueX());
	});

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(opacityDiv);

	// Set initial value
	var initialValue = OPACITY_MAX_PIXELS * (opacity/ 100);
	opacityCtrlKnob.setValueX(initialValue);
	// setKnobOpacity(opacityCtrlKnob.valueX());
	opacity_control = "Y";
}

function setKnobOpacity(pixelX) {
	// Range = 0 to OPACITY_MAX_PIXELS
	opacity = (100 / OPACITY_MAX_PIXELS) * pixelX;
	if (opacity < 0)   opacity = 0;
	if (opacity > 100) opacity = 100;
	for(var o = 0; o < Overlays.length; o++){
		if(Overlays[o] ){
			Overlays[o].setOpacity();
		}
	}
}

function findPosLeft(obj) {
	var curleft = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
		} while (obj = obj.offsetParent);
		return curleft;
	}
	return undefined;
}


/* Install Soundings Markers */
function addSndMarkers()
{
	// Install the markers - but only if needed
	if(markerArray && markerArray[1]){	// No Sounding0
		return;
	}
	var siz    = 20;
	var anchor = siz / 2; 
	var sndImg = new google.maps.MarkerImage(
	                   "sndmkr.png",                   // url
	                   new google.maps.Size(siz,siz),  // size
	                   new google.maps.Point(0,0),   // origin
	                   new google.maps.Point(anchor,anchor), // anchor
	                   new google.maps.Size(siz,siz)   // scaledSize
	                 );

	for(i = 1; i < soundings.LOC.length; i++ ){	// No Sounding0 !!
		var marker = new google.maps.Marker({
		                   position:  soundings.LOC[i],
		                   title:     soundings.NAM[i],
		                   icon:      sndImg,
		                   optimized: false,
		                   flat:      true,
		                   map:       map,
		                   content:   i
		             });
		addSoundingLink(marker, i);	// For unexplained reasons, this must be a separate function!
		markerArray.push(marker);
	}
}

function pr(text) {
    console.log(text);
}
