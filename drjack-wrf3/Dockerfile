FROM fedora:25

ENV BASEDIR=/root/rasp/

RUN mkdir $BASEDIR

# required packages
RUN yum -y update \
  && yum -y install netcdf-fortran libpng15 iproute-tc tcp_wrappers-libs sendmail procmail psmisc procps-ng mailx \
  findutils ImageMagick perl-CPAN ncl netcdf libpng libjpeg-turbo which patch vim less
  
# configure CPAN and install required modules
RUN (echo y;echo o conf prerequisites_policy follow;echo o conf commit) | cpan \
  && cpan install Proc/Background.pm

# fix dependencies
RUN ln -s libnetcdff.so.6 /lib64/libnetcdff.so.5 \
  && ln -s libnetcdf.so.11 /lib64/libnetcdf.so.7


WORKDIR /root/

#
# Unpack software packages
# Assuming you have downloaded these files from here: http://rasp-uk.uk/SOFTWARE/WRFV3.x/
#
ADD raspGM.tgz $BASEDIR
ADD raspGM-bin.tgz $BASEDIR
ADD rangs.tgz $BASEDIR
ADD PANOCHE.tgz $BASEDIR


#
# Alternatively tell the script to download them
#
#RUN curl -SL http://rasp-uk.uk/SOFTWARE/WRFV3.x/raspGM.tgz | tar xC $BASEDIR
#RUN curl -SL http://rasp-uk.uk/SOFTWARE/WRFV3.x/raspGM-bin.tgz | tar xC $BASEDIR
#RUN curl -SL http://rasp-uk.uk/SOFTWARE/WRFV3.x/rangs.tgz | tar xC $BASEDIR
#RUN curl -SL http://rasp-uk.uk/SOFTWARE/WRFV3.x/PANOCHE.tgz | tar xC $BASEDIR

# Patch files with fixes
COPY GM.patch /root/
RUN cd $BASEDIR \
  && patch -p1 < ~/GM.patch \
  && rm ~/GM.patch

#
# Set environment for interactive container shells
#
RUN echo export BASEDIR=$BASEDIR >> /etc/bashrc \
  && echo export PATH+=:\$BASEDIR/bin >> /etc/bashrc


# cleanup 
RUN yum clean all

CMD ["bash"]
# CMD ["cd $BASEDIR ; runGM PANOCHE"]
