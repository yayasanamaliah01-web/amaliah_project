#!/usr/bin/env bash
set -euo pipefail

CONTAINER="amaliah-garage"
BUCKET="${S3_BUCKET:-amaliah-uploads}"
KEY_NAME="amaliah-app-key"

echo ">>> Waiting for Garage container to be ready..."
sleep 3

NODE_ID=$(docker exec "$CONTAINER" /garage node id -q | tr -d '\r\n' | cut -d'@' -f1)
echo ">>> Garage Node ID: $NODE_ID"

if docker exec "$CONTAINER" /garage status | grep -q "NO ROLE ASSIGNED"; then
  echo ">>> Assigning single-node layout (zone=dc1, capacity=20G)..."
  docker exec "$CONTAINER" /garage layout assign -z dc1 -c 20G "$NODE_ID"
  docker exec "$CONTAINER" /garage layout apply --version 1
else
  echo ">>> Garage layout already configured."
fi

echo ">>> Ensuring bucket '$BUCKET' exists with website access..."
docker exec "$CONTAINER" /garage bucket create "$BUCKET" >/dev/null 2>&1 || true
docker exec "$CONTAINER" /garage bucket website --allow "$BUCKET"

echo ">>> Ensuring S3 access key '$KEY_NAME' exists..."
if docker exec "$CONTAINER" /garage key info "$KEY_NAME" >/dev/null 2>&1; then
  echo ">>> Key '$KEY_NAME' already exists:"
  docker exec "$CONTAINER" /garage key info "$KEY_NAME" --show-secret
else
  docker exec "$CONTAINER" /garage key create "$KEY_NAME"
fi

docker exec "$CONTAINER" /garage bucket allow --read --write --owner "$BUCKET" --key "$KEY_NAME"
echo ">>> Garage S3 initialization complete!"
