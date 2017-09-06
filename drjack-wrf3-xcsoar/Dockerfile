FROM yavalek/drjack-wrf3:latest

WORKDIR /tmp/

ADD jasper-1.701.0.XCSoar.tgz /tmp/

# initialize
RUN yum -y update \
  && yum -y groups install "Development Tools" "C Development Tools and Libraries" \
  && yum -y install libjpeg-turbo-devel.x86_64 proj.x86_64 gdal.x86_64 zip.x86_64
  
# Patch and compile jasper
COPY jasper.patch /tmp/jasper-1.701.0.XCSoar/
RUN cd jasper-1.701.0.XCSoar \
  && patch -p1 < jasper.patch \
  && ./configure  --without-jpc \
  && make -j16 install \
  && rm -rf /tmp/jasper-1.701.0.XCSoar/

COPY xcsoar-scripts/* $BASEDIR/bin/

WORKDIR /root/rasp/
