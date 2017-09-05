This is a TAHOE region 4k resolution, running on production environment

# Building

```
docker build -t my-rasp-tahoe-4k .
```

# Running
## Run the current day (or next if it's end of the day)

```
$ docker run -v /tmp/OUT:/root/rasp/TAHOE/OUT/ -v /tmp/LOG:/root/rasp/TAHOE/LOG/  --rm my-rasp-tahoe-4k
```

## Run the current day +1, +2, etc

START_HOUR environment variable can override default start hour which is 12. See ![rasp.run.parameters.TAHOE](TAHOE/rasp.run.parameters.TAHOE)

* START_HOUR=36 for current day +1
* START_HOUR=60 for current day +2, etc

```
docker run -v /tmp/OUT:/root/rasp/TAHOE/OUT/ -v /tmp/LOG:/root/rasp/TAHOE/LOG/ --rm -e START_HOUR=36 my-rasp-tahoe-4k
```
