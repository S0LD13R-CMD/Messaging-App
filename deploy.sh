#!/bin/bash

# Ensure we are in the correct project directory
cd ~/Messaging-App || exit 1

# Stash any local changes before pulling
echo "Stashing any local changes..."
git stash

# Pull the latest changes from the master branch
echo "Pulling latest changes from master..."
git fetch --all  # Fetch all updates from all remotes
git reset --hard origin/master  # Reset to the latest state of origin/master

# Stop containers but keep volumes
echo "Stopping containers..."
docker compose down --remove-orphans

# Check if MongoDB is already set up
echo "Checking if MongoDB data exists..."
if [ ! "$(docker volume ls -q -f name=messaging-app_mongo-data)" ] || [ "$(docker volume ls -q -f name=messaging-app_mongo-data)" = "" ]; then
  # Only create MongoDB setup if volume doesn't exist
  echo "MongoDB volume not found. Setting up new database..."
  
  # Start MongoDB without authentication first
  echo "Creating temporary MongoDB container..."
  docker run --name temp-mongodb -d -p 27017:27017 mongo:6.0
  
  # Wait for MongoDB to be ready
  echo "Waiting for MongoDB to start..."
  sleep 10
  
  # Create admin user
  echo "Setting up MongoDB user..."
  docker exec -i temp-mongodb mongosh --eval "
    use admin;
    db.createUser({
      user: 'mongouser',
      pwd: 'mongopass',
      roles: [{ role: 'root', db: 'admin' }]
    });
    use chatapp;
    db.createCollection('users');
  "
  
  # Stop and remove temporary MongoDB container
  echo "Cleaning up temporary MongoDB container..."
  docker stop temp-mongodb
  docker rm temp-mongodb
else
  echo "MongoDB volume exists. Using existing database."
fi

# Generate a custom docker-compose.yml with correct MongoDB credentials
echo "Creating docker-compose.yml with MongoDB credentials..."
cat > docker-compose.yml << EOL
services:
  backend-service:
    build: 
      context: ./messaging.app
      dockerfile: Dockerfile.prod
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongouser:mongopass@chat-mongodb:27017/chatapp?authSource=admin
    networks:
      - chatnet

  frontend-service:
    build: 
      context: ./messaging.app-frontend
      dockerfile: Dockerfile.prod
    container_name: chat-frontend
    ports:
      - "8080:80"
    networks:
      - chatnet
    depends_on:
      - backend-service

  mongodb:
    image: mongo:6.0
    container_name: chat-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: mongouser
      MONGO_INITDB_ROOT_PASSWORD: mongopass
    networks:
      - chatnet

volumes:
  mongo-data:

networks:
  chatnet:
EOL

# Start all services
echo "Starting all services..."
docker compose up -d --build

# Wait for services to fully start
echo "Waiting for services to start..."
sleep 10

# Replace all Nginx configuration to avoid conflicts
echo "Configuring Nginx..."
docker exec chat-frontend bash -c "rm -f /etc/nginx/conf.d/*.conf && cat > /etc/nginx/conf.d/default.conf << 'EOL'
server {
    listen 80;
    server_name api.yappatron.org;
    
    location / {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' '1728000' always;
            add_header 'Content-Type' 'text/plain' always;
            add_header 'Content-Length' '0' always;
            return 204;
        }
        
        proxy_pass http://backend-service:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Origin \$http_origin;
        
        add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
    
    # Add WebSocket configuration
    location /ws {
        proxy_pass http://backend-service:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Add CORS headers for WebSocket
        add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
}

server {
    listen 80 default_server;
    server_name _;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
    }
    
    # Add WebSocket configuration
    location /api/ws {
        proxy_pass http://backend-service:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Add CORS headers for WebSocket
        add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
    
    location /api/ {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' '1728000' always;
            add_header 'Content-Type' 'text/plain' always;
            add_header 'Content-Length' '0' always;
            return 204;
        }
        
        proxy_pass http://backend-service:8080/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Origin \$http_origin;
        proxy_cookie_path / /;
        
        add_header 'Access-Control-Allow-Origin' 'https://chat.yappatron.org' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, Accept, Origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
}
EOL
nginx -s reload"

# Verify services
echo "Verifying services..."
echo "MongoDB connection test:"
docker exec -i chat-mongodb mongosh -u mongouser -p mongopass --authenticationDatabase admin --eval "db.adminCommand('ping')" || echo "MongoDB verification failed but continuing..."

# Update the auth.ts file
echo "Updating frontend API configuration..."
cat > messaging.app-frontend/src/api/auth.ts << EOL
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chat.yappatron.org/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
EOL

echo "Deployment complete!"