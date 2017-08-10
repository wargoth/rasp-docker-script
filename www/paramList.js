/************************************
 * Parameter Lists									*
 *																	*
 * Full List is first								*
 *																	*
 * Lite List chooses from Full List	*
 ***********************************/

var paramList = 	[

/****************************************************************
 *                                                              *
 *  [ Style Class Name, Value, Description, Full Description ]  *
 *                                                              *
 *  NOTE: Style Class Names are defined in the .html file       *
 *                                                              *
 ****************************************************************/


/* 0 */ ["optionBoldRed",  "nope1",					"- - - THERMAL PARAMETERS - - -", " "],

/* 1 */ ["optionBoldBlue", "wstar_bsratio",	"Thermal Updraft Velocity & B/S Ratio", "A composite plot displaying the Thermal Updraft Velocity contours in colors overlaid by a stipple representing the Buoyancy/Shear Ratio.  The stipple is heavy for B/S Ratios 0-4 and light for B/S Ratios 4-7.  The intent is to mark regions where a small B/S Ratio will make thermals difficult (or impossible) to work, though that depends upon pilot skill and circling radius"],

/* 2 */ ["", "wstar",					"Thermal Updraft Velocity (W*)", "Average dry thermal updraft strength near mid-BL height.  Subtract glider descent rate to get average vario reading for cloudless thermals.  Updraft strengths will be stronger than this forecast if convective clouds are present, since cloud condensation adds buoyancy aloft (i.e. this neglects cloudsuck).  W* depends upon both the surface heating and the BL depth"],

/* 3 */ ["",		 "bsratio",				"Buoyancy/Shear Ratio", "Dry thermals may be broken up by vertical wind shear (i.e. wind changing with height) and unworkable if B/S ratio is 5 or less.  [Though hang-gliders can soar with smaller B/S values than can sailplanes.]  If convective clouds are present, the actual B/S ratio will be larger than calculated here due to the neglect of 'cloudsuck'.  [This parameter is truncated at 10 for plotting.]"],

/* 4 */ ["optionBoldBlue",		 "hwcrit",				"Ht of Critical Updraft Strength (225fpm)", "This parameter estimates the height at which the average dry updraft strength drops below 225 fpm and is expected to give better quantitative numbers for the maximum cloudless thermalling height than the BL Top height forecast, especially when mixing results from vertical wind shear rather than thermals.  (Note: the present assumptions tend to underpredict the max. thermalling height for dry consitions.) In the presence of clouds the maximum thermalling height may instead be limited by the cloud base. Being for dry thermals, this parameter omits the effect of cloudsuck"],

/* 5 */ ["optionBoldBlue",		 "dwcrit",				"Depth of Critical Updraft Strength (AGL Hcrit)", "This is the Height above Ground of the Critical Updraft Strength (qv), i.e. when the updraft strength falls below 225 fpm"],

/* 6 */ ["",		 "hbl",						"BL Top", "Height of the top of the mixing layer, which for thermal convection is the average top of a dry thermal.  Over flat terrain, maximum thermalling heights will be lower due to the glider descent rate and other factors.  In the presence of clouds (which release additional buoyancy aloft, creating cloudsuck) the updraft top will be above this forecast, but the maximum thermalling height will then be limited by the cloud base. Further, when the mixing results from shear turbulence rather than thermal mixing this parameter is not useful for glider flying.  NB: this BL Top is not the height where the Thermal Index (TI) is zero, which is a criteria used by many simple determinations of the BL top - instead, the RASP BL Top uses a more sophisticated BL Top criteria based on turbulent fluxes"],

/* 7 */ ["",		 "dbl",						"BL Depth", "Depth of the layer mixed by thermals or (vertical) wind shear.  This parameter can be useful in determining which flight direction allows better thermalling conditions when average surface elevations vary greatly in differing directions.  (But the same cautions mentioned under Height of BL Top also apply.)  It is also an important determinant of thermals strength (as is the Surface Heating)"],

/* 8 */ ["",		 "hglider",				"Thermalling Height", "This is the minimum of the height at which updraft strength falls below 225 fpm, the Cu Cloudbase and the OverDevelopment Cloudbase. It might thus indicate the maximum soaring height which is achievable in thermals, clear of cloud. Note that the plot of 'Height of Critical Updraft Strength (175fpm)' is calculated for 175 fpm, not 225 fpm as is used here"],

/* 9 */ ["",		 "bltopvariab",		"Thermal Height Uncertainty", "This parameter estimates the uncertainty (variability) of the BL Top height prediction which can result from meteorological variations.  Specifically, it gives the expected increase of a BL Top height based on a Thermal Index (TI) = 0 criteria should the actual surface temperature be 4 °F warmer than forecast.  Larger values indicate greater uncertainty/variability and thus better thermalling over local 'hot spots' or small-scale topography not resolved by the model.  But larger values also indicate greater sensitivity to error in the predicted surface temperature, so actual conditions have a greater likelihood of differing from those predicted.  Small values often result from the presence of a stable (inversion) layer capping and limiting thermal growth.  This parameter is most easily utilized through relative values, i.e. by first determining a 'typical' value for a location and subsequently noting whether predictions for a given day are for more/less uncertainty than is typical."],

/* 10 */ ["", 	"experimental1",	"Ht of Critical Updraft Strength (175fpm)", "This parameter estimates the height at which the average dry updraft strength drops below 175 fpm and is expected to give better quantitative numbers for the maximum cloudless thermalling height than the BL Top height forecast, especially when mixing results from vertical wind shear rather than thermals.  (Note: the present assumptions tend to underpredict the max. thermalling height for dry conditions.) In the presence of clouds the maximum thermalling height may instead be limited by the cloud base. Being for dry thermals, this parameter omits the effect of cloudsuck"],

/* 11 */ ["optionBoldBlue",		 "zwblmaxmin",		"MSL Height of max/min Wbl", "Height at which the max / min of the vertical velocity in the Boundary Layer occurs, i.e. of \"BL Max Up/Down (Convergence)\" (qv)"],

/* 12 */ ["",		 "sfcshf",				"Sfc.Heating", "Heat transferred into the atmosphere due to solar heating of the ground, creating thermals.  This parameter is an important determinant of thermal strength (as is the BL depth).  This parameter is obtained directly from WRF model output and not from a BLIPMAP computation."],

/* 13 */ ["", "sfcsunpct",			"Normalized Sfc. Sun", "The 'Solar Radiation' actually reaching the surface divided by the amount of solar radiation which would reach the surface in a dry atmosphere (i.e. in the absence of clouds and water vapor), expressed as a percentage.  This parameter indicates the degree of cloudiness, i.e. where clouds limit the sunlight reaching the surface."],

/* 14 */ ["",		 "sfctemp",				"Sfc.Temperature", "The temperature at a height of 2m above ground level.  This can be compared to observed surface temperatures as an indication of model simulation accuracy; e.g. if observed surface temperatures are significantly below those forecast, then soaring conditions will be poorer than forecast.  This parameter is obtained directly from WRF model output and not from a BLIPMAP computation."],

/* 15 */ ["",		 "sfcdewpt", 			"Sfc.Dewpoint", "The dew point temperature at a height of 2m above ground level.  This can be compared to observed surface dew point temperatures as an indication of model simulation accuracy; e.g. if observed surface dew point temperatures are significantly below those forecast, then BL cloud formation will be poorer than forecast.  This parameter is obtained directly from WRF model output and not from a BLIPMAP computation."],

/* 16 */ ["optionBoldRed",  "nope1", 				"- - - WIND PARAMETERS - - -", ""],

/* 17 */ ["",		 "mslpress", 			"MSL Pressure", "Atmospheric Pressure at Mean Sea Level in mBar"],

/* 18 */ ["",		 "sfcwind0", 			"Sfc.Wind (2m)", "The speed and direction of the wind 2m above the ground.  Speed is depicted by different colors and direction by streamlines.  This parameter is obtained directly from WRF model output and not from a BLIPMAP computation."],

/* 19 */ ["optionBoldBlue",		 "sfcwind", 			"Sfc.Wind (10m)", "The speed and direction of the wind at 10m above the ground.  Speed is depicted by different colors and direction by streamlines.  This parameter is obtained directly from WRF model output and not from a BLIPMAP computation."],

/* 20 */ ["optionBoldBlue", "blwind", 				"BL Avg. Wind", "The speed and direction of the vector-averaged wind in the BL.  This prediction can be misleading if there is a large change in wind direction through the BL (for a complex wind profile, no single number is an adequate descriptor!)."],

/* 21 */ ["",		 "bltopwind", 		"Wind at BL Top", "The speed and direction of the wind at the top of the BL.  Speed is depicted by different colors and direction by streamlines."],

/* 22 */ ["",		 "blwindshear", 	"BL Wind Shear", "The vertical change in wind through the BL, specifically the magnitude of the vector wind difference between the top and bottom of the BL.  Note that this represents vertical wind shear and does not indicate so-called 'shear lines' (which are horizontal changes of wind speed/direction)."],

/* 23 */ ["optionBoldBlue", "wblmaxmin", 		"BL Max. Up/Down (Convergence)", "Maximum grid-area-averaged extensive upward or downward motion within the BL as created by horizontal wind convergence.  Positive convergence is associated with local small-scale convergence lines (often called 'shear lines' by pilots, which are horizontal changes of wind speed/direction) - however, the actual size of such features is much smaller than can be resolved by the model so only stronger ones will be forecast and their predictions are subject to much error.  If CAPE is also large, thunderstorms can be triggered.  Negative convergence (divergence) produces subsiding vertical motion, creating low-level inversions which limit thermalling heights.  This parameter can be noisy, so users should be wary.  For a grid resolution of 12km or better convergence lines created by terrain are commonly predicted - sea-breeze predictions can also be found for strong cases, though they are best resolved by smaller-resolution grids."],

/* 24 */ ["optionBoldRed",  "nope1", 				"- - - CLOUD PARAMETERS - - -", ""],

/* 25 */ ["",		 "zsfclcldif", 		"Cu Potential", "This evaluates the potential for small, non-extensive 'puffy cloud' formation in the BL, being the height difference between the surface-based Lifted Condensation Level (LCL) and the BL top.  Small cumulus clouds are (simply) predicted when the parameter is positive, but it is quite possible that the threshold value is actually greater than zero for your location so empirical evaluation is advised.  Clouds can also occur with negative values if the air is lifted up the indicated vertical distance by flow up a small-scale ridge not resolved by the model's smoothed topography."],

/* 26 */ ["",		 "zsfclcl", 			"Cu Cloudbase (Sfc.LCL) MSL", "This height estimates the cloudbase for small, non-extensive 'puffy' clouds in the BL, if such exist i.e. if the Cumulus Potential parameter (above) is positive or greater than the threshold Cumulus Potential empirically determined for your site.  The surface LCL (Lifting Condensation Level) is the level to which humid air must ascend before it cools enough to reach a dew point temperature based on the surface mixing ratio and is therefore relevant only to small clouds - unlike the below BL-based CL which uses a BL-averaged humidity.  However, this parameter has a theoretical difficulty and quite possibly that the actual cloudbase will be higher than given here - so perhaps this should be considered a minimum possible cloudbase."],

/* 27 */ ["optionBoldBlue", "zsfclclmask", 	"Cu Cloudbase where CuPotential > 0", "This plot is a combination of the value of the 'Cumulus Potential for non-extensive puffy cloud' (LCL - which indicates areas where cloud may form) and the 'Lifted Condensation Level' (the level to which humid air must rise to form cloud). It thus depicts the Cumulus Cloudbase at locations where cumulus may form and so alleviates the need to look at both Cumulus Potential and Cumulus Cloudbase plots. Note that the threshold Cumulus Potential should be empirically determined for your site, which has not been done for the UK: it is assumed to approximate to the theoretical value of zero.  For locations where the actual threshold is greater than zero, as is often the case, this depiction will over-estimate the extent of the cumulus region."],

/* 28 */ ["",		 "zblcldif", 			"OD Potential", "This evaluates the potential for extensive cloud formation (OvercastDevelopment) at the BL top, being the height difference between the BL CL (see below) and the BL top.  Extensive clouds and likely OD are predicted when the parameter is positive, with OD being increasingly more likely with higher positive values.  OD can also occur with negative values if the air is lifted up the indicated vertical distance by flow up a small-scale ridge not resolved by the model's smoothed topography.  [This parameter is truncated at -10,000 for plotting.]"],

/* 29 */ ["",		 "zblcl", 				"OD Cloudbase (BL CL) MSL", "This height estimates the cloudbase for extensive BL clouds (OvercastDevelopment), if such exist, i.e. if the OvercastDevelopment Potential parameter (above) is positive.  The BL CL (Condensation Level) is based upon the humidity averaged through the BL and is therefore relevant only to extensive clouds (OvercastDevelopment) - unlike the above surface-based LCL which uses a surface humidity.  [This parameter is truncated at 22,000 for plotting.]"],

/* 30 */ ["optionBoldBlue", "zblclmask", 		"OD Cloudbase where ODpotential > 0", "Combining the previous two parameters, this depicts the OvercastDevelopment (OD) Cloudbase only at locations where the OD Potential parameter is positive.  This single plot can be used, instead of needing to look at both the OD Potential and OD Cloudbase plots, if the threshold OD Potential empirically determined for your site approximately equals the theoretical value of zero."],

/* 31 */ ["",		 "blcwbase", 			"BL Cld-Base if CloudWater predicted", "This parameter is primarily for DrJack's use.  It predicts the cloud base of extensive clouds based on model-predicted formation of cloud water, giving the lowest height at which the predicted cloud water density is above a criterion value within the BL.  In theory it should be useful predicting OvercastDevelopment (OD) within the BL since it predicts extensive cloudiness, i.e. when BL clouds are predicted to extend over a full model gridcell volume.  However, the criterion to be used to indicate the presence of clouds is problematical since no single value reliably differentiates between 'mist' and 'cloud' concentrations.  This parameter has not yet been verified again actual conditions - comparision to flight observations will be needed to evaluate its usefulness."],

/* 32 */ ["",		 "blcloudpct", 		"BL Cloud Cover", "This parameter provides an additional means of evaluating the formation of clouds within the BL and might be used either in conjunction with or instead of the other cloud prediction parameters.  It assumes a very simple relationship between cloud cover percentage and the maximum relative humidity within the BL.  The cloud base height is not predicted, but is expected to be below the BL Top height.  DrJack does not have a lot of faith in this prediction, since the formula used is so simple, and expects its predictions to be very approximate - but other meteorologists have used it and it is better than nothing.  Note: Since The the 'BL Cloud Cover', 'Cumulus Potential', and 'BL Extensive CloudBase' are based upon fundamentally different model predictions -- respectively the predicted maximum moisture in the BL, the predicted surface moisture, and an explicit cloud-water prediction -- they can yield somewhat differing predictions, e.g. the 'Cumulus Potential' can predict puffy cloud formation when the 'BL Cloud Cover' is zero or vice versa."],

/* 33 */ ["",		 "rain1", 				"Rain", "Rain accumulated over the last hour. Note that this requires a forecast for the previous hour, so it is not possible to plot this parameter until 1 hour after the first forecast for the day."],

/* 34 */ ["",		 "cape", 					"CAPE", "Convective Available Potential Energy indicates the atmospheric stability affecting deep convective cloud formation above the BL.  A higher value indicates greater potential instability, larger updraft velocities within deep convective clouds, and greater potential for thunderstorm development (since a trigger is needed to release that potential).  Note that thunderstorms may develop in regions of high CAPE and then get transported downwind to regions of lower CAPE.  Also, locations where both convergence and CAPE values are high can be subject to explosive thunderstorm development."],

/* 35 */ ["",			"blicw",				"BL Integrated Cloud Water", "This parameter is primarily for DrJack's use.  It predicts the cloud base of extensive clouds based on model-predicted formation of cloud water, giving the lowest height at which the predicted cloud water density is above a criterion value within the BL.  In theory it should be useful predicting OvercastDevelopment (OD) within the BL since it predicts extensive cloudiness, i.e. when BL clouds are predicted to extend over a full model gridcell volume.  However, the criterion to be used to indicate the presence of clouds is problematical since no single value reliably differentiates between 'mist' and 'cloud' concentrations.  This parameter has not yet been verified again actual conditions - comparision to flight observations will be needed to evaluate its usefulness."],


/* 36 */ ["optionBoldRed",  "nope1", 				"- - - WAVE PARAMETERS - - -", ""],

/* 37 */ ["",		 "press1000", 		"Vertical Velocity at 1000mb", "Vertical velocity at a constant pressure level of 1000mb, plus wind speed/direction barbs.  [1000mb presure level is essentially Surface]  Such upward motions can result from mountain wave or BL convergence.  A white dashed straight-line represents the location of the slice used for the [Vertical Velocity Slice through Vertical Velocity Maximum] parameter since these parameters are intended to be used in conjunction.  These parameters are obtained directly from WRF model output and not from a BLIPMAP computation"],

/* 38 */ ["",		 "press950", 			"Vertical Velocity at 950mb", "Vertical velocity at a constant pressure level of 950mb, plus wind speed/direction barbs.  [950mb presure level is approximately 1000 ft AMSL or 300 m AMSL.]  Such upward motions can result from mountain wave or BL convergence.  A white dashed straight-line represents the location of the slice used for the [Vertical Velocity Slice through Vertical Velocity Maximum] parameter since these parameters are intended to be used in conjunction.  These parameters are obtained directly from WRF model output and not from a BLIPMAP computation"],

/* 39 */ ["",		 "press850", 			"Vertical Velocity at 850mb", "Vertical velocity at a constant pressure level of 850mb, plus wind speed/direction barbs.  [850mb presure level is approximately at 5000 ft AMSL or 1500 m AMSL.]  Such upward motions can result from mountain wave or BL convergence.  A white dashed straight-line represents the location of the slice used for the [Vertical Velocity Slice through Vertical Velocity Maximum] parameter since these parameters are intended to be used in conjunction.  These parameters are obtained directly from WRF model output and not from a BLIPMAP computation"],

/* 40 */ ["",		 "press700", 			"Vertical Velocity at 700mb", "Vertical velocity at a constant pressure level of 700mb, plus wind speed/direction barbs.  [700mb presure levels is approximately at 8000 ft AMSL or 2500 m AMSL.]  Such upward motions can result from mountain wave or BL convergence.  A white dashed straight-line represents the location of the slice used for the [Vertical Velocity Slice through Vertical Velocity Maximum] parameter since these parameters are intended to be used in conjunction.  These parameters are obtained directly from WRF model output and not from a BLIPMAP computation"],

/* 41 */ ["",		 "press500", 			"Vertical Velocity at 500mb", "Vertical velocity at a constant pressure level of 500mb, plus wind speed/direction barbs.  [500mb presure levels are approximately at 19000 ft AMSL or 5800 m AMSL.]  Such upward motions can result from mountain wave or BL convergence.  A white dashed straight-line represents the location of the slice used for the [Vertical Velocity Slice through Vertical Velocity Maximum] parameter since these parameters are intended to be used in conjunction.  These parameters are obtained directly from WRF model output and not from a BLIPMAP computation"],

/* 42 */ ["",		 "boxwmax", 			"Vert.Velocity Slice at Vert.Vel.Max", "A vertical slice depicting vertical velocity (colors) and potential temperature (lines), intended to help analyze occurrences of strong upward motion.  The slice is taken through the location of the maximum vertical velocity found at a height of approximately 5000 ft AGL over a domain which excludes the outer edge of the domain (the value of that maximum and its location is given in a subtitle of the plot).  The slice parallells the wind direction at that height and is depicted by a white dashed line on the [Vertical Velocity at 1000/950/850/700/500mb] paramter plots (with left-right on the slice always being left-right on the plan view).  Mt. wave predictions are best made using resultions no larger than 4km, since a coarser grid generally does not resolve the waves accurately.  Mountain waves tend to occur above the surface and tilt upwind with height, whereas BL convergences are surface-based and vertically oriented.  These parameters are obtained directly from WRF model output and not from a BLIPMAP computation"],

/* 43 */ ["optionBoldRed",  "nope1", 				"- - - SOUNDINGS - - -", ""],

/* 44 */ ["",		 "sounding1", 		"#1: EL1", "Predicted SkewT*LogP Sounding Chart for EL1"],

/* 45 */ ["",		 "sounding2", 		"#2: EL2", "Predicted SkewT*LogP Sounding Chart for EL2"],

/* 46 */ ["",		 "sounding3", 		"#3: EL4", "Predicted SkewT*LogP Sounding Chart for EL4"],

/* 47 */ ["",		 "sounding4", 		"#4: EL7", "Predicted SkewT*LogP Sounding Chart for EL7"],

/* 48 */ ["",		 "sounding5", 		"#5: Henrietta", "Predicted SkewT*LogP Sounding Chart for Henrietta"],

/* 49 */ ["",		 "sounding6", 		"#6: Fremont Pk", "Predicted SkewT*LogP Sounding Chart for Fremont Peak"],

/* 50 */ ["",		 "sounding7", 		"#7: Panoche", "Predicted SkewT*LogP Sounding Chart for Panoche"]

];



var	paramListFull  = [
	paramList[0],
	paramList[1],
	paramList[2],
	paramList[3],
	paramList[4],
	paramList[5],
	paramList[6],
	paramList[7],
	paramList[8],
	paramList[9],
	paramList[11],
	paramList[12],
	paramList[13],
	paramList[14],
	paramList[15],
	paramList[16],
	paramList[19],
	paramList[20],
	paramList[21],
	paramList[22],
	paramList[23],
	paramList[24],
	paramList[25],
	paramList[26],
	paramList[27],
	paramList[28],
	paramList[29],
	paramList[30],
	paramList[31],
	paramList[32],
	paramList[34],
	paramList[36],
	paramList[39],
	paramList[40],
	paramList[41],
	paramList[42],
	paramList[43],
	paramList[44],
	paramList[45],
	paramList[46],
	paramList[47],
	paramList[48],
	paramList[49],
	paramList[50]
];

var paramListLite  = [
	paramList[0],
	paramList[1],
// 	paramList[2],
	// paramList[3],
	paramList[4],
	paramList[5],
	// paramList[6],
	// paramList[7],
	// paramList[8],
	// paramList[9],
	paramList[11],
	// paramList[12],
// 	paramList[13],
	// paramList[14],
	// paramList[15],
	paramList[16],
	// paramList[17],
	paramList[19],
	paramList[20],
	// paramList[21],
	// paramList[22],
	paramList[23],
	paramList[24],
	// paramList[25],
	// paramList[26],
	paramList[27],
	// paramList[28],
	// paramList[29],
	paramList[30],
	// paramList[31],
	// paramList[32],
	// paramList[33],
	// paramList[34],
	// paramList[35],
	paramList[36],
	// paramList[37],
	// paramList[38],
	paramList[39],
	paramList[40],
	paramList[41],
	// paramList[42],
	paramList[43],
	paramList[44],
	paramList[45],
	paramList[46],
	paramList[47],
	paramList[48],
	paramList[49],
	paramList[50]
];
