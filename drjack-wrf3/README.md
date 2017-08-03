# What is this?
This Dockerfile builds an image containing Dr. Jack's version of WRF v3 software. 
It is useful for producing RASP forecasts. See http://rasp-uk.uk/SOFTWARE/WRFV3.x/ and http://www.drjack.info/
for more information

# Downloading and running
You can download and run pre-built container and run a test region:
```
$ docker run -it yavalek/drjack-wrf3
# cd ~/rasp
# runGM PANOCHE
```

# Building
Read comments in the script and download files mentioned in the script into the directory so you don't have to hit rasp-uk.uk
server every time you build the image. Backup of these files: https://www.dropbox.com/sh/n25p0nz6bgvjzlb/AADGw1FeL-cY8ssBtMp-DT50a?dl=0

Run:

```
$ docker build -t my-rasp .
```

## Running
Run the container and run a test region:
```
$ docker run -it  my-rasp
# cd ~/rasp
# runGM PANOCHE

```
