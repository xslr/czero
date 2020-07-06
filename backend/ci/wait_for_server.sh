#!/usr/bin/env bash

until `curl -sf http://localhost:3000/api/v0 > /dev/null`; do
  echo backend still offline
  sleep 2
done