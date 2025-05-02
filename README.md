# Yappatron

This is a messaging app that allows users to connect from across the world.
There is a global chat, allowing all online users to talk with each other
There is also a private chat functionality, allowing users to have 1-to-1 communication

## Running the Application Locally

To run the application locally, follow these steps:

### 1. Backend Setup

**MongoDB Atlas Connection:**
- Open `application.properties` in `messaging.app/src/main/resources`.
- Comment out the following lines:
    ```
    spring.data.mongodb.host=chat-mongodb
    spring.data.mongodb.port=27017
    spring.data.mongodb.database=chatapp
    spring.data.mongodb.username=
    spring.data.mongodb.password=
    adminspring.data.mongodb.authentication-database=admin
    ```
- Uncomment the following line to use the MongoDB Atlas cloud instance:
    ```
    spring.data.mongodb.uri=mongodb+srv://messagingappmanager:JpNQ1hIWOuBfESXO@cluster0.nqzn9.mongodb.net/messaging-app?retryWrites=true&w=majority&appName=Cluster0
    ```

**Start the Backend:**
   - Run the Application.java file found at:  messaging.app/src/main/java/ (using your IDE or with Maven):

### 2. Frontend Setup

**Configure API Endpoint:**
- At path `messaging.app-frontend/src/api` open auth.ts
- Comment out:
    `baseURL: 'https://chat.yappatron.org/api',`
- Uncomment:
    `baseURL: 'http://localhost:8080',`

**Install Dependencies and Start Frontend:**
- Navigate to the frontend directory in a terminal:
    `messaging.app-frontend`
- Install dependencies:
    `npm install`
- Start the development server:
    `npm run dev`
- The frontend will be available at http://localhost:3000

**Note:**  
- Ensure both backend and frontend are running for full functionality.
- If you encounter issues connecting to MongoDB, contact one of the group members.
