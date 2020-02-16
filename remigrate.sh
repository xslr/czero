#!/bin/sh

docker container start db
docker container start dbadminer
npx knex migrate:rollback && npx knex migrate:latest

