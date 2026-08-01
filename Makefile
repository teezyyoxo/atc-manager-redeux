-include .env

ENGINE ?= docker
APP_VERSION := 3.0.0-rc.15
VERSION ?= $(APP_VERSION)
BUILD_COMMIT ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
PREACT_APP_MOBILE_TRAFFIC_FACTOR ?= 0.5
BUILD_FLAGS ?= --build-arg APP_VERSION=$(VERSION) --build-arg BUILD_COMMIT=$(BUILD_COMMIT) --build-arg PREACT_APP_MOBILE_TRAFFIC_FACTOR=$(PREACT_APP_MOBILE_TRAFFIC_FACTOR)
IMAGE ?= atc-manager:$(VERSION)
PORT ?= 8080
CONTAINER ?= atc-manager

export APP_VERSION BUILD_COMMIT PORT PREACT_APP_MOBILE_TRAFFIC_FACTOR

.PHONY: build run run-detached stop rm logs ps compose-up compose-down

build:
	$(ENGINE) build $(BUILD_FLAGS) -t $(IMAGE) .

run: build
	@resolved_port="$$(./scripts/resolve-port.sh none "$(PORT)")"; \
	echo "Publishing ATC Manager on port $$resolved_port"; \
	$(ENGINE) run --pull=never --rm -p "$$resolved_port":80 $(IMAGE)

run-detached: build
	@resolved_port="$$(./scripts/resolve-port.sh none "$(PORT)")"; \
	echo "Publishing ATC Manager on port $$resolved_port"; \
	$(ENGINE) run --pull=never -d --name $(CONTAINER) -p "$$resolved_port":80 --restart unless-stopped $(IMAGE)

stop:
	$(ENGINE) stop $(CONTAINER) || true

rm:
	$(ENGINE) rm $(CONTAINER) || true

logs:
	$(ENGINE) logs -f $(CONTAINER)

ps:
	$(ENGINE) ps --format 'table {{.ID}}\t{{.Names}}\t{{.Ports}}'

compose-up:
	@resolved_port="$$(./scripts/resolve-port.sh "$(ENGINE)" "$(PORT)")"; \
	echo "Publishing ATC Manager on port $$resolved_port"; \
	PORT="$$resolved_port" $(ENGINE) compose up --build -d --force-recreate; \
	actual_binding="$$(PORT="$$resolved_port" $(ENGINE) compose port web 80 2>/dev/null | head -n 1)"; \
	actual_port="$${actual_binding##*:}"; \
	if [ "$$actual_port" != "$$resolved_port" ]; then \
		echo "Port verification failed: requested $$resolved_port, Docker published $${actual_port:-nothing}." >&2; \
		exit 1; \
	fi; \
	echo "Verified: http://localhost:$$actual_port"

compose-down:
	$(ENGINE) compose down
