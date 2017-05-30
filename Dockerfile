FROM fedora:latest

ENV BASEDIR=/root/rasp/

RUN mkdir $BASEDIR
RUN yum -y update

# required packages
RUN yum -y install netcdf-fortran libpng15 iproute-tc tcp_wrappers-libs sendmail procmail psmisc procps-ng mailx \
  findutils ImageMagick perl-CPAN ncl netcdf libpng libjpeg-turbo which
  
# configure CPAN and install required modules
RUN (echo y;echo o conf prerequisites_policy follow;echo o conf commit) | cpan
RUN cpan install Proc/Background.pm

# fix dependencies
RUN ln -s libnetcdff.so.6 /lib64/libnetcdff.so.5
RUN ln -s libnetcdf.so.11 /lib64/libnetcdf.so.7

# optional packages
#RUN yum -y install wget less vim


WORKDIR /root/

# Assuming you have downloaded these files from here: http://rasp.inn.leedsmet.ac.uk/SOFTWARE/WRFV3.x/
# Alternatively tell script to download them automatically (see below) and comment-out this part

COPY raspGM.tgz /root/
COPY raspGM-bin.tgz /root/
COPY rangs.tgz /root/
COPY PANOCHE.tgz /root/

RUN tar xf raspGM.tgz -C $BASEDIR
RUN tar xf raspGM-bin.tgz -C $BASEDIR
RUN tar xf rangs.tgz -C $BASEDIR
RUN tar xf PANOCHE.tgz -C $BASEDIR

#
# ALTERNATIVE: Download and isntall files
#
#RUN curl -SL http://rasp.inn.leedsmet.ac.uk/SOFTWARE/WRFV3.x/raspGM.tgz | tar xC $BASEDIR
#RUN curl -SL http://rasp.inn.leedsmet.ac.uk/SOFTWARE/WRFV3.x/raspGM-bin.tgz | tar xC $BASEDIR
#RUN curl -SL http://rasp.inn.leedsmet.ac.uk/SOFTWARE/WRFV3.x/rangs.tgz | tar xC $BASEDIR
#RUN curl -SL http://rasp.inn.leedsmet.ac.uk/SOFTWARE/WRFV3.x/PANOCHE.tgz | tar xC $BASEDIR


#
# Set environment for interactive container shells
#
RUN echo export BASEDIR=$BASEDIR >> /etc/bashrc
RUN echo export PATH+=:\$BASEDIR/bin >> /etc/bashrc

 
# cleanup 
RUN yum clean all
RUN rm -f rangs.tgz
RUN rm -f raspGM-bin.tgz
RUN rm -f raspGM.tgz
RUN rm -f PANOCHE.tgz

# CMD ["cd $BASEDIR ; runGM PANOCHE"]
