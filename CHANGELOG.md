# Changelog
All notable changes to this project will be documented in this file.

## [3.0.0-rc.1] - 2026-07-29

### Added

- Added a persistent System, Light, and Dark interface theme selector. System
  mode follows the device preference without requiring a reload.
- Added automatic session pausing when the game page becomes hidden, loses
  focus, is backgrounded, freezes, or the device begins navigating away.
- Added a focused pause overlay with a blurred scope, glowing dialog, pause
  reason, and prominent Resume Session action.

### Changed

- Rebuilt the homepage as a modern responsive control surface with fluid
  typography, soft radar glows, sharp card geometry, a live scope-inspired
  hero, clearer session configuration, and consistent tool navigation.
- Reworked homepage and tutorial navigation around the same theme-aware design
  language and improved phone, tablet, short-landscape, and desktop layouts
  using actual viewport dimensions.
- Modernized the in-game utility labels, enlarged desktop command fields, and
  moved touch utility actions into a translucent floating menu.
- Renamed the product to ATC Manager 3 and updated application, manifest,
  Compose, Make, image, documentation, and build metadata to 3.0.0-rc.1.

### Fixed

- Removed the unsolicited first-launch tutorial prompt. Starting a normal
  session now enters the game directly; tutorials appear only after an explicit
  Tutorial selection.
- Made the touch aircraft list and command editor independently scrollable so
  altitude and Send Command remain reachable on short mobile displays.
- Removed the web-app manifest's forced landscape orientation so installed
  iPhone and tablet sessions can follow the current device dimensions.
- Prevented a stale per-host `.env` release value from keeping upgraded
  deployments on an old image tag; `.env` now carries infrastructure settings
  while the tracked Makefile owns the release version.

## [2.5.1] - 2026-07-29

### Added

- Added display-aware interface scaling with a per-browser override that is
  persisted alongside the existing radar font and appearance settings.
- Added touch-friendly radar zoom, iOS safe-area support, standalone web-app
  metadata, and responsive iPhone/iPad portrait and landscape layouts.
- Added touch-only IFR command controls with rotary heading, speed, and
  altitude dials, seven-segment readouts, quick step buttons, a horizontally
  scrollable fix/runway picker, and an aligned green send-command control.
- Added a locally persisted touch-control display color under appearance
  settings.
- Added an ignored local `.env` workflow and a tracked `.env.example` for
  quickly changing the Compose HTTP port and image version.
- Added the source commit to the in-app build label and OCI image revision,
  allowing multiple 2.5.1 hotfix builds to be identified precisely.

### Changed

- Updated package, manifest, HTML, Compose, Makefile, Docker image-label, and
  documentation defaults to 2.5.1.
- Made the Make-based deployment flow load `.env`, pass the current Git commit
  into the build, and report the actual published HTTP port.
- Enlarged the desktop command fields and replaced the permanently visible
  mobile utility actions with a translucent floating menu.

### Fixed

- Promoted the flight-strip styles into the game route so production
  tree-shaking cannot drop them, fixed the malformed selector that Safari could
  discard, and strengthened strip backgrounds, separators, selection contrast,
  and sidebar containment.
- Replaced the fixed half-scale viewport and one-time window measurements with
  device-width scaling and flexible radar/sidebar sizing across browser
  resizes and device rotation.
- Fixed `make run`, `make run-detached`, and `make compose-up` overriding the
  `.env` HTTP port with 8080; the requested port is now preferred and a nearby
  available port is selected when it is already occupied. Compose deployments
  are forcibly recreated and their resulting Docker port mapping is verified.
- Kept the touch command editor independently scrollable and removed the
  always-visible mobile menu rows that could conceal the altitude and Send
  controls.

## [2.5.0] - 2026-07-29

ATC Manager 2.5.0 is the first Redeux release based on version 2.4.0. It
retains the ATC Manager 2 identity while delivering the accumulated runtime,
simulation, interface, local-data, tooling, and container improvements below.

### Added

- One production image and Compose definition that work with both Docker and
  Podman. (TD-001)
- A container health check and `/healthz` endpoint. (TD-001)
- A project Node version file and a single `npm run check` verification command.
  (TD-003)
- A first-party service worker that combines offline precaching, SPA routing,
  push notifications, and notification-click handling. (TD-002)
- Local timelapse file export, native file sharing where supported, and
  validated timelapse file import.
- A dependency-free SVG timelapse chart for traffic load and game events.

### Changed

- Standardized the build on Node.js 22, reproducible `npm ci` installs, and
  Preact CLI's non-prerendered production output.
- Regenerated the npm v3 lockfile from the project root, removing transient
  local paths and stale packages while restoring a clean production dependency
  audit.
- Updated Preact, Preact CLI, and ESLint within their existing major versions,
  and removed obsolete or unused build plugins.
- Migrated jsondiffpatch to its patched ESM release, removing the audited
  production dependency advisories while retaining the existing timelapse APIs.
- Removed the obsolete custom Preact configuration after Preact CLI 3.5 made
  its compatibility aliases and global CSS defaults sufficient.
- Routed remaining React-dependent packages through `preact/compat`, retaining
  forms, sharing, fullscreen timelapses, and other integrations.
- Replaced incompatible or obsolete chart, date-formatting, compression, and
  hosted timelapse clients with small browser-native implementations.
- Reduced simulation-render overhead by removing redundant global listeners
  from every aircraft row, radar target, and static radar layer.
- Made route, SID, STAR, waypoint, airport, MSA, and timelapse visualization
  render directly from current state instead of duplicating it in components.
- Persisted game speed, traffic interval, starting-traffic counts, speech
  controls, and distance-circle color alongside existing local settings.
- Enabled unused-variable and duplicate-object-key lint checks and removed the
  dead imports and invalid duplicate field they exposed.
- Updated nginx caching so HTML, the web manifest, and service workers refresh
  correctly while static assets remain cached.
- Stopped publishing generated JavaScript source maps in the production image.
- Confined Node.js and the legacy frontend toolchain to the disposable build
  stage; the final image contains only nginx and the generated static app.
- Made the Makefile container-engine neutral through `ENGINE=docker|podman`.
- Reworked the README around gameplay, local development, Docker, Podman,
  verification, troubleshooting, current redeux improvements, and a
  referenceable planned-feature register.
- Added roadmap entries for optional local-first cloud synchronization
  (TD-019) and expanded general-aviation traffic (TD-020).
- Added roadmap entries for airport-wide SID/STAR procedure coverage and path
  visualization (TD-021), session-locked live METAR/ATIS weather (TD-022), and
  a balanced general-aviation-through-international airport roster (TD-023).
- Reconciled package, lockfile, PWA manifest, HTML, documentation, Makefile,
  Compose, image-tag, and OCI image-label version metadata at `2.5.0`.
- Expanded Git and container-context exclusions for generated output, secrets,
  caches, logs, local overrides, editor state, and container archives. (TD-003)

### Fixed

- Restored both `sw.js` and `sw-esm.js`; legacy browsers no longer request a
  missing service worker.
- Restored push notification handling without emitting the notification worker
  asset twice.
- Fixed cache clearing so it removes the cache names generated by current
  Workbox releases.
- Fixed text-command climbs being capped at the current altitude and normalized
  text-command headings to aviation-style 001–360 values.
- Fixed reversed runway-length filtering, circular wind/runway angle
  comparisons, collision-avoidance turns in one direction, and VFR-only airport
  traffic generation.
- Fixed spawn-counter units and high-speed path/weather counter division,
  preventing bursts, invalid modulo results, and uneven spawn timing.
- Fixed duplicate flight numbers and registrations, missing MSA-sector
  headings, biased identifier shuffling, and mutable shared map definitions.
- Fixed route parsing and serialization, route-leg heading scoring, missing
  waypoint guards, and stale route lines; the route-visualization setting now
  controls the display.
- Fixed settings restoration, duplicate change events, invalid stored map
  selections, and cache/storage failures that could prevent startup.
- Fixed malformed local save/timelapse handling and skipped saved aircraft whose
  model is no longer available.
- Fixed timelapse frame bounds, fractional-speed rounding, final-frame playback,
  chart start data, and duplicate recording updates.
- Fixed the operator editor saving an undefined object, stale editor JSON,
  broken file imports, uncontrolled selectors, and stray Saves Editor text.
- Fixed fullscreen detection, speech API feature detection, unsupported voice
  command startup, push-subscription errors, feed cancellation, and router
  change event wiring.
- Fixed event-listener and loading-animation leaks, including an interval that
  previously ran without a delay and a listener added during unmount.
- Moved active UI subscriptions out of deprecated pre-mount lifecycle hooks and
  removed empty lifecycle hooks; game-message updates no longer mutate state in
  place.
- Hardened ground-view data requests and exact airport lookup, restored the
  ground store's loaded state, surfaced loading failures, filtered invalid taxi
  edges, and only generated reverse taxi edges for two-way routes.
- Recomputed MSA-block geometry when its polygon or zoom changes and removed
  leftover ground-view debug output.
- Scoped the unsaved-progress browser warning to an active game and removed
  obsolete analytics loading.
- Fixed `debounce()` forwarding the bundler wrapper's arguments instead of the
  caller's arguments and `this` value.
- Fixed browser-global and `typeof` checks used by airplane-library refreshes
  and speech-recognition feature detection.
- Safely enumerated saved games and timelapses even when stored objects override
  `hasOwnProperty`.
- Removed a stray `/>` rendered beside the VFR state selector.
- Fixed the lint command, which previously targeted a nonexistent `src`
  directory.

### Removed

- Removed the unused serverless backend scaffold and its obsolete environment
  templates.
- Removed the unused external account integration and its login UI.
- Removed generated build artifacts and personal editor settings from source
  control; production output is now created only by the build pipeline.
- Removed the obsolete deployment command that committed the entire working
  tree and depended on tracked generated output.
- Removed the obsolete hosted timelapse API client and unused Recharts,
  Timeago, and LZ-String dependencies.
- Removed unused placeholder components and a disconnected third-party
  integration stub that was no longer routed or bundled.

## [2.4.0] - 2018-10-14
### Added ✅
- LAX (Airport)
- Zooming
- Game messages
- General Aviation & VFR
- Enroute flights
- Closed pattern traffic (TGL and Full stop landings)
- VFR
 - Callsigns
 - Navigation
 - Callsigns based on registration numbers
 - Collision avoidance
 - Controlled area around airport (Enroute VFR Will not enter this area)
- Airplanes
 - Cessna 172
 - Airbus A340
 - B1900
 - MD-11
 - ATR 42
 - ATR 72
 - Beechcraft Bonanza
 - de Havilland Canada DHC-6
 - Cirrus SR22 
 - Cirrus SR20 
 - Diamond DA20 Katana 
 - Diamond DA40 Star 
 - Mooney M20 
 - Robin DR400 
 - GippsAero GA8 Airvan 
- Operators
 - Norwegian Air Shuttle [HL3177] 
 - Cathay Dragon  [HL3177] 
 - Finnair [HL3177] 
 - Iberia
 - South African Airways
 - Scandinavian Airlines 
 - Virgin Atlantic 
 - DHL 
 - HOP!
- Takeoff in the correct order option
- Go arounds 
- Random go-arounds based on weather (behind a checkbox)
- Correct elevation
- Timelapses
- Sharing
- Timelapse sharing
- Airplane wake turbulance categories (super, heavy, medium, light)
- Statistics (Can be viewed when playing back a timelapse)
- Text commands
- Tutorials  [jet86] 
 - Text commands tutorial 
 - Beginner tutorial  [ImportedSwede] 
- More links (contact page, blog page)
- Added ImportedSwede and HL3177 to the list of contributers
### Changed ❗
- "Map does not support VFR" Message 
- Airplanes have a different likeliness of spawning
- Operators have a different likeliness of spawning
- Different airports can have vfr and/or ifr flights depending on the type of airport
- Fixed label overlapping on schiphol
- Assigning a runway to an airplane can be done at altitudes higher than 3200ft
- Better airplane specifications
- More realistic ATC Jargon
- Schiphol. One of both TULIP and SPY should be arrival
- Ask for overwrite instead of prompting that the save name already exists
- Better and more dynamic weather
- Waypoint label overlapping fixes
- Updated JSON Schema's
### Removed ❌
- Non English speech synthesis languages 

## [2.3.0] - 2018-09-13
### Added
- Set take-off runway [chrstphd]
- Ability to change font size in the settings window (save to localstorage) [chrstphd]
- Easing airplane's speed, altitude, heading, etc. after command is given
- Add spawn speed slider to options panel [KableKiB]
- Content editor - Submit/edit new airplanes/airports for approval
- Saves Editor - IN PROGRESS
- Airplane Info Panel
- Persist some settings to local storage (settings like ILS and text colors)

### Changed
- Apply command immediately when enter is pressed [wonderfulllama, AWT-Colin]
- When planes overlapping separate change the location of the text so it's easier to know which plane to click on (How should this be implemented? Right clicking on airplane to change position of text. Automatically detect if info text is over another plane's info text? Some other way?) [wonderfulllama]
Aircraft spawning at the same rate with different gamespeeds [KableKiB]
- When a plane starts to land and has an altitude set, it shows the green arrow up, while descending. [AWT-Colin]
- IRL you cannot fly faster than 250KT below FL100. However the planes start to slow down right after they passed below 10.000 feet. They should start sooner with their slowdown. [AWT-Colin]
- Show all waypoints/runways in the direct to dropdown when selecting a new waypoint/runway [AWT-Colin]
- "Direct to" lowercase to uppercase conversion
- Descend ratio while decelerating [AWT-Colin]
- Make it easier to clearly read runway numbers numbers. [AWT-Colin]
- Difficulty selection reset bug [AWT-Colin]
- clear out he heading value if the waypoint is valid - [KableKiB]

## [2.2.0] - 2018-09-09
### Changed 
- Fixed issue were plane speed became Nan [xtesseract]
- Spell mistakes fixed [FlightGearLego]
- Fixed a bug were planes would still spawn after the game was paused [PURRING_SILENCER, KableKiB]
- Show correct tgtSpeed
- Command is given by pressing button or pressing a key [wonderfulllama]
- Highlight selected plane [wonderfulllama]
- Show the runway on which the plane is taking off from [ShadingVaz]
- If outbound and alt less than 1900, keep heading

## [2.1.0] - 2018-09-05
### CHANGED:
- climbspeed
- decendSpeed
- accelerationSpeed
- deAccelerationSpeed.
- Switch size
- Description
- Traffic stack color

## [2.0.0] - 2018-08-26
### Added
- Better icons
- Android icons
- Apple icons
- Microsoft icons
- Safari icons
- Updated theme colors
- In-game icons
- Safety prompts when discarding unsaved data
- Info panel
- About panel
- Logs panel
- More (realistic) logs
- Tab close message if the user has unsaved progress
- New planes
  - Boeing 757
  - Boeing 767
  - Boeing 777
  - Airbus A380
  - Airbus A330
  - Boeing 787 Dreamliner
  - Airbus A319
  - Airbus A320
  - Airbus A321
  - Airbus A350
  - Boeing 717
  - McDonell Douglas MD-88
  - McDonell Douglas MD-90
  - Embraer 190
  - McDonell Douglas MD-82
  - McDonell Douglas MD-83
 - New operators
  - Southwest Airlines
  - American Airlines
  - British Airways
  - Continental Airlines
  - Lufthansa
  - Air France
  - China Southern Airlines
  - China Eastern Airlines
  - All Nippon Airways
  - Ryanair
  - Turkish Airlines
  - Emirates
  - FedEx Express
  - UPS Airlines
  - Cathay Pacific
  - Qatar Airways
  - Korean Air
  - Cargolux
  - Air China
  - Egyptair
- App caching (performance & offline use)
- Altimeter setting
- Atis info
- Pilot messages are now included in the logs

### Changed
- Fixed an issue where saving a map without a name caused issues
- Better checkboxes (the old ones were ugly)
- Styling tweaks
- Game not updating in the background fixed
- Updated operators on some aircraft
- Speech synthesis default rate
- Runway left/right switched fix
- Default airport/map colors changed
- Optimized web-app size

### Removed
- Speech recognition option is removed (because it hasn't yet been implemented)
