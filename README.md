# ATC Manager 2

ATC Manager 2 is a browser-based air traffic control game. Manage IFR and VFR
traffic around Schiphol, Heathrow, LAX, Palm Springs, and the default airport;
issue text commands; manage runway traffic; save games; and record, export,
import, or share timelapse files.

The production app is a static Preact build served by nginx. The same
multi-stage `Dockerfile` is supported by Docker and Podman.

Current release: **2.5.1**

## Features

- IFR, VFR, enroute, pattern, arrival, and departure traffic
- Multiple airports, runways, SIDs, STARs, waypoints, weather, and wake
  turbulence
- Text commands, tutorials, configurable game speed, and accessibility settings
- Local saves, airplane/operator editors, and timelapse recording, playback,
  file import, and file export
- Offline precaching and optional web push notifications
- Responsive SPA routing with direct links to game, editor, and timelapse views

## What Redeux improves

These identifiers are permanent references for release notes, discussions, and
future changelog entries.

| ID | Improvement | Current state |
| --- | --- | --- |
| TD-001 | Reproducible Docker and Podman delivery | Available in 2.5.0 with one production image, Compose support, health checks, and SPA-aware nginx routing. |
| TD-002 | Resilient browser runtime | Available in 2.5.0 with offline precaching, modern and legacy service workers, cache controls, and optional push handling. |
| TD-003 | Repeatable verification | Available in 2.5.0 with pinned Node guidance, `npm ci`, lint/build checks, a production dependency audit, and versioned container metadata. |
| TD-004 | Broader aircraft support | The current catalog includes 33 built-in aircraft types plus an in-game aircraft editor for custom definitions. |
| TD-005 | Broader airline/operator support | The current catalog includes 35 built-in operators plus an operator editor, callsigns, colors, and rarity controls. |
| TD-006 | Scope and traffic customization | Available controls include working radar/font and route-display settings plus colors for backgrounds, traffic classes, paths, SIDs, STARs, ILS, MSA, climb, descent, and warnings. |
| TD-007 | Expanded traffic simulation | IFR, VFR, enroute, pattern, arrival, and departure traffic coexist with weather, wake categories, go-arounds, local saves, and timelapses. |

## Planned features and known gaps

This is a direction-of-travel register, not a promised delivery schedule.
“Needs refinement” means a basic capability exists but is not yet at the desired
quality or flexibility.

| ID | Feature or gap | Status | Intended outcome |
| --- | --- | --- | --- |
| TD-008 | Additional aircraft packs | Planned | Add modern airliners, regional aircraft, cargo types, helicopters, and more general-aviation aircraft with validated performance data. |
| TD-009 | Additional airlines and operators | Planned | Expand global, regional, cargo, charter, and general-aviation operators with accurate callsigns and sensible fleet assignments. |
| TD-010 | Multiple radar/scope types | Planned | Provide distinct tower, ground, approach/TRACON, enroute, and simplified training scope presets. |
| TD-011 | Radar and interface visual refinement | Needs refinement | Improve aircraft labels, vector/trail rendering, spacing, typography, responsive layouts, selection states, and high-density traffic readability. |
| TD-012 | Visual presets and accessibility | Planned | Add coherent scope themes, color-blind-safe palettes, contrast presets, scalable UI density, and easier reset/import/export controls. |
| TD-013 | Airport and scenario authoring | Planned | Make it easier to define and validate airports with curated procedures, runway-use rules, traffic mixes, weather behavior, tutorials, and difficulty profiles. |
| TD-014 | Simulation fidelity | Needs refinement | Improve separation logic, runway occupancy, sequencing, taxi/ground behavior, aircraft performance, wind effects, and conflict feedback. |
| TD-015 | Modern frontend toolchain | Technical debt | Replace Preact CLI/webpack 4 and retire the build-only OpenSSL compatibility setting without losing existing features. |
| TD-016 | Automated regression coverage | Technical debt | Add unit tests for parsers and simulation rules plus browser smoke tests for saves, editors, routes, timelapses, and offline behavior. |
| TD-017 | Performance profiling | Planned | Establish measurable frame-time, memory, startup, and large-traffic targets; optimize only against recorded regressions. |
| TD-018 | Tutorials and command discovery | Needs refinement | Improve command help, contextual feedback, onboarding, examples, and discoverability for advanced traffic-management features. |
| TD-019 | Optional cloud saves and cross-device sync | Planned | Evaluate a modular Firebase reimplementation for opt-in save synchronization, backup, and conflict handling while keeping local saves, offline play, and account-free gameplay fully functional. |
| TD-020 | Expanded general-aviation traffic | Planned | Build on existing GA/VFR support with richer aircraft mixes, pattern work, transient traffic, practice approaches, touch-and-go activity, realistic callsigns, variable experience levels, and airport-specific behavior. |
| TD-021 | Expanded SID and STAR procedures | Planned | Add accurate SID departure and STAR arrival procedures to every supported airport, assign them appropriately to traffic, and visualize complete selectable procedure paths, transitions, restrictions, and active routes on the scope. |
| TD-022 | Live airfield weather | Planned | Add an opt-in live-weather setting during session setup that uses current METAR and available ATIS information for the selected airfield. Lock the setting once play begins, update conditions on a controlled cadence, identify observation age/source, and fall back safely when live data is unavailable. |
| TD-023 | Expanded airport roster | Planned | Add a balanced set of general-aviation, regional, major, and international airports, each with appropriate traffic mixes, runways, procedures, weather behavior, and difficulty rather than airport geometry alone. |

## Quick start with Docker

```bash
docker build --build-arg APP_VERSION=2.5.1 -t atc-manager:2.5.1 .
docker run --pull=never --rm -p 8080:80 atc-manager:2.5.1
```

Open <http://localhost:8080>. For a background container:

```bash
docker run --pull=never -d \
  --name atc-manager \
  --restart unless-stopped \
  -p 8080:80 \
  atc-manager:2.5.1
```

## Quick start with Podman

```bash
podman build --format docker --build-arg APP_VERSION=2.5.1 \
  -t localhost/atc-manager:2.5.1 .
podman run --pull=never --rm -p 8080:80 localhost/atc-manager:2.5.1
```

Using a `localhost/` prefix makes it explicit that Podman should use the local
image rather than search a remote registry. Docker image format is requested so
Podman preserves the Dockerfile health check; the app remains an OCI-compatible
container. If a Podman machine is not already running on macOS or Windows:

```bash
podman machine init
podman machine start
```

## Compose

The Compose file works with Docker Compose v2 and Podman's Compose provider:

```bash
# Create your untracked local deployment configuration once.
cp .env.example .env

# Docker (recommended: embeds the commit and checks port availability)
make compose-up
make compose-down

# Podman
make ENGINE=podman compose-up
make ENGINE=podman compose-down
```

Compose reads `.env` automatically. Change `PORT` there whenever the published
HTTP port needs to move, then redeploy:

```bash
# .env
PORT=8081
APP_VERSION=2.5.1

make compose-up
# or
make ENGINE=podman compose-up
```

The real `.env` is ignored by Git; `.env.example` documents the available
values. `APP_VERSION` controls both the Compose image tag and OCI image-version
label. The Make targets give `.env` priority, embed the current Git commit, and
try the requested port first. If another process owns it, they select the next
available port above or below it and print the chosen value. Direct
`docker compose` and `podman compose` commands still read `.env`, but do not
perform automatic port fallback or Git revision discovery.

## What `make` does

`make` is only a shortcut for the longer Docker or Podman commands in this
project. You do not need to know Make syntax or edit the `Makefile`. For a
normal Docker deployment:

```bash
# First deployment only: create your private configuration.
cp .env.example .env

# Build or rebuild the image and start the app.
make compose-up

# Stop and remove the Compose container later.
make compose-down
```

Before `make compose-up` starts Docker, it:

1. Reads `PORT` and `APP_VERSION` from `.env`.
2. Uses the requested port, or finds a nearby free port if it is occupied.
3. Embeds the current Git commit in the displayed build version.
4. Runs `docker compose up --build -d`.

The command prints the port it actually selected. For example, if `.env`
contains `PORT=7123`, open `http://localhost:7123`. If 7123 is occupied and the
command selects 7124, open `http://localhost:7124` instead.

Keeping `.env` in `.dockerignore` is intentional. Compose and Make read it from
the host before the image is built, so private local settings do not need to be
copied into the image. Plain `docker run` does not read `.env` or publish a port
automatically; its equivalent would need an explicit option such as
`-p 7123:80`.

## Make targets

The Makefile uses Docker by default. Select Podman with `ENGINE=podman`.

```bash
make build
make run PORT=8081
make run-detached
make logs
make stop
make rm

make ENGINE=podman build
make ENGINE=podman run PORT=8081
make ENGINE=podman compose-up

# Preserve the image-level health check when building directly with Podman
make ENGINE=podman BUILD_FLAGS="--format docker" build
```

`VERSION`, `IMAGE`, `PORT`, `CONTAINER`, `BUILD_COMMIT`, and `BUILD_FLAGS` can
all be overridden. The default image is `atc-manager:2.5.1`.

## Mobile and tablet browsers

The game adapts to iPhone, iPad, and other touch browsers in portrait and
landscape. The radar supports tap selection and two-finger zoom, the flight
strip panel uses touch-sized controls, and safe-area insets are respected when
the app is launched from an iOS home screen.

On touch displays, IFR commands use rotary heading, speed, and altitude dials
with seven-segment readouts and quick step buttons, so the system keyboard is
not required. Fixes, runways, SIDs, and STARs use a horizontally scrollable
tap-to-select list beside a large send-command control. Desktop browsers retain
the existing keyboard-oriented fields. The touch readout color is configurable
under appearance settings.

In Safari, use **Share → Add to Home Screen** for a standalone web-app
experience. Interface scale defaults to the connected display and can be
overridden under **Settings → Appearance → Interface scale**. That choice,
radar font size, colors, and the other appearance settings remain local to the
current browser profile, so one player's device does not change another's.
The About panel shows the release and source revision as
`2.5.1+<commit>`, which identifies the exact hotfix build in use.

## Local development

Use Node.js 22 (the version in `.nvmrc`). The legacy Preact CLI uses webpack 4,
so the container supplies the build-only OpenSSL compatibility option.

```bash
nvm use
npm ci
npm start
```

The development server watches the source tree. To produce and serve a static
production build:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
npm run serve
```

Node.js 25 is intentionally outside the supported range because this legacy
Preact CLI/webpack toolchain is only validated through Node.js 24. Docker or
Podman provides the most reproducible build on machines with a different host
Node version.

## Verification

```bash
npm run lint
NODE_OPTIONS=--openssl-legacy-provider npm run check

docker build -t atc-manager:verify .
docker run --rm -d --name atc-manager-verify -p 8080:80 atc-manager:verify
curl --fail http://localhost:8080/healthz
curl --fail http://localhost:8080/game/
docker rm -f atc-manager-verify
```

Use the equivalent `podman` commands to validate the OCI image with Podman.
The image itself includes a health check.

## Offline support and push notifications

Production builds generate both `sw.js` and `sw-esm.js`. Preact CLI registers
the correct worker for each bundle. The worker precaches the app, falls back to
the SPA shell for navigation, and contains the push notification handlers.

Service workers require HTTPS except on `localhost`. If an older deployment is
stuck in a browser cache, use the in-app **Settings → Clear caches** control,
then reload. You can also unregister the worker and clear site data from the
browser's Application/Storage developer tools.

Push subscription still depends on the configured VAPID key and subscription
endpoint in `lib/config.js`; offline gameplay does not.

## Timelapse sharing

Timelapses stay local unless you explicitly share or export them. On browsers
that support sharing files, **Share / Export** opens the platform share sheet;
elsewhere it downloads an `.atc-timelapse.json` file. Import that file from the
Timelapse Overview. No account or hosted storage service is required.

## Troubleshooting

### Podman reports “requested access to the resource is denied”

Podman did not find the requested image locally and tried to pull it. Build it
first, use the same tag for `build` and `run`, and keep `--pull=never`:

```bash
podman build --format docker --build-arg APP_VERSION=2.5.1 \
  -t localhost/atc-manager:2.5.1 .
podman run --pull=never --rm -p 8080:80 localhost/atc-manager:2.5.1
```

### Port 8080 is already in use

Publish another host port:

```bash
docker run --rm -p 8081:80 atc-manager:2.5.1
podman run --rm -p 8081:80 localhost/atc-manager:2.5.1
```

### Container build dependency errors

The image uses `npm ci`, so `package.json` and `package-lock.json` must remain in
sync. Regenerate the lockfile with a supported Node/npm version and commit both
files together. Do not run Browserslist database updates as part of a container
build; normal dependency maintenance should update that transitive data.

### Babel reports that `react-icons/fa/index.esm.js` exceeds 500 KB

This is a build-time code-formatting warning from the legacy Preact
CLI/webpack/Babel toolchain, not a failed check and not a runtime image error.
The production build can be used when `npm run check` and the container build
finish successfully. Replacing the legacy frontend toolchain remains tracked as
TD-015; suppressing the warning would not make the generated app smaller or
safer.

## Project structure

- `components/`, `containers/` — Preact UI and routed views
- `stores/`, `lib/`, `schema/` — simulation state, parsers, persistence, and data
- `assets/maps/` — bundled airport maps
- `sw.js` — offline and push-notification worker source
- `Dockerfile`, `nginx.conf`, `docker-compose.yml` — production container stack

See [CHANGELOG.md](CHANGELOG.md) for the detailed change history.
