# What is this?
This Dockerfile builds an image containing Dr. Jack's version of WRF v2 and WRFSI v2 software. 
It is useful for creating new RASP grids. See http://www.drjack.info/twiki/bin/view/RASPop/GuiGridCreationSteps 
for more information

# Downloading and running
You can download and run pre-built container. First, allow connecting to your X server:
```
$ xhost +
```
Then run:
```
$ docker run -it -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix yavalek/drjack-wrf2-wrfsi
# ./wrf_tools
```

# Building
Read comments in the script and download files mentioned in the script into the directory so you don't have to hit Dr. Jack's 
server every time you build the image. Backup of these files: https://www.dropbox.com/sh/7sro9rmbgr02nqm/AADTBAk3W7ThLQAWU_Btw8fBa?dl=0

Run:

```
$ docker build -t my-wrfsi2 .
```

## Running
First, allow connecting to your X server:
```
$ xhost +
```
Then run the container:
```
$ docker run -it -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix my-wrfsi2
# ./wrf_tools

```
