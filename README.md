# Task Tracker

A full-stack task management application built with React, Node.js, and MongoDB. This application helps users manage projects and tasks efficiently with features like task status tracking and progress visualization.

## Features

- User authentication (login/register)
- Project management
- Task creation and management
- Task status tracking (Todo, In Progress, Completed)
- Visual progress tracking with charts
- Responsive design
- Real-time notifications

## Live Demo

- Frontend: [https://task-tracker-five-cyan.vercel.app](https://task-tracker-five-cyan.vercel.app)
- Backend API: [https://task-tracker-bfjm.onrender.com](https://task-tracker-bfjm.onrender.com)

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts
- Axios
- React Router DOM

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Mongoose

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd task-tracker
```
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Environment Setup:
Create a .env file in the backend directory:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

# Run backend (from backend directory)
npm run dev

# Run frontend (from root directory)
npm run dev

# API Endpoints
### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
### Projects
- GET /api/projects - Get all projects
- POST /api/projects - Create new project
- GET /api/projects/:id - Get single project
- DELETE /api/projects/:id - Delete project
### Tasks
- GET /api/tasks/project/:projectId - Get project tasks
- POST /api/tasks - Create new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

