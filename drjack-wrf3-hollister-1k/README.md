This is HOLLISTER region 1k resolution, running on production environment

# Building
Download requried data files and put them into the directory (list of files http://www2.mmm.ucar.edu/wrf/users/download/get_sources_wps_geog.html):
http://www2.mmm.ucar.edu/wrf/src/wps_files/bnu_soiltype_bot.tar.bz2
http://www2.mmm.ucar.edu/wrf/src/wps_files/bnu_soiltype_top.tar.bz2
http://www2.mmm.ucar.edu/wrf/src/wps_files/greenfrac_fpar_modis.tar.bz2
http://www2.mmm.ucar.edu/wrf/src/wps_files/modis_landuse_20class_15s.tar.bz2

Also download topo_SRTM3S.tar.gz from here: https://www.dropbox.com/s/ns3m6172hh0w4vu/topo_SRTM3S.tar.gz?dl=0
```
docker build -t my-rasp-hollister-1k .
```

# Running
## Run the current day (or next if it's end of the day)

```
$ docker run -v /tmp/OUT:/root/rasp/HOLLISTER/OUT/ -v /tmp/LOG:/root/rasp/HOLLISTER/LOG/  --rm my-rasp-hollister-1k
```

## Run the current day +1, +2, etc

START_HOUR environment variable can override default start hour which is 12. See ![rasp.run.parameters.HOLLISTER](HOLLISTER/rasp.run.parameters.HOLLISTER)

* START_HOUR=36 for current day +1
* START_HOUR=60 for current day +2, etc

```
docker run -v /tmp/OUT:/root/rasp/HOLLISTER/OUT/ -v /tmp/LOG:/root/rasp/HOLLISTER/LOG/ --rm -e START_HOUR=36 my-rasp-hollister-1k
```
