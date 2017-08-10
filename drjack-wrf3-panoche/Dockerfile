FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

COPY PANOCHE/wrfsi.nl PANOCHE/rasp.run.parameters.PANOCHE $BASEDIR/PANOCHE/
COPY PANOCHE/rasp.region_data.ncl $BASEDIR/GM/
COPY PANOCHE/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/PANOCHE/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/PANOCHE/OUT/", "/root/rasp/PANOCHE/LOG/"]

CMD ["runGM", "PANOCHE"]
