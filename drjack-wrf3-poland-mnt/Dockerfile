FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/POLAND_MNT

COPY POLAND_MNT/wrfsi.nl POLAND_MNT/rasp.run.parameters.POLAND_MNT $BASEDIR/POLAND_MNT/
COPY POLAND_MNT/rasp.region_data.ncl $BASEDIR/GM/
COPY POLAND_MNT/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/POLAND_MNT/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/POLAND_MNT/OUT/", "/root/rasp/POLAND_MNT/LOG/"]

CMD ["runGM", "POLAND_MNT"]
