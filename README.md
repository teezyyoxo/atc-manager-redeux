(Project README for ATC Manager)

Preferred: `docker build` + `docker run`
-------------------------------------

For this project a single-container production image is ideal. Build the image and run it directly:

```bash
# build image
docker build -t atc-manager .

# run (temporary, maps host 8080 -> container 80)
docker run --rm -p 8080:80 atc-manager
```

Tips and common variants
------------------------

- Run detached with a name and restart policy:

```bash
docker run -d --name atc-manager -p 8080:80 --restart unless-stopped atc-manager
```

- Use a different host port if 8080 is taken:

```bash
docker run --rm -p 8081:80 atc-manager
```

- Stop a named container:

```bash
docker stop atc-manager
docker rm atc-manager
```

- View logs:

```bash
docker logs -f atc-manager
```

Port conflict resolution
------------------------

- See which host process is using a port (macOS):

```bash
sudo lsof -i :8080
```

- See Docker containers publishing a port:

```bash
docker ps --format 'table {{.ID}}\t{{.Names}}\t{{.Ports}}' | grep 8080
```

- Stop containers using the port:

```bash
docker ps --filter "publish=8080" --format '{{.ID}}' | xargs -r docker stop
```

When to use docker-compose
---------------------------

`docker-compose` is still useful if you want to define multi-service stacks (DBs, proxies) or provide a single `up` command for local dev. For a single static production image `docker run` is simpler and recommended.

Files added
-----------
- Dockerfile — multi-stage build and nginx serve
- nginx.conf — nginx config with SPA fallback
- docker-compose.yml — optional compose file for local convenience
- .dockerignore — excludes node_modules, build, and other files from the Docker context

Development
-----------
For local development (hot-reload) continue to use the existing npm scripts:

```bash
# install deps
npm install
# run dev server
npm run dev
```

Makefile
--------

Quick `make` helpers are provided in `Makefile` to simplify common Docker tasks:

```bash
# build image
make build

# run (temporary, maps host PORT -> container 80)
make run
# or override port:
make run PORT=8081

# run detached (background)
make run-detached PORT=8081

# stop / remove / view logs
make stop
make rm
make logs
```
