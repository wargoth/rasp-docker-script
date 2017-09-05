FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/TAHOE

COPY TAHOE/wrfsi.nl TAHOE/rasp.run.parameters.TAHOE $BASEDIR/TAHOE/
COPY TAHOE/rasp.region_data.ncl $BASEDIR/GM/
COPY TAHOE/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/TAHOE/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/TAHOE/OUT/", "/root/rasp/TAHOE/LOG/"]

CMD ["runGM", "TAHOE"]
