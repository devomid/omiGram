# omiGram

<p align="center">
  <strong>A full-stack social networking platform built from scratch with React and Node.js.</strong>
</p>

<p align="center">
  A feature-rich social application focused on real-time communication, social interactions, media sharing, location-based posts, and deeply nested discussions.
</p>

---

## 📱 About

**omiGram** is a full-stack social media application designed and developed from scratch as a large-scale personal project.

The project goes far beyond a basic CRUD social network. It combines a traditional social-media experience with **real-time communication**, **media-based posts**, **location-aware content**, and a multi-level interaction system.

Users can create posts, follow other users, interact with content, participate in nested discussions, and communicate with other users through real-time voice and video calls.

The project was built to explore what is involved in designing and implementing a modern social platform across both the frontend and backend.

---

## ✨ Features

### 👤 User & Social Graph

* User registration and authentication
* User profiles
* Follow / unfollow users
* Followers and following relationships
* Personal feed
* Friends/following feed
* User-specific content
* Social interaction between users

---

### 📝 Posts

Users can create and interact with posts.

* Create posts
* View personal posts
* View friends/following feed
* Like posts
* Dislike posts
* Post interactions
* Location-based posts
* Media/content attached to posts
* View individual posts
* User-specific post feeds

---

### 💬 Comments & Discussions

omiGram implements a considerably deeper comment system than a typical social-media application.

Comments can themselves become discussion threads:

```text
Post
 └── Comment
      └── Reply
           └── Reply
                └── Reply
                     └── ...
```

Users can:

* Create comments
* Reply to comments
* Reply to replies
* Create deeply nested discussions
* Like comments
* Dislike comments
* Like replies
* Dislike replies
* Interact with different levels of a discussion independently

This required designing the backend around recursive/nested relationships rather than treating comments as simple flat records.

---

### ❤️ Social Reactions

Interactions are supported across multiple types of content.

* Like posts
* Dislike posts
* Like comments
* Dislike comments
* Like replies
* Dislike replies
* Toggle reactions
* Maintain reaction state between client and server

The application handles these interactions while keeping the UI state synchronized with the backend.

---

### 📞 Real-Time Voice & Video Communication

One of the major components of omiGram is its real-time communication system.

Users can communicate directly through:

* Voice calls
* Video calls
* Real-time connection handling
* Call initiation
* Call acceptance/rejection
* Call termination
* Real-time communication events

The application uses socket-based communication to coordinate real-time events between connected clients.

---

### 💬 Real-Time Communication

Real-time functionality is not limited to calls.

The backend includes a dedicated socket layer for handling real-time application events.

This architecture allows the application to react to events without requiring constant polling from the client.

---

### 📍 Location

Posts can contain location information, allowing content to be associated with a geographical position.

This opens the door for location-aware social experiences rather than treating posts as purely textual/media content.

---

### 📰 Multiple Feed Types

omiGram separates different types of content consumption.

Users can access:

* Personal feed
* Friends/following feed
* User profiles
* Individual posts
* Content belonging to specific users

This requires the backend to build feeds based on relationships rather than simply returning every post.

---

## 🏗️ Architecture

The project is divided into two primary applications:

```text
omiGram
│
├── frontend/
│   ├── React application
│   ├── Components
│   ├── Pages
│   ├── State / UI logic
│   └── Client-side communication
│
└── backend/
    ├── authentication/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── public/
    ├── socket.js
    └── server.js
```

The backend follows a modular structure separating:

* Authentication
* Data models
* Controllers
* HTTP routes
* Middleware
* Real-time communication
* Static/public resources

---

## 🔄 Application Flow

A simplified representation of the application architecture:

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                    HTTP / REST│
                               ▼
                    ┌─────────────────────┐
                    │   Node.js / Express │
                    │       Backend       │
                    └───────┬───────┬─────┘
                            │       │
                       Database   Socket.IO
                            │       │
                            ▼       ▼
                    ┌──────────┐  ┌──────────────┐
                    │ MongoDB  │  │ Real-time    │
                    │          │  │ communication│
                    └──────────┘  └──────┬───────┘
                                         │
                                         ▼
                                  Voice / Video
                                     Calls
```

---

## 🧩 Backend Structure

The backend is organized around several independent responsibilities:

### Authentication

Handles user authentication and authorization.

### Models

Defines the application's data structures and relationships.

The social graph, posts, comments, replies, reactions, and other entities are represented at the database level.

### Controllers

Contains the application/business logic for operations such as:

* User operations
* Post operations
* Comments
* Replies
* Reactions
* Social relationships

### Routes

Provides the HTTP API used by the frontend.

### Middleware

Provides reusable request-processing logic such as authentication and request validation.

### Socket Layer

`socket.js` handles real-time communication between connected users and is a fundamental part of the voice/video communication architecture.

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* HTML5
* CSS
* REST API communication
* Socket-based real-time communication

### Backend

* Node.js
* Express.js
* JavaScript
* REST API
* Socket.IO

### Database

* MongoDB
* Mongoose

### Architecture

* Client / Server architecture
* RESTful API
* Real-time event-driven communication
* Modular backend architecture

---

## 📂 Project Structure

```text
omiGram/
│
├── backend/
│   ├── authentication/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── socket.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── build/
│   ├── package.json
│   └── .env
│
├── README.md
└── license.txt
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB

---

### 1. Clone the repository

```bash
git clone https://github.com/devomid/omiGram.git
cd omiGram
```

---

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Configure the backend environment variables in:

```text
backend/.env
```

Then start the server:

```bash
npm start
```

---

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Configure the frontend environment variables in:

```text
frontend/.env
```

Then start the React application:

```bash
npm start
```

The frontend will run in development mode and communicate with the backend API.

---

## 🔐 Environment Variables

The project uses environment variables for configuration and sensitive information.

Create the appropriate `.env` files for the frontend and backend.

Example:

```env
# Backend

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

```env
# Frontend

REACT_APP_API_URL=http://localhost:5000
```

> Environment variable names may differ depending on the current implementation. Do not commit real credentials or secrets to the repository.

---

## 🧠 What This Project Demonstrates

omiGram was built to explore the engineering challenges involved in developing a **large, interconnected full-stack application**.

The project demonstrates experience with:

* Full-stack JavaScript development
* React application architecture
* Node.js / Express backend development
* MongoDB data modeling
* Mongoose relationships
* REST API design
* Authentication
* Authorization
* Social graph modeling
* Nested data structures
* Recursive comment systems
* Reaction systems
* Feed generation
* Real-time communication
* Socket-based application architecture
* Voice/video communication
* Client/server state synchronization
* Modular backend architecture
* Handling complex user interactions

---

## 🔥 Why omiGram Is Different

A basic social-media clone might contain:

```text
User
 └── Post
      └── Comment
```

omiGram goes considerably further:

```text
User
 ├── Followers
 ├── Following
 ├── Posts
 │    ├── Likes
 │    ├── Dislikes
 │    ├── Comments
 │    │    ├── Replies
 │    │    │    ├── Replies
 │    │    │    └── ...
 │    │    └── Reactions
 │    └── Location
 │
 └── Real-time communication
      ├── Voice calls
      └── Video calls
```

The complexity of the application comes from the interaction between these systems rather than from any individual feature.

---

## 📸 Screenshots

Screenshots of the application are included in the repository.

More screenshots and demonstrations can be added here as the project evolves.

---

## 🚧 Project Status

omiGram is an actively developed project.

The core architecture and major social features have been implemented, while additional improvements, refinements, and features may continue to be added.

---

## 🎯 Future Improvements

Potential areas for future development include:

* Notifications
* Improved feed ranking
* Media optimization
* Pagination and infinite scrolling
* Search and discovery
* Advanced privacy controls
* Improved moderation tools
* Performance optimization
* Automated testing
* Production deployment
* Improved real-time infrastructure
* Mobile client
* Push notifications

---

## 👨‍💻 Author

**Omid**

Full-stack JavaScript developer interested in building complex applications from the ground up.

GitHub: [@devomid](https://github.com/devomid)

---

## 📄 License

This project is licensed under the terms included in the repository's license file.
