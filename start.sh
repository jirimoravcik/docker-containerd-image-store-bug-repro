#!/bin/bash

docker pull mongo:8.0.16

# Due to this image sharing layers with the previous one, this image will become "corrupted".
docker pull ubuntu/squid:latest

# At this point `docker image inspect ubuntu/squid:latest` would return a malformed response. This was fixed in Docker 29.1.2.
# See https://github.com/moby/moby/pull/51629

# Start a registry so we have a place to push the built image
echo "Starting registry:2 inside dind..."
docker run -d --name registry -p 5678:5000 registry:2

echo "Starting build and push script..."
node main.js
