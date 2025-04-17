#!/bin/bash

# Ensure we are in the correct project directory
cd ~/Messaging-App || exit 1

# Pull the latest changes from the master branch
echo "Pulling latest changes from master..."
git pull origin master

# Stop and remove only the frontend and backend containers
echo "Stopping and removing frontend and backend containers..."
docker compose stop frontend-service backend-service
docker compose rm -f frontend-service backend-service

# Rebuild and start only the frontend and backend containers
echo "Rebuilding and starting frontend and backend containers..."
docker compose up -d --build frontend-service backend-service

echo "Deployment complete!"