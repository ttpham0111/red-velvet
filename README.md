# Red Velvet
A Web UI for Redis.

## Features
- SSL/TLS support

## Install
```bash
pip3 install red-velvet 
```

## Run
```bash
export REDIS_URIS="local::redis://localhost:6379,dev::rediss://dev.redis.com/0"
red-velvet
```

The server should be running on <http://localhost:8000> by default.

## Configurations
Configurations are done through environmental variables
- `HOST`: [OPTIONAL] (Default: 0.0.0.0) The hostname of the server
- `PORT`: [OPTIONAL] (Default: 8000) The port of the server
- `NUM_WORKERS`: [OPTIONAL] (Default: 1) The number of workers to start up
- `REDIS_URIS`: Comma separated list of [redis URIs](https://metacpan.org/pod/URI::redis).

## Docker
```bash
docker run -d \
           -e REDIS_URIS="dev::rediss://dev.redis.com/0" \
           -p 8000:8000 \
           --name red-velvet \
           ttpham0111/red-velvet
```

## TODO:
- Fix hacky import of toggle button plugin
- Update in memory instead of calling get*
- CLI:
  - Blacklist certain commands for terminals
  - Convert certain commands back to original (delete -> DEL)
- Deployments (minify, bundlers)
- Better error handling (logging)
- Connection statistics (Memory Usage, etc...)
- Autorefresh
- Actual icons
- HTTP/S Auth
- Server side paging/sorting
- Max key limit
- Create binary values
- Add tests