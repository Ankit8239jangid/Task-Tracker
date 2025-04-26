# Task Tracker Application

A full-stack task management application with user authentication, project management, and task tracking features.

## Project Overview

Task Tracker is a web application that allows users to:
- Create an account and log in securely
- Create and manage up to 4 projects
- Add, update, and delete tasks within each project
- Track task progress with status updates (Not Started, In Progress, Completed)
- View task statistics and completion progress

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client
- **js-cookie** - Cookie handling
- **React Toastify** - Toast notifications
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling
- **zod** - Input validation
- **cors** - Cross-Origin Resource Sharing

## Project Structure

```
task-tracker/
├── backend/                # Backend API
│   ├── DB/                 # Database connection and models
│   ├── middleware/         # Express middleware
│   ├── router/             # API routes
│   ├── .env                # Environment variables
│   ├── index.js            # Entry point
│   └── package.json        # Dependencies
│
└── Frontend/               # React frontend
    ├── public/             # Static assets
    ├── src/
    │   ├── Components/     # React components
    │   │   ├── Auth/       # Authentication components
    │   │   ├── Common/     # Shared components
    │   │   ├── Dashboard/  # Dashboard components
    │   │   ├── Projects/   # Project components
    │   │   └── Tasks/      # Task components
    │   ├── context/        # React context providers
    │   ├── services/       # API services
    │   ├── App.jsx         # Main component
    │   └── main.jsx        # Entry point
    ├── .env                # Environment variables
    └── package.json        # Dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation and Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

## Features

### Authentication
- User registration with email and password
- Secure login with JWT stored in HTTP-only cookies
- Protected routes requiring authentication
- User profile information

### Project Management
- Create up to 4 projects per user
- View all projects on the dashboard
- Delete projects (with confirmation)
- See task count for each project

### Task Management
- Create tasks with title and description
- Update task details
- Change task status (Not Started, In Progress, Completed)
- Delete tasks (with confirmation)
- View task statistics and progress

## API Documentation

For detailed API documentation, see the [Backend README](./backend/README.md).

## Dependencies

### Backend Dependencies
```json
{
  "bcrypt": "^5.1.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.14.2",
  "mongoose": "^7.0.0",
  "nodemon": "^3.1.9",
  "zod": "^3.24.2"
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "axios": "^1.8.3",
    "js-cookie": "^3.0.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.3.0",
    "react-toastify": "^11.0.5"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "vite": "^6.0.1"
  }
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Input validation with zod
- CORS configuration for API security
- Protected routes on both frontend and backend

## License

This project is licensed under the MIT License.
