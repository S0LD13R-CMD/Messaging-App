#!/bin/bash

# Ensure we are in the correct project directory
cd ~/Messaging-App || exit 1

# Stash any local changes before pulling
echo "Stashing any local changes..."
git stash

# Pull the latest changes from the master branch
echo "Pulling latest changes from master..."
git pull origin master || {
    echo "Git pull failed, attempting to abort any merge and reset to origin/master..."
    git merge --abort
    git reset --hard origin/master
}

# Stop and remove containers
echo "Stopping and removing old containers..."
docker compose down --remove-orphans

# Remove MongoDB volume to start fresh
echo "Removing MongoDB volume..."
docker volume rm messaging-app_mongo-data || true

# Rebuild and start only MongoDB first
echo "Starting MongoDB container first..."
docker compose up -d --build mongodb

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
sleep 10

# Set up MongoDB user automatically
echo "Setting up MongoDB user..."
docker exec -i chat-mongodb mongosh --eval "
  try {
    db.getSiblingDB('admin').createUser({
      user: 'mongouser',
      pwd: 'mongopass',
      roles: [{ role: 'root', db: 'admin' }]
    });
    print('MongoDB user created successfully');
  } catch (e) {
    print('User might already exist, continuing...');
  }
"

# Start other services
echo "Starting remaining services..."
docker compose up -d --build

# Wait a moment for containers to fully start
echo "Waiting for containers to start..."
sleep 10

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
        # Handle OPTIONS preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Max-Age' '1728000';
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain';
            return 204;
        }
        
        # Adding CORS headers for all responses
        add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
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
nginx -s reload"

# Verify MongoDB connection
echo "Verifying MongoDB connection..."
docker exec -i chat-mongodb mongosh -u mongouser -p mongopass --authenticationDatabase admin --eval "db.adminCommand('ping')"

echo "Deployment complete!"