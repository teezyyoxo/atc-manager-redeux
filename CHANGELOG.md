# Changelog
All notable changes to this project will be documented in this file.

## [3.0.0-rc.34] - 2026-08-03

### Changed

- Refactored saved-session tiles into a compact summary and horizontal action
  layout so desktop cards use less vertical space while retaining accessible
  resume, edit, and delete controls.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.34.

### Fixed

- Made the desktop saved-session list independently scrollable with bottom
  clearance, preventing the final tile and its controls from being clipped or
  unreachable.

## [3.0.0-rc.33] - 2026-08-03

### Added

- Added immediately switchable street, terrain, and satellite geographic views
  beneath the persistent radarscope, with airport-aligned scale, synchronized
  scope zoom, and visible map-source attribution.

### Changed

- Reconciled every built-in operator with the aircraft types represented in its
  current fleet and retired historical operator/type pairings from generation.
- Added operator service regions, long-haul subfleet rules, and airport-specific
  airline pools across the supported commercial airports.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.33.

### Fixed

- Prevented JetBlue Boeing traffic, retired-airline traffic, and other invalid
  operator/aircraft combinations from being generated.
- Restricted Bradley International to medium and light scheduled traffic, so
  Boeing 747, Boeing 777, and other heavy/super aircraft no longer spawn there.

## [3.0.0-rc.32] - 2026-08-03

### Changed

- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.32.

### Fixed

- Centered the desktop Pause/Exit and Save button contents within their
  highlight areas and added clear spacing after the Save icon.

## [3.0.0-rc.31] - 2026-08-03

### Changed

- Widened the desktop Options and Session Logs overlays so settings controls
  and log entries remain fully accessible without horizontal clipping.
- Added a deployment recovery runbook for safely realigning a clean deployment
  checkout after corrected Git history prevents a fast-forward pull.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.31.

### Fixed

- Made desktop Options a blocking dialog that pauses the simulation, locks
  interaction with the radarscope, and blurs the background until dismissed.

## [3.0.0-rc.30] - 2026-08-03

### Changed

- Expanded the mobile flight-strip region at commercial and international
  airports so it begins directly beneath the radarscope and fills the space
  above the command panel.
- Bottom-anchored mobile GA command panels at their worst-case instruction
  height and assigned all reclaimed space to the flight-strip region,
  eliminating the empty area between instructions and the command action.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.30.

## [3.0.0-rc.29] - 2026-08-03

### Changed

- Reworked mobile pull-to-refresh as a compact Promptly-style floating pill
  with an outlined state icon, blurred surface, and no document displacement.
- Limited pull-to-refresh to coarse, non-hovering primary pointers at mobile
  and tablet dimensions so the affordance and gesture are unavailable on
  desktop.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.29.

### Fixed

- Prevented the pull-to-refresh arrow from rendering as an oversized SVG when
  component-level styles are unavailable.

## [3.0.0-rc.28] - 2026-08-02

### Added

- Restored mobile and tablet pull-to-refresh with pull, release, and refreshing
  feedback plus gesture protection for radar, controls, menus, and dialogs.

### Changed

- Increased mobile interface labels by 10% while preserving the selected
  Interface Scale multiplier.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.28.

### Fixed

- Restored the pull-to-refresh feature that was removed during the rc.19
  mobile-layout regression fixes.

## [3.0.0-rc.27] - 2026-08-02

### Changed

- Expanded mobile GA command controls to fill the complete space beneath the
  flight strips, with evenly sized instruction rows and the command action
  anchored to the bottom edge.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.27.

### Fixed

- Removed the unused vertical gap caused by bottom-aligning the compact GA
  control block inside a taller mobile control panel.

## [3.0.0-rc.26] - 2026-08-02

### Changed

- Removed all explanatory sublabels and header hints from live VFR command
  controls on desktop, mobile, and tablet layouts, leaving compact action
  labels that fit their controls without clipping.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.26.

## [3.0.0-rc.25] - 2026-08-02

### Changed

- Standardized desktop dialogs opened from the session menu as compact,
  bottom-left overlays above the radarscope.
- Added a persistent Close Options action to the Settings dialog and kept its
  session-menu toggle available while the dialog is open.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.25.

### Fixed

- Moved the shared game-dialog stylesheet into the always-loaded application
  bundle so Settings, Logs, About, Airfield Information, and Save As can never
  fall into normal page flow beneath the game viewport.

## [3.0.0-rc.24] - 2026-08-02

### Changed

- Compact mobile GA controls now use a fixed three-column instruction grid,
  shorter control heights, and no redundant helper sublabels or summary panel.
- Added persistent arrival, departure, enroute, and local-pattern icons to
  every flight strip so traffic roles no longer depend on color alone.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.24.

### Fixed

- Prevented the mobile GA controls panel from scrolling horizontally or
  vertically during normal command entry.
- Added safe route and aircraft-model fallbacks so incomplete traffic records
  cannot surface an `undefined` label in a flight strip.

## [3.0.0-rc.23] - 2026-08-02

### Added

- Added Appearance Settings controls for the session logs panel's opacity and
  background blur.

### Fixed

- Replaced the layout-breaking desktop logs section with a compact,
  non-blocking bottom-left utility window that does not move or pause the game
  viewport.
- Centered session logs in a blurred modal on mobile and transferred the menu's
  pause state until the log viewer closes, preventing traffic deviations while
  logs are being reviewed.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.23.

## [3.0.0-rc.22] - 2026-08-02

### Changed

- Replaced the ambiguous general-aviation `WIP` and `State` fields with
  route-aware runway choices, plain-language traffic-pattern and departure
  instructions, contextual guidance, and dedicated takeoff/send actions.
- Moved flight strips into the lower control band on mobile at
  commercial-dominant airports while retaining the GA-focused layout at local
  airports.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.22.

### Fixed

- Removed the mobile-only capitalization override that reverted Configure
  Session and View Tutorial buttons to title case.

## [3.0.0-rc.21] - 2026-08-02

### Changed

- Rendered the homepage and workspace navigation labels, plus the Configure
  Session and View Tutorial actions, in uppercase.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.21.

### Fixed

- Restored the Introduction tutorial content by limiting duplicate-heading
  suppression to headings instead of hiding the tutorial's content panel.
- Kept mobile command controls visible by applying the touch layout at narrow
  viewport widths and automatically selecting the next available aircraft when
  the current target leaves the session.
- Prevented SPA route refreshes and user-agent changes from redirecting to an
  internal container port and dropping externally published ports such as
  `:7123`.

## [3.0.0-rc.20] - 2026-08-01

### Changed

- Refactored saved sessions into responsive homepage-native cards with
  structured airspace, save date, simulation time, and traffic details plus
  compact color-coded icon actions for resume, edit, and delete.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.20.

### Fixed

- Prevented long save names and action controls from overflowing or being cut
  off in the homepage Saved Sessions panel.

## [3.0.0-rc.19] - 2026-08-01

### Fixed

- Fixed mobile layout regressions by removing the app-level pull-to-refresh
  view, restoring command controls closer to the bottom edge, and presenting
  the session menu and its dialogs as accessible floating layers above a
  blurred game view while the simulation is paused.

### Changed

- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.19.

## [3.0.0-rc.18] - 2026-08-01

### Fixed

- Removed the duplicate mobile safe-area spacing below the radar and command
  controls, bringing flight strips up to the scope and controls closer to the
  bottom safe-area edge.

### Changed

- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.18.

## [3.0.0-rc.17] - 2026-08-01

### Added

- Added mobile and tablet pull-to-refresh with pull, release, and refreshing
  feedback across browser and installed web-app sessions.

### Changed

- Protected interactive controls, dialogs, and scrolled content from
  accidental pull-to-refresh gestures.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.17.

## [3.0.0-rc.16] - 2026-08-01

### Changed

- Updated the ready-check, pause, Options, About, and Save As dialogs to use
  the active color theme instead of fixed Approach Mint colors.
- Recentered the mobile radar below the safe-area navigation bar without
  changing the radar-to-controls viewport split.
- Removed the empty gap above mobile flight strips and moved command controls
  to the bottom of the remaining session pane.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.16.

## [3.0.0-rc.15] - 2026-08-01

### Added

- Added an automatically detected mobile/tablet traffic mode that defaults to
  half the desktop traffic volume and can be tuned at build time with
  `PREACT_APP_MOBILE_TRAFFIC_FACTOR`.

### Changed

- Kept the mobile Configure Session and View Tutorial actions in title case,
  and moved initial modal focus away from the native airport selector.
- Sorted session airports alphabetically by name and added each airport's ICAO
  code to its option label.
- Selected the first flight automatically on mobile session start so touch
  controls are visible immediately.
- Anchored mobile command controls to the bottom of the available pane and
  added proportional phone/tablet portrait and landscape sizing.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.15.

## [3.0.0-rc.14] - 2026-07-31

### Changed

- Moved mobile game wind, time, and menu access into a thin, safe-area-aware
  top navigation bar.
- Reworked mobile touch commands into one compact row for heading, speed, and
  altitude with a slim full-width Send Command action beneath it.
- Simplified the mobile homepage header, protected it from the iOS system clock,
  and replaced the text display-mode selector with system, sun, and moon icons.
- Reduced saved sessions to compact horizontal rows and added selectable mobile
  actions to resume, edit, or delete each session.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.14.

## [3.0.0-rc.13] - 2026-07-31

### Changed

- Replaced the new-session pause actions with a single Start Session action;
  resume and exit controls now appear only after an active session is paused.
- Corrected runway headings, dimensions, widths, and relative layouts for the
  airports added in rc.12, and removed nonexistent runways from KBDL, KHOU,
  and KHVN.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.13.

## [3.0.0-rc.12] - 2026-07-31

### Added

- Added KFLL, KMIA, KBDL, KMEM, KHOU, KLAS, KBNA, KORD, KEWR, and KHVN
  with airport-specific runway layouts and usage, regional weather profiles,
  airline and aircraft pools, GA availability, scope geography, SIDs, STARs,
  and minimum-sector altitudes.
- Added KMMK, KOXC, and KGON as GA-only facilities with appropriately limited
  aircraft classes, local weather, runway configurations, VFR arrival,
  departure, and pattern traffic, and dedicated scope geography.
- Added airport-level airline filtering to keep generated commercial aircraft
  aligned with each facility's configured operator pool.

### Changed

- Widened the desktop gameplay sidebar while preserving compact and mobile
  breakpoints, giving Pause / Exit and Save / Save As enough room to remain
  legible without clipping.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.12.

## [3.0.0-rc.11] - 2026-07-31

### Added

- Added KLGA and KJFK with airport-specific runways, coastal weather profiles,
  wind-driven runway use, traffic mixes, scope geography, SIDs, STARs, and
  minimum-sector altitudes.
- Added browser-persisted autosave controls. Autosave advances only while a
  session is running, reuses a stable airport-and-time save name, and provides
  quiet status feedback through the in-game Save control.
- Added desktop Shift + Save support for an explicit, isolated Save As dialog
  that creates a separate named snapshot without changing the autosave target.

### Changed

- New sessions now begin paused behind a ready-check dialog before simulation
  time or traffic movement starts.
- Rebuilt in-session Options and About as responsive, independently scrolling
  modal dialogs that silently hold the simulation while open.
- Save now writes immediately to the active session save, autosave consistently
  overwrites that same session save, and Shift + Save creates a separate named
  save without redirecting later autosaves.
- Made every blurred modal block background pointer and keyboard input and
  removed backdrop and Escape-key dismissal in favor of visible controls.
- Restyled Exit Without Saving as a transparent red-outline action and split
  the Pause / Exit label so its separator is no longer part of either label.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.11.

## [3.0.0-rc.10] - 2026-07-31

### Added

- Added seven mode-aware color themes—Tower Green, Cobalt Night, Crimson
  Vector, Rose Quartz, Arctic Ice, Graphite, and Desert Sand—for eleven total
  palettes with coordinated System, Light, and Dark appearances.
- Added a dedicated homepage Settings action and modal plus a functional Tools
  launcher with direct access to every local workspace.
- Added five randomized, one-minute homepage radar scenarios for EHAM, EGLL,
  KLAX, KPSP, and EHZM, with distinct traffic, randomized paths, live altitude
  and airspeed trends, and configurable two-second blurred transitions.

### Changed

- Rebuilt the Save, Aircraft, and Operator editors around task-oriented
  toolbars, empty states, structured and JSON editing modes, clearer local
  persistence actions, responsive review forms, and shared tool navigation.
- Reworked the timelapse library and Tutorials hub with modern responsive
  controls, useful empty states, accessible recording actions, and a structured
  training path.
- Increased homepage eyebrow, capability, hero, section-heading, and navigation
  sizing, and removed the Share workspace card and its inactive homepage flow.
- Removed the remaining external Roboto Mono request now that interface fonts
  are bundled with the application.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.10.

## [3.0.0-rc.9] - 2026-07-31

### Added

- Bundled IBM Plex Mono, JetBrains Mono, and Share Tech Mono for fully offline
  interface-font selection, with each browser profile retaining its choice.
- Added Approach Mint, Oceanic Blue, Amber Scope, and Violet Dusk color themes,
  each with purpose-built System, Light, and Dark mode palettes.

### Changed

- Restored the flight-strip bar's original monospace typography and local text
  treatment so interface-font preferences do not affect operational cards.
- Made the homepage radar glow, sweep, grid, rings, and background washes
  respond consistently to the selected color theme.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.9.

## [3.0.0-rc.8] - 2026-07-31

### Changed

- Replaced the unbundled Roboto Mono declaration with an offline native
  UI-monospace stack and added a restrained dark-mode edge to light text for
  improved legibility over radar surfaces.
- Simplified speech synthesis to a single enable toggle that reveals Voice,
  Pitch, and Rate only while speech output is enabled.
- Increased desktop homepage navigation, hero, workspace, radar, and footer
  sizing slightly while retaining the single-viewport layout.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.8.

## [3.0.0-rc.7] - 2026-07-31

### Added

- Added a continuously rotating radar sweep and deterministic, one-minute
  movement paths for the aircraft in the homepage radar preview.

### Changed

- Rebalanced the desktop homepage to bring the hero and workspace closer
  together, give the lower workspace more usable height, and increase
  supporting text and tool-card legibility while retaining a single viewport.
- Rebuilt session configuration as a wider, fluid dialog with larger type,
  persistent actions, aligned setting rows, right-aligned color controls, and
  higher-contrast range-slider handles.
- Distributed the former advanced options into the main settings block and
  moved speech synthesis into its own collapsible section.
- Moved npm downloads and build-only dependencies into reusable container
  cache mounts so release-version changes do not retain a new dependency layer.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.7.

## [3.0.0-rc.6] - 2026-07-31

### Changed

- Standardized navigation, action, section, tool, editor, training, session,
  and settings labels with consistent title capitalization.
- Reflowed the desktop homepage into a single-viewport control surface with a
  compact hero, saved sessions, tools, and visibly interactive footer links.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.6.

### Fixed

- Moved the release-dialog stylesheet into the always-loaded application CSS
  bundle so What’s New remains a centered, blurred, independently scrollable
  modal instead of falling into document flow below the footer.

## [3.0.0-rc.5] - 2026-07-31

### Added

- Added a selected-aircraft projected track vector for heading assignments.
  The four-minute projection uses commanded heading, current airspeed, session
  wind, and the same near-field wind taper as live aircraft movement.
- Added a responsive, centered session-configuration dialog with a blurred
  backdrop, keyboard focus containment, Escape dismissal, and independently
  sized desktop and mobile layouts.

### Changed

- Consolidated What’s New into an explicitly invoked navigation modal, removed
  its homepage and standalone-page variants, and restyled its type with the
  radar-scope-inspired monospace interface font.
- Tightened the homepage into a shorter hero, saved-session continuation area,
  and tool grid; removed the empty release, notification, and project-feed
  blocks; and changed primary actions to the scope-style interface font.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.5.

### Fixed

- Replaced the conflicting hash-history integration with preact-router’s
  browser history so navigation updates the URL and direct route refreshes use
  the server’s existing SPA fallback correctly.
- Added a root document base so map and tutorial assets resolve correctly after
  refreshing a nested browser-history route.
- Shared the ground-velocity calculation between aircraft movement and the
  projected track vector so wind drift is represented consistently.

## [3.0.0-rc.4] - 2026-07-30

### Added

- Added a What’s new navigation link, a responsive homepage release summary,
  and a consistently styled page containing the complete changelog.
- Added a shared, theme-aware workspace shell for save, aircraft, and operator
  editors, timelapse tools, and individual training modules.
- Added Resume, Save & exit, and Exit without saving actions to the paused
  session dialog.

### Changed

- Rounded homepage actions, navigation controls, cards, saved-session rows, and
  the System, Light, and Dark theme selector.
- Renamed the in-game Pause action to Pause / exit and shared the same save
  operation between the utility control and the exit workflow.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.4.

### Fixed

- Locked the active game route to the visual viewport so homepage and What’s
  new content cannot be reached by vertical scrolling on mobile or desktop.

## [3.0.0-rc.3] - 2026-07-29

### Added

- Added a changelog-driven New Features dialog that appears once for each
  newly deployed source commit and displays the release plus exact build ID.
- Added both an upper-right close control and a full-width Close bar, with
  keyboard focus containment and Escape-key support on desktop.

### Changed

- Embedded the newest changelog release during development and production
  builds so the announcement content and published release metadata share one
  source of truth.
- Made the announcement responsive to phone, tablet, short-landscape, and
  desktop viewports with safe-area spacing, an independently scrollable body,
  a blurred backdrop, and blocked background pointer and touch interaction.
- Persisted the dismissed release-plus-commit identifier in the current
  browser profile, keeping the same build dismissed on later launches while
  automatically showing the next deployed commit.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.3.

### Fixed

- Re-included `CHANGELOG.md` in the Docker and Podman build context so the
  changelog-driven release announcement can be generated inside container
  builds.

## [3.0.0-rc.2] - 2026-07-29

### Added

- Expanded the built-in catalog from 33 to 81 aircraft, including the Boeing
  737-800/900 and MAX variants, 747-8, 777-300ER/F, 787-10, Airbus neo and
  A220 variants, additional regional jets and turboprops, cargo aircraft,
  business jets, and a broader piston and turboprop GA fleet.
- Added or refined the requested ATR 72-600, A380-800, B739, Citation CJ4,
  DA62, and C172 profiles with distinct runway, speed, ceiling, climb,
  acceleration, turn, rarity, wake-class, crosswind, and tailwind
  characteristics.
- Added calculated ground speed and ground track to the aircraft information
  panel.

### Changed

- Rebalanced all 33 legacy aircraft profiles so heavies, narrowbodies,
  regional aircraft, turboprops, and piston aircraft no longer share
  placeholder performance behavior. Existing aircraft IDs remain compatible
  with saved sessions and custom data; new built-ins use IDs 100–147 to avoid
  the legacy editor's custom-aircraft range beginning at 33.
- Made airborne movement respond to the session wind direction and speed using
  the meteorological wind-from convention. Wind influence tapers near field
  elevation to preserve stable runway and ground behavior.
- Made takeoff runway assignment prefer runways within each aircraft's
  crosswind and tailwind limits. Landing decisions now use actual runway wind
  components and explain limit-related go-arounds.
- Updated the aircraft editor schema to accept fractional performance
  multipliers and expose crosswind and tailwind limits.
- Updated application, package, Compose, Make, image, documentation, and build
  metadata to 3.0.0-rc.2.

### Fixed

- Assigned registrations to operator-less IFR and VFR aircraft so business
  and general-aviation traffic no longer falls back to generic flight labels.

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
