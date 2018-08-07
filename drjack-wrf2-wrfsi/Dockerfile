FROM fedora:25

ENV BASEDIR=/root/DRJACK/

RUN mkdir $BASEDIR

# required packages
RUN yum -y update \
  && yum -y install netcdf-fortran libpng15 iproute-tc tcp_wrappers-libs sendmail procmail psmisc procps-ng mailx \
  findutils ImageMagick perl-CPAN ncl netcdf libpng libjpeg-turbo which perl-Tk.x86_64 patch perl-Env.noarch glibc.i686 libpng12.i686
  
# configure CPAN and install required modules
RUN (echo y;echo o conf prerequisites_policy follow;echo o conf commit) | cpan \
  && cpan install Proc/Background.pm

# fix dependencies
RUN ln -s libnetcdff.so.6 /lib64/libnetcdff.so.5 \
  && ln -s libnetcdf.so.11 /lib64/libnetcdf.so.7

# optional packages
#RUN yum -y install wget less vim


WORKDIR /root/

#
# Unpack software packages
# Assuming you have downloaded these files from here: http://www.drjack.info/RASP/DOWNLOAD/
#
ADD rasp_scripts.tar.gz $BASEDIR
ADD rasp_ncl.tar.gz $BASEDIR
ADD drjack_utils.tar.gz $BASEDIR
ADD wrf_execs.tar.gz $BASEDIR
ADD wrfsi_misc.tar.gz $BASEDIR
ADD wrfsi_gui.tar.gz $BASEDIR
#ADD rasp_region.panoche.tar.gz $BASEDIR

#
# Alternatively tell the script to download them
#
#RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/rasp_scripts.tar.gz | tar xC $BASEDIR
#RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/rasp_ncl.tar.gz | tar xC $BASEDIR
#RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/drjack_utils.tar.gz | tar xC $BASEDIR
#RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/wrf_execs.tar.gz | tar xC $BASEDIR
#RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/wrfsi_misc.tar.gz | tar xC $BASEDIR
#RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/wrfsi_gui.tar.gz | tar xC $BASEDIR
##RUN curl -SL http://www.drjack.info/RASP/DOWNLOAD/rasp_region.panoche.tar.gz | tar xC $BASEDIR

#
# Setup. See http://www.drjack.info/twiki/bin/view/RASPop/ProgramInstall,
# http://www.drjack.info/twiki/bin/view/RASPop/ProgramGridCreation and
# http://www.drjack.info/twiki/bin/view/RASPop/GuiGridCreationSteps for details
# 
# For Europe, use north-east files, i.e. landuse_30s.NE, soiltype_bot_30s.NE, etc.
#
RUN cd $BASEDIR/WRF/wrfsi/extdata/GEOG \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/albedo_ncep.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/greenfrac.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/islope.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/maxsnowalb.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/soiltemp_1deg.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/landuse_30s/landuse_30s.NW.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/soiltype_bot_30s/soiltype_bot_30s.NW.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/soiltype_top_30s/soiltype_top_30s.NW.tar.tgz | tar xz \
  && curl -SL ftp://aftp.fsl.noaa.gov/divisions/frd-laps/WRFSI/Geog_Data/topo_30s/topo_30s.NW.tar.tgz | tar xz

RUN cp $BASEDIR/WRF/wrfsi/extdata/static/grib_prep.nl.TEMPLATE $BASEDIR/WRF/wrfsi/extdata/static/grib_prep.nl \
  && perl -pi -w -e "\$bdir = \"$BASEDIR\"; s/\/home\/admin\/DRJACK/\$bdir/g;" $BASEDIR/WRF/wrfsi/extdata/static/grib_prep.nl \
  && cp $BASEDIR/WRF/NCL/rasp.ncl.region.data.TEMPLATE $BASEDIR/WRF/NCL/rasp.ncl.region.data \
  && mkdir -p $BASEDIR/WRF/wrfsi/domains/ $BASEDIR/WRF/wrfsi/templates/

RUN cd $BASEDIR/WRF/NCL \
  && for i in *.TEMPLATE; do \cp -f $i ${i/.TEMPLATE/}; done
 
RUN cd $BASEDIR/WRF/wrfsi/JACK \
  && ./edit.wrfsi_hardwired_basedirs.pl

# Choose appropriate WRFSI grib_prep.exe executable for your region
# The following is for US-only:
RUN ln -sf grib_prep.exe.eta $BASEDIR/WRF/wrfsi/bin/grib_prep.exe
# for the non-US uncomment the following:
# RUN ln -sf grib_prep.exe.gfs $BASEDIR/WRF/wrfsi/bin/grib_prep.exe

# Patch files to be able to compile with our version or perl:
COPY wrfsi.patch /root/
RUN cd $BASEDIR \
  && patch -p0 < ~/wrfsi.patch \
  && rm ~/wrfsi.patch

#
# Set environment for interactive container shells
#
RUN echo export BASEDIR=$BASEDIR >> /etc/bashrc \
  && echo export PATH+=:\$BASEDIR/bin >> /etc/bashrc \
  && echo export LD_LIBRARY_PATH=\$BASEDIR/UTIL/PGI >> /etc/bashrc
  
# cleanup 
RUN yum clean all

# create links
RUN ln -s $BASEDIR/WRF/wrfsi/wrf_tools \
  && ln -s $BASEDIR/WRF/wrfsi/domains \
  && ln -s $BASEDIR/WRF/wrfsi/templates


CMD ["bash"]
# CMD ["$BASEDIR/WRF/wrfsi/wrf_tools"]
