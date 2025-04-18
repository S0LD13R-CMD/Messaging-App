#!/bin/bash

# Ensure we are in the correct project directory
cd ~/Messaging-App || exit 1

# Pull the latest changes from the master branch
echo "Pulling latest changes from master..."
git pull origin master

# Stop and remove only the frontend and backend containers
echo "Stopping and removing old containers..."
docker compose down --remove-orphans

# Rebuild and start only the frontend and backend containers
echo "Rebuilding and starting containers..."
docker compose up -d --build

echo "Deployment complete!"