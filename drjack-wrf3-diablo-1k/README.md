This is a Diablo region 1k resolution, running on production environment

# Building

```
docker build -t my-rasp-diablo-1k .
```

# Running
## Run the current day (or next if it's end of the day)

```
$ docker run -v /tmp/OUT:/root/rasp/DIABLO/OUT/ -v /tmp/LOG:/root/rasp/DIABLO/LOG/  --rm my-rasp-diablo-1k
```

## Run the current day +1, +2, etc

START_HOUR environment variable can override default start hour which is 12. See ![rasp.run.parameters.DIABLO](DIABLO/rasp.run.parameters.DIABLO)

* START_HOUR=36 for current day +1
* START_HOUR=60 for current day +2, etc

```
docker run -v /tmp/OUT:/root/rasp/DIABLO/OUT/ -v /tmp/LOG:/root/rasp/DIABLO/LOG/ --rm -e START_HOUR=36 my-rasp-diablo-1k
```
