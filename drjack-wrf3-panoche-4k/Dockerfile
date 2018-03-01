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

COPY PANOCHE/wrfsi.nl PANOCHE/rasp.run.parameters.PANOCHE $BASEDIR/PANOCHE/
COPY PANOCHE/GEOGRID.TBL $BASEDIR/RUN.TABLES/
COPY PANOCHE/rasp.region_data.ncl $BASEDIR/GM/
COPY PANOCHE/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# this writes namelist.input.template, namelist.wps.template
RUN cd $BASEDIR/PANOCHE/ \
  && wrfsi2wps.pl \
  && wps2input.pl

# overwrite customized files
COPY PANOCHE/namelist.input.template PANOCHE/namelist.wps.template PANOCHE/namelist.wps $BASEDIR/PANOCHE/

# initialize grid
RUN cd $BASEDIR/PANOCHE/ \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/PANOCHE/OUT/", "/root/rasp/PANOCHE/LOG/"]

CMD ["runGM", "PANOCHE"]
