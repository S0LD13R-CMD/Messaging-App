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

# Wait a moment for containers to fully start
echo "Waiting for containers to start..."
sleep 5

# Fix Nginx configuration for frontend SPA routing
echo "Configuring Nginx for SPA routing..."
docker exec chat-frontend bash -c "cat > /etc/nginx/conf.d/app.conf << 'EOL'
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend-service:8080/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Origin \$http_origin;
        proxy_cookie_path / /;
    }
}
EOL
mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true
nginx -s reload"

echo "Deployment complete!"