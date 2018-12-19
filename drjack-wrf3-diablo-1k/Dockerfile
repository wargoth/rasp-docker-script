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

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/DIABLO

COPY DIABLO/wrfsi.nl DIABLO/rasp.run.parameters.DIABLO $BASEDIR/DIABLO/
COPY DIABLO/rasp.region_data.ncl $BASEDIR/GM/
COPY DIABLO/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# this writes namelist.input.template, namelist.wps.template
RUN cd $BASEDIR/DIABLO/ \
  && wrfsi2wps.pl \
  && wps2input.pl


# Patch files
COPY DIABLO/namelist.input.template.patch DIABLO/namelist.wps.template.patch DIABLO/namelist.wps.patch $BASEDIR
RUN cd $BASEDIR \
  && patch -p0 < namelist.input.template.patch \
  && patch -p0 < namelist.wps.template.patch \
  && patch -p0 < namelist.wps.patch \
  && rm *.patch
 

# overwrite customized files
COPY DIABLO/GEOGRID.TBL $BASEDIR/RUN.TABLES/

# initialize grid
RUN cd $BASEDIR/DIABLO/ \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/DIABLO/OUT/", "/root/rasp/DIABLO/LOG/"]

CMD ["runGM", "DIABLO"]
