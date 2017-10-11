FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

RUN rm -rf $BASEDIR/PANOCHE

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/HOLLISTER

COPY HOLLISTER/wrfsi.nl HOLLISTER/rasp.run.parameters.HOLLISTER $BASEDIR/HOLLISTER/
COPY HOLLISTER/rasp.region_data.ncl $BASEDIR/GM/
COPY HOLLISTER/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/HOLLISTER/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/HOLLISTER/OUT/", "/root/rasp/HOLLISTER/LOG/"]

CMD ["runGM", "HOLLISTER"]
