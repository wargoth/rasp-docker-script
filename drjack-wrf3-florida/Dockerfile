FROM yavalek/drjack-wrf3:latest

ENV BASEDIR=/root/rasp/

WORKDIR /root/

ADD geog.tar.gz $BASEDIR

RUN cp -a $BASEDIR/region.TEMPLATE $BASEDIR/FL

COPY FL/wrfsi.nl FL/rasp.run.parameters.FL $BASEDIR/FL/
COPY FL/rasp.region_data.ncl $BASEDIR/GM/
COPY FL/rasp.site.runenvironment $BASEDIR/

ENV PATH="${BASEDIR}/bin:${PATH}"

# initialize
RUN cd $BASEDIR/FL/ \
  && wrfsi2wps.pl \
  && wps2input.pl \
  && geogrid.exe

# cleanup
RUN rm -rf $BASEDIR/geog

WORKDIR /root/rasp/

VOLUME ["/root/rasp/FL/OUT/", "/root/rasp/FL/LOG/"]

CMD ["runGM", "FL"]
