ENGINE ?= docker
VERSION ?= 2.5.1
BUILD_FLAGS ?= --build-arg APP_VERSION=$(VERSION)
IMAGE ?= atc-manager:$(VERSION)
PORT ?= 8080
CONTAINER ?= atc-manager

.PHONY: build run run-detached stop rm logs ps compose-up compose-down

build:
	$(ENGINE) build $(BUILD_FLAGS) -t $(IMAGE) .

run: build
	$(ENGINE) run --pull=never --rm -p $(PORT):80 $(IMAGE)

run-detached: build
	$(ENGINE) run --pull=never -d --name $(CONTAINER) -p $(PORT):80 --restart unless-stopped $(IMAGE)

stop:
	$(ENGINE) stop $(CONTAINER) || true

rm:
	$(ENGINE) rm $(CONTAINER) || true

logs:
	$(ENGINE) logs -f $(CONTAINER)

ps:
	$(ENGINE) ps --format 'table {{.ID}}\t{{.Names}}\t{{.Ports}}'

compose-up:
	$(ENGINE) compose up --build -d

compose-down:
	$(ENGINE) compose down
