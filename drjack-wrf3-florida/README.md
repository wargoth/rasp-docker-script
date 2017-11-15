This is a Florida region in 4 km resolution

# Building

```
docker build -t my-rasp-florida-4k .
```

# Running
## Run the current day (or next if it's end of the day)

```
$ docker run -v /tmp/OUT:/root/rasp/FL/OUT/ -v /tmp/LOG:/root/rasp/FL/LOG/  --rm my-rasp-florida-4k
```

## Run the current day +1, +2, etc

START_HOUR environment variable can override default start hour which is 9. See ![rasp.run.parameters.FL](FL/rasp.run.parameters.FL)

* START_HOUR=33 for current day +1
* START_HOUR=57 for current day +2, etc

```
docker run -v /tmp/OUT:/root/rasp/FL/OUT/ -v /tmp/LOG:/root/rasp/FL/LOG/ --rm -e START_HOUR=33 my-rasp-florida-4k
```
