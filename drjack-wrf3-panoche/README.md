# Building

```
docker build -t my-rasp-panoche .
```

# Running
## Run the current day (or next if it's end of the day)

```
$ docker run -v /tmp/OUT:/root/rasp/PANOCHE/OUT/ -v /tmp/LOG:/root/rasp/PANOCHE/LOG/  --rm my-rasp-panoche
```

## Run the current day +1, +2, etc

START_HOUR environment variable can override default start hour which is 12. See ![rasp.run.parameters.PANOCHE](PANOCHE/rasp.run.parameters.PANOCHE)

* START_HOUR=36 for current day +1
* START_HOUR=60 for current day +2, etc

```
docker run -v /tmp/OUT:/root/rasp/PANOCHE/OUT/ -v /tmp/LOG:/root/rasp/PANOCHE/LOG/ --rm -e START_HOUR=36 my-rasp-panoche
```
