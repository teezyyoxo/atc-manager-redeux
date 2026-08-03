# ATC Manager 3

ATC Manager 3 is a browser-based air traffic control game. Manage IFR and VFR
traffic around Schiphol, Heathrow, LAX, Palm Springs, and the default airport;
issue text commands; manage runway traffic; save games; and record, export,
import, or share timelapse files.

The production app is a static Preact build served by nginx. The same
multi-stage `Dockerfile` is supported by Docker and Podman.

Current release: **3.0.0-rc.30**

## Features

- IFR, VFR, enroute, pattern, arrival, and departure traffic
- Multiple airports, runways, SIDs, STARs, waypoints, weather, and wake
  turbulence
- 81 built-in aircraft with differentiated performance and wind limits
- Text commands, tutorials, configurable game speed, and accessibility settings
- Local saves, airplane/operator editors, and timelapse recording, playback,
  file import, and file export
- Offline precaching and optional web push notifications
- Responsive SPA routing with direct links to game, editor, and timelapse views
- System-aware light and dark interface themes with a persistent manual override
- Automatic pause protection when an active game is backgrounded or loses focus
- Once-per-build New Features announcements sourced from the current changelog

## What Redeux improves

These identifiers are permanent references for release notes, discussions, and
future changelog entries.

| ID | Improvement | Current state |
| --- | --- | --- |
| TD-001 | Reproducible Docker and Podman delivery | Available in 2.5.0 with one production image, Compose support, health checks, and SPA-aware nginx routing. |
| TD-002 | Resilient browser runtime | Available in 2.5.0 with offline precaching, modern and legacy service workers, cache controls, and optional push handling. |
| TD-003 | Repeatable verification | Available in 2.5.0 with pinned Node guidance, `npm ci`, lint/build checks, a production dependency audit, and versioned container metadata. |
| TD-004 | Broader aircraft support | Available in 3.0.0-rc.2 with 81 built-in airliner, regional, cargo, business, utility, and general-aviation types plus an in-game editor for custom definitions. |
| TD-005 | Broader airline/operator support | The current catalog includes 35 built-in operators plus an operator editor, callsigns, colors, and rarity controls. |
| TD-006 | Scope and traffic customization | Available controls include working radar/font and route-display settings plus colors for backgrounds, traffic classes, paths, SIDs, STARs, ILS, MSA, climb, descent, and warnings. |
| TD-007 | Expanded traffic simulation | IFR, VFR, enroute, pattern, arrival, and departure traffic coexist with wind-responsive ground movement, aircraft-specific wind limits, wake categories, go-arounds, local saves, and timelapses. |

## Planned features and known gaps

This is a direction-of-travel register, not a promised delivery schedule.
“Needs refinement” means a basic capability exists but is not yet at the desired
quality or flexibility.

| ID | Feature or gap | Status | Intended outcome |
| --- | --- | --- | --- |
| TD-008 | Additional aircraft packs | Available in 3.0.0-rc.2 | The first expanded pack adds 48 types and rebalances the 33 legacy profiles; future packs can continue adding specialized traffic such as helicopters. |
| TD-009 | Additional airlines and operators | Planned | Expand global, regional, cargo, charter, and general-aviation operators with accurate callsigns and sensible fleet assignments. |
| TD-010 | Multiple radar/scope types | Planned | Provide distinct tower, ground, approach/TRACON, enroute, and simplified training scope presets. |
| TD-011 | Radar and interface visual refinement | Needs refinement | Improve aircraft labels, vector/trail rendering, spacing, typography, responsive layouts, selection states, and high-density traffic readability. |
| TD-012 | Visual presets and accessibility | Planned | Add coherent scope themes, color-blind-safe palettes, contrast presets, scalable UI density, and easier reset/import/export controls. |
| TD-013 | Airport and scenario authoring | Planned | Make it easier to define and validate airports with curated procedures, runway-use rules, traffic mixes, weather behavior, tutorials, and difficulty profiles. |
| TD-014 | Simulation fidelity | Improved in 3.0.0-rc.2 | Aircraft now have differentiated performance and wind-component limits, and airborne movement responds to wind; runway occupancy, sequencing, taxi behavior, and conflict feedback still need refinement. |
| TD-015 | Modern frontend toolchain | Technical debt | Replace Preact CLI/webpack 4 and retire the build-only OpenSSL compatibility setting without losing existing features. |
| TD-016 | Automated regression coverage | Technical debt | Add unit tests for parsers and simulation rules plus browser smoke tests for saves, editors, routes, timelapses, and offline behavior. |
| TD-017 | Performance profiling | Planned | Establish measurable frame-time, memory, startup, and large-traffic targets; optimize only against recorded regressions. |
| TD-018 | Tutorials and command discovery | Needs refinement | Improve command help, contextual feedback, onboarding, examples, and discoverability for advanced traffic-management features. |
| TD-019 | Optional cloud saves and cross-device sync | Planned | Evaluate a modular Firebase reimplementation for opt-in save synchronization, backup, and conflict handling while keeping local saves, offline play, and account-free gameplay fully functional. |
| TD-020 | Expanded general-aviation traffic | Planned | Build on existing GA/VFR support with richer aircraft mixes, pattern work, transient traffic, practice approaches, touch-and-go activity, realistic callsigns, variable experience levels, and airport-specific behavior. |
| TD-021 | Expanded SID and STAR procedures | Planned | Add accurate SID departure and STAR arrival procedures to every supported airport, assign them appropriately to traffic, and visualize complete selectable procedure paths, transitions, restrictions, and active routes on the scope. |
| TD-022 | Live airfield weather | Planned | Add an opt-in live-weather setting during session setup that uses current METAR and available ATIS information for the selected airfield. Lock the setting once play begins, update conditions on a controlled cadence, identify observation age/source, and fall back safely when live data is unavailable. |
| TD-023 | Expanded airport roster | Planned | Add a balanced set of general-aviation, regional, major, and international airports, each with appropriate traffic mixes, runways, procedures, weather behavior, and difficulty rather than airport geometry alone. |

## Deployment with Make

The Make targets are the recommended deployment interface. They provide the
same workflow for Docker and Podman, while also loading local configuration,
embedding the Git revision, checking port availability, and verifying the
resulting container port. You do not need to know Make syntax or edit the
`Makefile`.

### First deployment

Create the private configuration on the computer that will run the container:

```bash
cp .env.example .env
```

Edit `.env` and choose the preferred host port:

```dotenv
PORT=7123
```

Then deploy with Docker:

```bash
make compose-up
```

Or deploy the same Compose service with Podman:

```bash
make ENGINE=podman compose-up
```

If a Podman machine is required on macOS or Windows, initialize it once before
deploying:

```bash
podman machine init
podman machine start
```

Use the exact target `compose-up`, with a hyphen. `make compose-up` uses Docker
by default; adding `ENGINE=podman` is the only workflow difference for Podman.

Before starting the service, Make:

1. Reads the preferred `PORT` from `.env`.
2. Uses the requested port, or finds a nearby free port if it is occupied.
3. Embeds the current Git commit in the displayed build version.
4. Rebuilds and forcibly recreates the Compose service.
5. Checks the resulting port mapping and fails if it does not match.

The command prints `Publishing ATC Manager on port ...` followed by
`Verified: http://localhost:...`. Open that verified address. To stop the
service:

```bash
# Docker
make compose-down

# Podman
make ENGINE=podman compose-down
```

### Quick upgrades

The fastest upgrade pulls the newest commit, rebuilds the image, and recreates
the running service:

```bash
# Docker
git pull --ff-only && make compose-up

# Podman
git pull --ff-only && make ENGINE=podman compose-up
```

For an explicit stop-and-start upgrade:

```bash
# Docker
git pull --ff-only && make compose-down && make compose-up

# Podman
git pull --ff-only && make ENGINE=podman compose-down && make ENGINE=podman compose-up
```

Using `&&` stops the sequence if any command fails. The untracked `.env` file
and local saves are not replaced by `git pull`.

### Reclaiming Docker build cache

Docker retains unused build layers so later builds can reuse them. Release
updates normally benefit from that cache, but old dependency layers can
accumulate over time and eventually cause an `ENOSPC: no space left on device`
error during `npm ci`. Check Docker's current usage without changing anything:

```bash
docker system df
```

When the builder has accumulated substantial reclaimable data, remove only its
unused build cache:

```bash
docker builder prune
```

This does not remove running containers, named volumes, or local browser saves.
It can make the next image build slower because dependencies may need to be
downloaded again. It is maintenance for a full or heavily used Docker store,
not a step required for every upgrade.

To include cleanup in the explicit stop-and-start workflow, use:

```bash
git pull --ff-only && make compose-down && docker builder prune -f && make compose-up
```

The `-f` option only skips the prune confirmation. Using `&&` is important: the
service is not rebuilt if the pull, shutdown, or cleanup fails. For the normal
upgrade without cleanup, continue using:

```bash
git pull --ff-only && make compose-down && make compose-up
```

There is no advantage to switching to raw `docker compose up` after pruning.
`make compose-up` already invokes `docker compose up --build` and additionally
loads host configuration, embeds the Git revision, finds an available port,
forces service recreation, and verifies the published address. Use raw Compose
only when diagnosing the Make wrapper itself or on a host where Make is not
available.

### Per-host configuration

The real `.env` is ignored by both Git and the container build. It stores
host-specific infrastructure settings such as `PORT`, but does not pin the
application release; Make always takes the current release version from the
tracked `Makefile`. This keeps upgrades from accidentally rebuilding a new
commit under an old image tag. Because `.env` does not follow the repository to
another computer, create or edit it separately on every deployment host,
including a server reached through SSH.

Check the current host's configured port or override it for one deployment:

```bash
grep '^PORT=' .env
make compose-up PORT=7123

# Podman uses the same override
make ENGINE=podman compose-up PORT=7123
```

A command-line `PORT` overrides `.env` for that deployment only. Edit the
deployment host's `.env` to make the change permanent.

Direct `docker compose` and `podman compose` commands can run the service, but
they bypass Make's automatic port fallback, Git revision discovery, forced
recreation, and post-deployment port verification.

### Other Make targets

The non-Compose targets also use Docker by default and accept
`ENGINE=podman`:

```bash
make build
make run PORT=8081
make run-detached
make logs
make stop
make rm

make ENGINE=podman build
make ENGINE=podman run PORT=8081
```

`VERSION`, `IMAGE`, `PORT`, `CONTAINER`, `BUILD_COMMIT`,
`PREACT_APP_MOBILE_TRAFFIC_FACTOR`, and `BUILD_FLAGS` can all be overridden.
The default image is `atc-manager:3.0.0-rc.30`.

## Mobile and tablet browsers

The homepage and game adapt to the actual viewport width and height on iPhone,
iPad, and other touch browsers instead of relying on portrait orientation
alone. The radar supports tap selection and two-finger zoom, the flight-strip
panel uses touch-sized controls, and safe-area insets are respected when the
app is launched from an iOS home screen.

On touch displays, IFR commands use rotary heading, speed, and altitude dials
with seven-segment readouts and quick step buttons, so the system keyboard is
not required. Fixes, runways, SIDs, and STARs use a horizontally scrollable
tap-to-select list beside a large send-command control. Desktop browsers retain
the existing keyboard-oriented fields. The touch readout color is configurable
under appearance settings.

Mobile and tablet sessions automatically start with the first flight selected,
so command controls are visible immediately. They also default to `0.5x`
traffic: the initial aircraft count is proportionally reduced and later
aircraft spawn half as often. Desktop traffic generation remains unchanged.
To tune the mobile multiplier, set a value greater than `0` and no greater than
`1` in `.env` before a local build or Compose/Make build:

```dotenv
PREACT_APP_MOBILE_TRAFFIC_FACTOR=0.5
```

The value is compiled into the browser bundle. Restart the development server
or rebuild the production image after changing it.

In Safari, use **Share → Add to Home Screen** for a standalone web-app
experience. Interface scale defaults to the connected display and can be
overridden under **Settings → Appearance → Interface scale**. That choice,
radar font size, interface font, color theme, colors, and the other appearance
settings remain local to the current browser profile, so one player's device
does not change another's. The bundled IBM Plex Mono, JetBrains Mono, and Share
Tech Mono fonts work without an external font service. System, Light, and Dark
display modes can be selected from the homepage or Appearance settings; System
follows the current device preference. Eleven selectable color themes include
coordinated dark and light palettes and persist in the current browser. During
an active
session, backgrounding the page, changing tabs, or putting the device to sleep
pauses the simulation. Return to the glowing pause dialog and choose
**Resume session** when ready.
The About panel shows the release and source revision as
`3.0.0-rc.30+<commit>`, which identifies the exact release-candidate build in
use.

## New Features announcements

After a newly built commit is deployed, the first page load shows the newest
entry from `CHANGELOG.md` in a responsive New Features dialog. The dialog
includes the release and exact `release+commit` build identifier shown
elsewhere in the interface. Close it with the upper-right ×, the full-width
Close bar, or Escape on a keyboard.

The dismissed build identifier is stored only in the current browser profile.
The same build remains dismissed across later launches on that device, while a
different deployed commit automatically appears even when the release version
has not changed. Clearing site data resets this history. While the dialog is
open, its blurred overlay blocks pointer and touch interaction with the page
behind it.

## Aircraft performance and weather

The built-in fleet covers airliners, regional jets and turboprops, freighters,
business aircraft, utility turboprops, and piston GA aircraft. Each type has
its own runway requirements, speed envelope, ceiling, climb/descent response,
acceleration, turning behavior, wake class, rarity, and wind-component limits.
Existing built-in IDs were preserved so saves created by older releases still
load the intended aircraft. New built-ins use IDs 100–147, leaving the legacy
custom-aircraft range beginning at 33 undisturbed; a custom definition still
takes precedence if it deliberately uses the same ID as a built-in.

The wind shown in the game affects airborne ground track and ground speed; the
aircraft information panel separates heading and airspeed from calculated
ground track and ground speed.
Takeoff assignment prefers a runway within the selected type's crosswind and
tailwind limits, and enabled go-arounds react to the actual components on the
landing runway. The influence tapers below 1,000 feet above the field to avoid
unrealistic movement while an aircraft is on the runway.

These values use the current in-session weather. Opt-in retrieval of live
airport METAR observations remains tracked separately under TD-022.

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
podman build --format docker --build-arg APP_VERSION=3.0.0-rc.30 \
  -t localhost/atc-manager:3.0.0-rc.30 .
podman run --pull=never --rm -p 8080:80 localhost/atc-manager:3.0.0-rc.30
```

### Port 8080 is already in use

Publish another host port:

```bash
docker run --rm -p 8081:80 atc-manager:3.0.0-rc.30
podman run --rm -p 8081:80 localhost/atc-manager:3.0.0-rc.30
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
- `assets/fonts/` — licenses and attribution for bundled interface fonts
- `sw.js` — offline and push-notification worker source
- `Dockerfile`, `nginx.conf`, `docker-compose.yml` — production container stack

See [CHANGELOG.md](CHANGELOG.md) for the detailed change history.
