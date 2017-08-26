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

var fullSet;

var oldParam;
var times;

var map;
var overlay = null;
var markerArray = [];
var infoArray = [];
var airspaceArray = [];
var ASstring;
var Event;

var paramWindow = null;
var origTblHt;
var imgHt;
var imgWid;
var topHeight;

var map;
var resolution;
var opacity = 50;	// default opacity
var centre;
var zoom = 8;		// default zoom
var ctrFlag = false;
var OPACITY_MAX_PIXELS = 57; // Width of opacity control image
var opacity_control = "N";
var opacityCtrlKnob;

var waslong = "N";	// longclick
var wasSounding = false ;

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

	oldDayIndex = document.getElementById("Day").options.selectedIndex;
	oldParam = document.getElementById("Param").options.value;

	/* There is a bug in FF 1.5 & 2 with DOMMouseScroll - look for ffversion below */
	if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
		ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
	}

	/**********************/
	/* Build the Day Menu */
	/**********************/

	var Now = new Date().getTime();	// Time now - in milliSec(!)
	var mS_Day = 24 * 60 * 60 * 1000;	// mS in a day
	var T = new Date();			// Instantiate a Date object
	var dayName   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var day = document.getElementById("Day");	// save typing
    
    var NUM_DAYS = 6

	T.setTime(Now);					// Today
	day.options[0] = new Option(dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()] + " - Today", mkdat(T));
    for (i = 1; i < NUM_DAYS; i++) {
        T.setTime(Now + mS_Day * i);
        day.options[i] = new Option(dayName[T.getDay()] + ' ' + T.getDate() + ' ' + monthName[T.getMonth()], mkdat(T));
    }


	/***********************/
	/* Set Default Options */
	/***********************/

	// Set Short Param List
	fullSet = false;
	for(var i = 0; i < paramListLite.length; i++) {
		document.getElementById("Param").options[i] = new Option(paramListLite[i][2], paramListLite[i][1]);
		document.getElementById("Param").options[i].className = paramListLite[i][0];
	}

	// Install Handlers
	document.getElementById("Param").onchange        = doChange;
	document.getElementById("Day").onchange          = doChange;
	document.getElementById("Time").onchange         = doChange;
	document.getElementById("paramSet").onmousedown  = switchParamList;


	/* Install Time options and adjust Table times for DST
		 Assume that Standard Time is in force on Jan 1 2012
		 And Daylight Saving Time in the summer"
		 May be incorrect in southern hemisphere
		 See also setTimes()
	 */
	dateNow = new Date();
	dateJan = new Date(2012, 0, 1)
	if(dateNow.getTimezoneOffset() == dateJan.getTimezoneOffset())
		times = tzArray["STD"];
	else
		times = tzArray["DST"];

	for(var i = 0; i < times.length; i++) {
		document.getElementById("Time").options[i] = new Option(times[i], times[i]);
		if(times[i] == '1400')
			document.getElementById("Time").options[i].selected = true;
	}

	document.getElementById("Day").options[0].selected    = true;				// Today
	document.getElementById("Param").options[2].selected  = true;				// hcrit
	document.getElementById("desc").innerHTML             = paramListLite[document.getElementById("Param").selectedIndex][3] ;

	/* Sort out Archive years for 1 year */
	T.setTime(Now - 366 * mS_Day);


	for(i = 0; i < document.getElementById("Time").options.length; i++){
		theScales[i]     = new Image();
		theSideScales[i] = new Image();
		theTitles[i]     = new Image();
		Overlays[i]      = null;
		Loaded[i]        = false;
	}

	resolution = getResolution();
	centre = corners.Centre[resolution];

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
					switchParamList();
					for(j = 0; j < document.getElementById("Param").options.length; j++){
						if(document.getElementById("Param").options[j].value == prams[1]){
							document.getElementById("Param").options[j].selected = true;
							break;
						}
					}
					if(j == document.getElementById("Param").options.length){
						switchParamList();	// Put back if not found
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
					archiveMode = false;
				}
				else{
					archiveMode = true;
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

	new LongClick(map, 3000);	// longclick

	// map.fitBounds(Bnds);	// This seems to zoom out rather too much!

	setSize();

	// Install handlers for the map
	google.maps.event.addListener(map, 'rightclick',     function(event) { newclick(event);             });	// R-Click and longpress
	google.maps.event.addListener(map, 'longpress',      function(event) { newclick(event);             });	// do the same thing
// 	google.maps.event.addListener(map, 'click',          function(event) { oneclick(event);             });
	google.maps.event.addListener(map, 'dragend',        function(event) { constrainMap(event);         });
	google.maps.event.addListener(map, 'zoom_changed',   function(event) { constrainMap(event);         });

	// Install airspaces
	var airspaceOpts = {
		// map:  map,	// Don't specify map yet - done when AS is switched on
		preserveViewport: true
	};

	url = location.href;
	head = url.slice(0, url.lastIndexOf('/'))
	var airspacetype = document.getElementById("airspace");
	for(i = 0; i < airspacetype.length; i++){
		airspacetype[i].checked = false;	// Clear Airspace checkboxes
		ASstring = head + "/" + airspacetype[i].value ;
		airspaceArray[i] = new google.maps.KmlLayer(ASstring, airspaceOpts);
	}

	doChange(null);
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
        if( !VPbounds.intersects(corners.Bounds[resolution])){
		if(confirm("Map Outside ViewPort\nReCentre?")){
			map.setCenter(corners.Centre[resolution]);
			centre = map.getCenter();
		}
	}
}


function newMap()
{
	var mapOptions = {
		zoom:               zoom,
		center:             corners.Centre[resolution],
		mapTypeId:          google.maps.MapTypeId.TERRAIN,
		scrollwheel:	    false,
		draggableCursor:    "crosshair",
		streetViewControl:  false,
		// overviewMapControl:  true,
		minZoom:            6,
		maxZoom:            12
	};

	map = new google.maps.Map(document.getElementById("zoomBox"), mapOptions);
	return( map );
}



function addSoundingLink(marker, n)
{
	google.maps.event.addListener(
		marker,
		'click',
		function(){
			ctrFlag = true;
			centre = map.getCenter();
			var sndURL = '<img src="' + Server + getBasedir() + '/';
			sndURL += 'FCST/sounding' + n + '.curr.'
					+ document.getElementById("Time").value 
					+ 'lst.d2.png" height=800 width=800>' ;
					// + 'lst.d2.png" height=400 width=400>' ;
			var infowindow = new google.maps.InfoWindow( { content: sndURL });
			infoArray.push(infowindow);
			infowindow.open(map, marker);
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


// Get the run status from the Modeller, via a cgi-bin script
function getStatus()
{
	url = Server + "cgi-bin/statusChk.cgi";
	popup( url, 'Status Report', 650, 450);
}


/*
 * Need to distinguish Single vs Double Click
 *
 * doclick() is always called: Set timeout
 *
 * If dblclick() fires within timeout, reset timer (default actions follow)
 * Else oneclick() runs
 *
 */
var	timeoutId;

function doclick()
{
	timeoutId = setTimeout(oneclick, 500);
}


function dblclick()
{
	clearTimeout(timeoutId);
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

	if(waslong == "Y"){ // longclick
		waslong = "N";
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
	// badParams[17] = "topo" ;
	// badParams[18] = "zblclmask" ;
	// badParams[19] = "zsfclclmask" ;

	var param =document.getElementById("Param").value;
	for(i = 0; i < badParams.length; i++) 
		if( param === badParams[i])
			return "" ;

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

	return param ;
}

			
var req = false;

function doCallback(url, data, Event)
{
	/************************************************/
	/* This stuff needed if running from file://... */
	/* DELETE THE LINE BELOW TO INCLUDE  */
	/*
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	} catch (e) {
		alert("Permission UniversalBrowserRead denied.");
	}
	*/
	/* AND THE LINE ABOVE */
	// End This stuff needed
	/************************************************/
	if (window.XMLHttpRequest) {
		try { req = new XMLHttpRequest(); }
		catch (e) { req = false; }
	}
	else if (window.ActiveXObject) {
		// For Internet Explorer on Windows
		try { req = new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { req = new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) { req = false; }
		}
	}
	if (req) {
		req.onreadystatechange = function(){
			if(req.readyState == 4 && req.status == 200){
				addInfo(Event.latLng, '<pre>' + req.responseText + '</pre>');
			}
		}
		try { req.open('POST', url, true); }
		catch (E){ alert(E); }
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(data);
	}
	else { alert("Failed to send XML data"); }
}

var text;

// Determine the Map Resolution
function getResolution()
{
	if(archiveMode) {
		return(2);
	}
	else {
		switch( document.getElementById("Day").options.selectedIndex){
		case 0:	return( 2);	break;  // Today    - 2Km
		case 1: 
		case 2: 
		case 3:                     // Rest of week - 12Km
		case 4:
		case 5:
		case 6: 
		case 7: return(4); break;
		default:
			alert("getResolution: Unknown Day Index!");
			return(12);	// What else?
			break;
		}
	}
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
	topHeight *= TitleScale;
	topWidth  *= TitleScale;

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


/********************/
/* Check if Archive */
/* 0 => normal      */
/* 1 => archive     */
/********************/
var archiveMode = false;
var oldArchive = false;
var oldArchiveDay;
var oldArchiveMonth;
var oldArchiveYear;

function isArchive()
{
	archiveMode = false;
}


function resetArchive()
{
}

/* 
 * Set the times in the table for STD or DST
 *
 */
function setTimes()
{
	var dateJan = new Date(2012, 0, 1);
	var dateNow = new Date();

		var mS_Day = 24 * 60 * 60 * 1000;	// mS in a day

	switch( document.getElementById("Day").selectedIndex ){
	case 0:                                                     break;     // Today   - 2km
	case 1:                                                     break;     // Today   - 12km
	case 2: dateNow = new Date(dateNow.valueOf() +     mS_Day); break;     // Today+1 - 4km
	case 3: dateNow = new Date(dateNow.valueOf() + 2 * mS_Day); break;     // Today+2 - 4km
	case 4: dateNow = new Date(dateNow.valueOf() + 3 * mS_Day); break;     // Today+3 - 4km
	case 5: dateNow = new Date(dateNow.valueOf() + 4 * mS_Day); break;     // Today+4 - 4km
	case 6: dateNow = new Date(dateNow.valueOf() + 5 * mS_Day); break;     // Today+5 - 4km
	case 7: dateNow = new Date(dateNow.valueOf() + 6 * mS_Day); break;     // Today+6 - 4km
	}

	if(dateNow.getTimezoneOffset() == dateJan.getTimezoneOffset())
		times = tzArray["STD"];
	else
		times = tzArray["DST"];

        // Keep the same time selected
	Tindex = document.getElementById("Time").selectedIndex;

	for(var i = 0; i < times.length; i++) {
		document.getElementById("Time").options[i] = new Option(times[i], times[i]);
		if(Tindex == i)
			document.getElementById("Time").options[i].selected = true;
	}
}

/*******************************/
/* CallBack from the selectors */
/*******************************/
function doChange(E)
{
	if(document.getElementById("Param").value === "nope1" ) {
		return 0;		// Catch a stupid selection
	}

	/*  Descriptions */
	if(fullSet){
		(document.getElementById("desc")).innerHTML = paramListFull[document.getElementById("Param").selectedIndex][3] ;
	}
	else {
		(document.getElementById("desc")).innerHTML = paramListLite[document.getElementById("Param").selectedIndex][3] ;
	}

	if (oldArchive == true && archiveMode == false){ // Change to Normal mode
		document.getElementById("Day").disabled = false;
		document.getElementById("Day").options[oldDayIndex].selected = true;
	}

	/* Clear saved images
	 * if changing to / from archiveMode,
	 * or Param or Day changes
	 */
	if(      (oldParam    !== document.getElementById("Param").value)
	      || (oldDayIndex !== document.getElementById("Day").selectedIndex)
	      || (oldArchive  !== archiveMode)
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

	// Change the resolution if Day changes	
	if(oldDayIndex !== document.getElementById("Day").selectedIndex){
		resolution = getResolution();
	}

	/* Save current values, so can detect change */
	oldParam        = document.getElementById("Param").value;
	oldDayIndex     = document.getElementById("Day").selectedIndex;
	oldArchive      = archiveMode;

	loadImage(1); // forwards
}

function getBasedir()
{
	var basedir;

	switch(document.getElementById("Day").selectedIndex){
		case 0: basedir = "OUT"; break;
		case 1: basedir = "OUT+1"; break;
		case 2: basedir = "OUT+2"; break; // Both 4Km runs go into the same directory 
		case 3: basedir = "OUT+3"; break;
		case 4: basedir = "OUT+4"; break;
		case 5: basedir = "OUT+5"; break;
		case 6: basedir = "OUT+6"; break;
		case 7: basedir = "OUT+7"; break;
		default: alert("getBasedir: Bad day selector: " + document.getElementById("Day").selectedIndex); break;
	}
	return(basedir);
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
	var imgURL;
	var tIdx   = document.getElementById("Time").selectedIndex;
	var param  = document.getElementById("Param").value;

	deleteInfo();		// Remove the InfoWindows
	if(paramWindow){	// and BLIPspot / skewT popup window
		paramWindow.close();
	}

	if(overlay){ // If already have an overlay, hide it
		overlay.hide();
	}

	// Sort out the img URL
	if(param == "topo"){
		imgURL = "";
	}
	else {
		imgURL =  Server + getBasedir() + "/FCST/" ;
	}

	// Load image(s) / overlays and next one(s)
	for(x = tIdx, i = 0; i < 2; i++){
		if(!Loaded[x]){
			t = document.getElementById("Time").options[x].value;
			ximgURL = imgURL + param;
			if(param == "topo"){
				ximgURL += resolution;
			}
			else{
				ximgURL += ".curr." + t + "lst.d2" ;
			}
			if(param.startsWith("sounding") || param.startsWith("boxwmax")){
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
				Overlays[x]          = new RASPoverlay(corners.Bounds[resolution], ximgURL + ".body.png", map);
				Overlays[x].setMap(map);
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

		if ( opacity_control == "N" ) {	
			createOpacityControl(map); 
			opacity_control = "Y";
		}

		document.getElementById("theTitle").src     = theTitles[tIdx].src;
		document.getElementById("theScale").src     = theScales[tIdx].src;
		document.getElementById("theSideScale").src = theSideScales[tIdx].src;

		for(x = 0; x < Overlays.length; x++){
			if(Overlays[x]){
				if(x == tIdx){
					overlay = Overlays[x];
					// Big kludge to wait until overlay is loaded :-(
					window.setTimeout( "overlay.setOpacity();", 0);
				}
				else {
					Overlays[x].hide();
				}
			}
		}

		addSndMarkers();

		// Handle Centre & Zoom - e.g. if specified in URL
		google.maps.event.addListener(map, "tilesloaded", function() { overlay.setOpacity()} );
		map.setCenter(centre);
		// map.setZoom(zoom);

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
			imgData.firstChild.setAttribute("done");
		}
	}
	doUrl();	// set up the Page URL
}

var imgFragment = null;


function doAirspace()
{
	var airspacetype = document.getElementById("airspace");

	for(i = 0; i < airspacetype.length; i++){
		if(airspacetype[i].checked){
			airspaceArray[i].setMap(map);
		}
		else{
			airspaceArray[i].setMap(null);
		}
	}
}


function newclick(E)
{
	return;
	var tail;
	var parameter;
	var str;
	var lat;
	var lon;

	clearTimeout(timeoutId);

	if( !corners.Bounds[resolution].contains(E.latLng)){ // Outside forecast area!
		return;
	}

	str = E.latLng.toUrlValue();
	lat = str.split(',')[0];
	lon = str.split(',')[1];

	parameter = checkParam();
	if(parameter === "") {
		addInfo(E.latLng, "<pre>Values for " + document.getElementById("Param").value + "\n are not available</pre>");
		return;
	}
	// Get type of Popup from Radio Button Selector
	var el = document.getElementById("popup").info;
	for(i = 0; i < el.length; i++){
		if(el[i].checked)
			infoPopup = el[i].value;
	}

	switch(infoPopup){
	case "XBL":
			if(document.getElementById("Param").value.slice(0,5) != "press"){
				addInfo(E.latLng, "<pre>Only implemented for Wave Parameters!<br>See Full Parameter Set</pre>");
				return;
			}

			wrffile = getRegion();
			blipSpotUrl = Server + "cgi-bin/get_rasp_xbl.cgi";
			tail = "region=" + wrffile
			                 + "&grid="   + "d2"
			                 + "&day=" 
			                 + "&lat="    + lat
			                 + "&lon="    + lon
			                 + "&time="   + document.getElementById("Time").value
			                 + "&param="  + document.getElementById("Param").value
			;
			addInfo(E.latLng, "<pre>See PopUp Window<br>Stipple => Cloud<br>&Delta; indicates posn</pre>");
			// alert("diff = " + diff + "\ntail = " + tail);
			paramWindow = window.open(blipSpotUrl + "?" + tail, 'XBL', 'height=850,width=850');
			return;
	case "SkewT":
			wrffile = getRegion();
			blipSpotUrl = Server + "cgi-bin/get_rasp_skewt.cgi";
			tail = "region=" + wrffile
			                 + "&grid="   + "d2"
			                 + "&day="
			                 + "&lat="    + lat
			                 + "&lon="    + lon
			                 + "&time="   +  document.getElementById("Time").value
			;
			addInfo(E.latLng, "<pre>See PopUp Window</pre>");
			// alert("diff = " + diff + "\ntail = " + tail);
			paramWindow = window.open(blipSpotUrl + "?" + tail, 'SkewT', 'height=850,width=850');
			return;
	case "Value":
			blipSpotUrl = Server + "cgi-bin/get_rasp_blipspot.cgi";
			str = getBasedir().replace("\+", "%2b"); // %2b == '+'

			tail = "region=" + str
			     + "&grid="   + "d2"
			     + "&day="
			     + "&linfo=1"
			     + "&lat="        + lat
			     + "&lon="        + lon
			     + "&time="       + document.getElementById("Time").value + "lst"
			     + "&param="      + parameter ;
			     ;
			// alert("URL = " + blipSpotUrl + "\n\ntail = " + tail);
			doCallback(blipSpotUrl, tail, E);

			break;
	case "Day":
			blipSpotUrl = Server + "cgi-bin/get_rasp_blipspot.cgi";
			str = getBasedir().replace("\+", "%2b"); // %2b == '+'

			tail = "region=" + str
			     + "&grid="   + "d2"
			     + "&day="
			     + "&linfo=1"
			     + "&lat="        + lat
			     + "&lon="        + lon
			     + "&param=" + parameter ;
			     ;
			// alert("URL = " + blipSpotUrl + "\n\ntail = " + tail);
			doCallback(blipSpotUrl, tail, E);

			break;
	}
}


function getRegion()
{
	switch(document.getElementById("Day").selectedIndex){
		case 0: regn = "OUT%2b0"; break;
		case 1: regn = "OUT%2b1";   break;
		case 2: regn = "OUT%2b2"; break; // Both +1 runs go into the same directory 
		case 3: regn = "OUT%2b3"; break;
		case 4: regn = "OUT%2b4"; break;
		case 5: regn = "OUT%2b5"; break;
		case 6: regn = "OUT%2b6"; break;
		case 7: regn = "OUT%2b7"; break;
		default: alert("Bad day selector: " + document.getElementById("Day").selectedIndex); break;
	}
	return(regn);
}



function addInfo(location, txt)
{
	var infoOpts;
	var longline = false;

	// if((imgWid < 480) || (imgHeight < 480))	// Remove other infoWindows on small screens
	//	deleteInfo();
	
	var el = document.getElementById("popup").info;

	for(i = 0; i < el.length; i++){
		if(el[i].checked)
			infoPopup = el[i].value;
	}

	var nlines = 2;	// Always need at least two lines to  prevent scroll bars
	var ind = 0;
	var longline = false;
	for(var start = 0; (ind = txt.indexOf("\n", start)) > -1; start++, nlines++){
		if(ind - start > 50)
			longline = true;
		start = ind;
	}
	// Deal also with html <br>'s
	for(var start = 0; (ind = txt.indexOf("<br>", start)) > -1; start++, nlines++){
		if(ind - start > 50)
			longline = true;
		start = ind;
	}

	if(longline)	// Allow for bottom scrollbar
		nlines++;
	txt1 = '<div style="height: ' + nlines + 'em;" >' + txt + '</div>';

	infoOpts = {
	           position: location,
	           map:      map,
		   maxHeight: 50,
	           content:  txt1
	};
	var infowindow = new google.maps.InfoWindow( infoOpts );
	infowindow.open(map);
	infoArray.push(infowindow);

	// This is a bit kludgy - Adjust *every* infowindow each time - but it seems to work!
	google.maps.event.addDomListenerOnce(infowindow, 'domready', function(event) {
			var arr = document.getElementsByTagName("pre");
			for(var e = 0; e < arr.length; e++){
				arr[e].parentNode.parentNode.style.overflow = 'visible';
			}
		}, true
	);
}

function deleteInfo()
{
	if (infoArray) {
		for(i  = 0; i < infoArray.length; i++) {
			infoArray[i].setMap(null);
		}
		infoArray.length = 0;
		if(ctrFlag){
			map.panTo(centre); // Centre the map if Sounding has scrolled it
			ctrFlag = false;
		}
	}
}


/*
function writePopup(text)
{
	var txt;

	if(text.lastIndexOf('\n') - text.indexOf('\n') > 1){
		// txt = document.getElementById("Param").value + "<br>" + text.replace(/\n/, (document.getElementById("Param").value === "wstar_bsratio" ? "<br>BS: ": "<br>Dirn: "));
		txt = text.replace(/\n/, (document.getElementById("Param").value === "wstar_bsratio" ? "<br>BS: ": "<br>Dirn: ")) ;
	}
	else {
		// txt = document.getElementById("Param").value + "<br>" + text;
		txt = text +"<br>";
	}
	// alert('Text = "' + text + '"\nPosn = ' + Event.latLng)
	addInfo(Event.latLng, txt, 80, 120);
}
*/


function switchParamList(E)
{
	if(fullSet){
		changeParamset(paramListLite);
		document.getElementById("paramSet").innerHTML = "Press for Full Parameter set";
	}
	else{
		changeParamset(paramListFull);
		document.getElementById("paramSet").innerHTML = "Press for Reduced Parameter set";
	}
}
		

function changeParamset(newParams)
{
	for(var i = 0; i < newParams.length; i++) {
		document.getElementById("Param").options[i] = new Option(newParams[i][2], newParams[i][1]);
		document.getElementById("Param").options[i].className = newParams[i][0];
	}
	if(document.getElementById("Param").options.length > newParams.length){
		for(i = newParams.length; i < document.getElementById("Param").length; i++){
			document.getElementById("Param").options[i] = null;
		}
	}
	document.getElementById("Param").options.length = newParams.length;
	fullSet = ((fullSet == true) ? false : true);

	// The parameter punter had selected is available as oldParam !!
	for(var i = 0; i < document.getElementById("Param").options.length; i++){
		if(document.getElementById("Param").options[i].value == oldParam)
			break;
	}
	if(i == document.getElementById("Param").options.length){
		document.getElementById("Param").options[1].selected = true;	// Not available
	}
	else{
		document.getElementById("Param").options[i].selected =true;
	}
}

function LongClick(map, length) {
    this.length_ = length;
    var me = this;
    me.map_ = map;
    google.maps.event.addListener(map, 'mousedown', function(e) { me.onMouseDown_(e) });
    google.maps.event.addListener(map, 'mouseup',   function(e) { me.onMouseUp_(e)   });
}

LongClick.prototype.onMouseUp_ = function(e) {
    var now = new Date;
    if (now - this.down_ > this.length_) {
      google.maps.event.trigger(this.map_, 'longpress', e);
      waslong = "Y";
    }
}

LongClick.prototype.onMouseDown_ = function() {
    this.down_ = new Date;
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

function RASPoverlay(bounds, image, map)
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
}

var mouseWheelListener_   = null; 
var mouseWheelListener2_  = null; 

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
	div.appendChild(img);

	this.div_ = div;

	var panes = this.getPanes();
 	panes.overlayLayer.appendChild(div);

	if( !mouseWheelListener_  )
		mouseWheelListener_  = google.maps.event.addDomListener(this.map_.getDiv(), 'mousewheel',     function (e) { myMouseWheel_(e); }, true);
	if( !mouseWheelListener2_ )
		mouseWheelListener2_ = google.maps.event.addDomListener(this.map_.getDiv(), 'DOMMouseScroll', function (e) { myMouseWheel_(e); }, true);
	this.mouseMoveListener_   = google.maps.event.addDomListener(this.map_.getDiv(), 'mousemove',      function (e) { myMouseMove_(e); },  true);
}

RASPoverlay.prototype.draw = function()
{
	var overlayProjection = this.getProjection();

	if(overlayProjection == undefined)
		return;

	var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

	// Position our DIV using our bounds
	if(this.div_ == null)
		return;
	this.div_.style.left   = Math.min(sw.x,  ne.x) + "px";
	this.div_.style.top    = Math.min(ne.y,  sw.y) + "px";
	this.div_.style.width  = Math.abs(sw.x - ne.x) + "px";
	this.div_.style.height = Math.abs(ne.y - sw.y) + "px";

	this.hide();	// show() is run later
}

// Remove the main DIV from the map pane
RASPoverlay.prototype.onRemove = function()
{
	this.div_.parentNode.removeChild(this.div_);
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
		this.show();
		if (typeof(d.style.filter)       == 'string') { d.style.filter = 'alpha(opacity=' + opacity + ')'; } //IE
		if (typeof(d.style.KHTMLOpacity) == 'string') { d.style.KHTMLOpacity = c ; }
		if (typeof(d.style.MozOpacity)   == 'string') { d.style.MozOpacity = c ; }
		if (typeof(d.style.opacity)      == 'string') { d.style.opacity = c ; }
		doUrl();
	}
}


RASPoverlay.prototype.getOpacity=function()
{
	var d = document.getElementById(this.id);
	if(d){
		if (typeof(d.style.filter)       == 'string') { d.style.filter = 'alpha(opacity=' + opacity + ');'; } //IE
		if (typeof(d.style.KHTMLOpacity) == 'string') { return(100 * d.style.KHTMLOpacity); }
		if (typeof(d.style.MozOpacity)   == 'string') { return(100 * d.style.MozOpacity);   }
		if (typeof(d.style.opacity)      == 'string') { return(100 * d.style.opacity);      }
	}
	return(undefined);
}

// add indexOf function - For the dreaded m$ Widnows Exploder
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
	setKnobOpacity(opacityCtrlKnob.valueX());
}

function setKnobOpacity(pixelX) {
	// Range = 0 to OPACITY_MAX_PIXELS
	opacity = (100 / OPACITY_MAX_PIXELS) * pixelX;
	if (opacity < 0)   opacity = 0;
	if (opacity > 100) opacity = 100;
	for(var o = 0; o < Overlays.length; o++){
		if(Overlays[o] && Overlays[o].isVisible()){
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
