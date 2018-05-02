FROM fedora:26

ENV BASEDIR=/root/rasp/

RUN mkdir $BASEDIR

# required packages
RUN yum -y update \
  && yum -y install netcdf-fortran libpng15 iproute-tc tcp_wrappers-libs sendmail procmail psmisc procps-ng mailx \
  findutils ImageMagick perl-CPAN ncl netcdf libpng libjpeg-turbo which patch vim less bzip2
  
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
ADD rangs.tgz $BASEDIR
ADD PANOCHE.tgz $BASEDIR
# Unpack raspGM
ENV VERSION=master
ADD https://codeload.github.com/wargoth/rasp-gm/tar.gz/$VERSION $BASEDIR/rasp-gm-$VERSION.tar.gz

RUN cd $BASEDIR \
  && tar xf rasp-gm-$VERSION.tar.gz --strip-components=1 \
  && rm rasp-gm-$VERSION.tar.gz


#
# Set environment for interactive container shells
#
RUN echo export BASEDIR=$BASEDIR >> /etc/bashrc \
  && echo export PATH+=:\$BASEDIR/bin >> /etc/bashrc


# cleanup 
RUN yum clean all

CMD ["bash"]
# CMD ["cd $BASEDIR ; runGM PANOCHE"]
