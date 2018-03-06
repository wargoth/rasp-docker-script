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

RUN rm -rf $BASEDIR/PANOCHE

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/HOLLISTER

COPY HOLLISTER/wrfsi.nl HOLLISTER/rasp.run.parameters.HOLLISTER $BASEDIR/HOLLISTER/
COPY HOLLISTER/rasp.region_data.ncl $BASEDIR/GM/
COPY HOLLISTER/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# this writes namelist.input.template, namelist.wps.template
RUN cd $BASEDIR/HOLLISTER/ \
  && wrfsi2wps.pl \
  && wps2input.pl

# overwrite customized files
COPY HOLLISTER/namelist.input.template HOLLISTER/namelist.wps.template HOLLISTER/namelist.wps $BASEDIR/HOLLISTER/
COPY HOLLISTER/GEOGRID.TBL $BASEDIR/RUN.TABLES/

# initialize grid
RUN cd $BASEDIR/HOLLISTER/ \
  && geogrid.exe


# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/HOLLISTER/OUT/", "/root/rasp/HOLLISTER/LOG/"]

CMD ["runGM", "HOLLISTER"]
