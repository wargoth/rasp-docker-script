FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/DIABLO

COPY DIABLO/wrfsi.nl DIABLO/rasp.run.parameters.DIABLO $BASEDIR/DIABLO/
COPY DIABLO/rasp.region_data.ncl $BASEDIR/GM/
COPY DIABLO/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/DIABLO/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/DIABLO/OUT/", "/root/rasp/DIABLO/LOG/"]

CMD ["runGM", "DIABLO"]
