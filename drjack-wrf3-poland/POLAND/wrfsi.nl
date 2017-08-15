&project_id
 SIMULATION_NAME = 'Poland'
 USER_DESC = 'yavalek'
/
&filetimespec
 START_YEAR = 2002,
 START_MONTH = 05,
 START_DAY = 13,
 START_HOUR = 12,
 START_MINUTE = 00,
 START_SECOND = 00,
 END_YEAR = 2002,
 END_MONTH = 05,
 END_DAY = 14,
 END_HOUR = 00,
 END_MINUTE = 00,
 END_SECOND = 00,
 INTERVAL = 10800
/
&hgridspec
 NUM_DOMAINS = 2
 XDIM = 49
 YDIM = 35
 PARENT_ID = 1, 1
 RATIO_TO_PARENT = 1, 3
 DOMAIN_ORIGIN_LLI = 1, 7
 DOMAIN_ORIGIN_LLJ = 1, 7
 DOMAIN_ORIGIN_URI = 49, 43
 DOMAIN_ORIGIN_URJ = 35, 30
 MAP_PROJ_NAME = 'lambert'
 MOAD_KNOWN_LAT = 51.30
 MOAD_KNOWN_LON = 19.40
 MOAD_STAND_LATS = 51.30, 51.30
 MOAD_STAND_LONS = 19.40
 MOAD_DELTA_X = 12000
 MOAD_DELTA_Y = 12000
 SILAVWT_PARM_WRF = 0.
 TOPTWVL_PARM_WRF = 2.
/
&sfcfiles
 TOPO_30S = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/topo_30s',
 LANDUSE_30S = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/landuse_30s',
 SOILTYPE_TOP_30S = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/soiltype_top_30s',
 SOILTYPE_BOT_30S = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/soiltype_bot_30s',
 GREENFRAC = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/greenfrac',
 SOILTEMP_1DEG = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/soiltemp_1deg',
 ALBEDO_NCEP = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/albedo_ncep',
 MAXSNOWALB = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/maxsnowalb',
 ISLOPE = '/home/admin/DRJACK/WRF/WRFSI/extdata/GEOG/islope',
/
&interp_control
 NUM_ACTIVE_SUBNESTS = 1,
 ACTIVE_SUBNESTS = 2, 3,
 PTOP_PA = 5000,
 HINTERP_METHOD = 1,
 LSM_HINTERP_METHOD = 1,
 NUM_INIT_TIMES = 1, 
  INIT_ROOT = 'GFSN',
  LBC_ROOT = 'GFSN',
 LSM_ROOT = '',
 CONSTANTS_FULL_NAME = '',
 VERBOSE_LOG = .false.,
 OUTPUT_COORD = 'ETAP',
 LEVELS = 1.00000,
          0.9975,
          0.9935,
          0.9872,
          0.9790,
          0.9690,
          0.9577,
          0.9454,
          0.9328,
          0.9201,
          0.9075,
          0.8949,
          0.8822,
          0.8695,
          0.8567,
          0.8438,
          0.8304,
          0.8170,
          0.8037,
          0.7902,
          0.7764,
          0.7620,
          0.7469,
          0.7313,
          0.7152,
          0.6986,
          0.6813,
          0.6630,
          0.6419,
          0.6168,
          0.5849,
          0.5487,
          0.5081,
          0.4631,
          0.4201,
          0.3805,
          0.3471,
          0.3213,
          0.3003,
          0.2791,
          0.2574,
          0.2356,
          0.2134,
          0.1910,
          0.1682,
          0.1451,
          0.1216,
          0.0979,
          0.0739,
          0.0495,
          0.0250,
          0.0000,
/
&si_paths
 ANALPATH = '/home/admin/DRJACK/WRF/WRFSI/extdata/extprd',
 LBCPATH = '/home/admin/DRJACK/WRF/WRFSI/extdata/extprd',
 LSMPATH = '/home/admin/DRJACK/WRF/WRFSI/extdata/extprd',
 CONSTANTS_PATH = '/home/admin/DRJACK/WRF/WRFSI/extdata/extprd',
/
