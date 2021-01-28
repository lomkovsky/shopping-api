#!/usr/bin/env sh

set -e

PROJECT_NAME='shopping-api'
COMPOSE_FILE='docker-compose.yml'

    docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE kill
    docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE rm -f
    docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE pull
    docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE up --build -d