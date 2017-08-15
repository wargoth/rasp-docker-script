FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/POLAND

COPY POLAND/wrfsi.nl POLAND/rasp.run.parameters.POLAND $BASEDIR/POLAND/
COPY POLAND/rasp.region_data.ncl $BASEDIR/GM/
COPY POLAND/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/POLAND/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/POLAND/OUT/", "/root/rasp/POLAND/LOG/"]

CMD ["runGM", "POLAND"]
