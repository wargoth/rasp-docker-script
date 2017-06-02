# What is this?
This Dockerfile builds an image containing Dr. Jack's version of WRF v3 software. 
It is useful for producing RASP forecasts. See http://rasp.inn.leedsmet.ac.uk/SOFTWARE/WRFV3.x/ and http://www.drjack.info/
for more information

# Downloading and running
You can download and run pre-built container and run a test region:
```
$ docker run -it yavalek/drjack-wrf3
# cd ~/rasp
# runGM PANOCHE
```

# Building
Read comments in the script and download files mentioned in the script into the directory so you don't have to hit rasp.inn.leedsmet.ac.uk
server every time you build the image. Run:

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
