-include .env

ENGINE ?= docker
APP_VERSION ?= 2.5.1
VERSION ?= $(APP_VERSION)
BUILD_COMMIT ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
BUILD_FLAGS ?= --build-arg APP_VERSION=$(VERSION) --build-arg BUILD_COMMIT=$(BUILD_COMMIT)
IMAGE ?= atc-manager:$(VERSION)
PORT ?= 8080
CONTAINER ?= atc-manager

export APP_VERSION BUILD_COMMIT PORT

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
	PORT="$$resolved_port" $(ENGINE) compose up --build -d

compose-down:
	$(ENGINE) compose down
