IMAGE ?= atc-manager
PORT ?= 8080
CONTAINER ?= atc-manager

.PHONY: build run run-detached stop rm logs ps compose-up compose-down

build:
	docker build -t $(IMAGE) .

run: build
	docker run --rm -p $(PORT):80 $(IMAGE)

run-detached: build
	docker run -d --name $(CONTAINER) -p $(PORT):80 --restart unless-stopped $(IMAGE)

stop:
	docker stop $(CONTAINER) || true

rm:
	docker rm $(CONTAINER) || true

logs:
	docker logs -f $(CONTAINER)

ps:
	docker ps --format 'table {{.ID}}\t{{.Names}}\t{{.Ports}}'

compose-up:
	docker-compose up --build -d

compose-down:
	docker-compose down
