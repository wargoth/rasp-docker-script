FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

# updated hi res data
ADD greenfrac_fpar_modis.tar.bz2 \
  bnu_soiltype_bot.tar.bz2 \
  bnu_soiltype_top.tar.bz2 \
  modis_landuse_20class_15s.tar.bz2 \
  topo_SRTM3S.tar.gz $BASEDIR/geog/

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/TAHOE

COPY TAHOE/wrfsi.nl TAHOE/rasp.run.parameters.TAHOE $BASEDIR/TAHOE/
COPY TAHOE/GEOGRID.TBL $BASEDIR/RUN.TABLES/
COPY TAHOE/rasp.region_data.ncl $BASEDIR/GM/
COPY TAHOE/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/TAHOE/ \
  && wrfsi2wps.pl \
  && wps2input.pl
  
# overwrite customized files
COPY TAHOE/namelist.input.template TAHOE/namelist.wps.template $BASEDIR/TAHOE/
COPY TAHOE/namelist.wps.template $BASEDIR/TAHOE/namelist.wps

RUN cd $BASEDIR/TAHOE/ \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog
RUN rm -rf PANOCHE

WORKDIR /root/rasp/

VOLUME ["/root/rasp/TAHOE/OUT/", "/root/rasp/TAHOE/LOG/"]

CMD ["runGM", "TAHOE"]
