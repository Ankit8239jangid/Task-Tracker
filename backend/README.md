# Task Tracker API

This is the backend API for the Task Tracker application. It provides endpoints for user authentication, project management, and task tracking.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling
- **zod** - Input validation
- **cors** - Cross-Origin Resource Sharing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### Register a new user
- **URL**: `/api/v1/auth/signup`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstname": "John",
    "lastname": "Doe",
    "country": "USA"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "country": "USA"
    },
    "token": "jwt_token"
  }
  ```

#### Login
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Logged in successfully",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "country": "USA"
    },
    "token": "jwt_token"
  }
  ```

#### Logout
- **URL**: `/api/v1/auth/logout`
- **Method**: `POST`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get Current User
- **URL**: `/api/v1/auth/me`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstname": "John",
      "lastname": "Doe",
      "country": "USA"
    }
  }
  ```

### Projects

#### Create a Project
- **URL**: `/api/v1/projects`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "title": "Project Title"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Project created successfully",
    "project": {
      "id": "project_id",
      "title": "Project Title",
      "createdAt": "timestamp"
    }
  }
  ```
- **Note**: Users are limited to a maximum of 4 projects.

#### Get All Projects
- **URL**: `/api/v1/projects`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  [
    {
      "_id": "project_id",
      "title": "Project Title",
      "user": "user_id",
      "tasks": ["task_id1", "task_id2"],
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

#### Get Project by ID
- **URL**: `/api/v1/projects/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Parameters**: `id=[string]` where `id` is the ID of the project
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "project_id",
    "title": "Project Title",
    "user": "user_id",
    "tasks": ["task_id1", "task_id2"],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

#### Delete Project
- **URL**: `/api/v1/projects/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `id=[string]` where `id` is the ID of the project
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Project deleted successfully"
  }
  ```

### Tasks

#### Create a Task
- **URL**: `/api/v1/tasks`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "projectId": "project_id"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Task created successfully",
    "task": {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task Description",
      "project": "project_id",
      "status": "Not Started",
      "createdAt": "timestamp"
    }
  }
  ```

#### Get All Tasks for a Project
- **URL**: `/api/v1/tasks/:projectId`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Parameters**: `projectId=[string]` where `projectId` is the ID of the project
- **Success Response**: `200 OK`
  ```json
  [
    {
      "_id": "task_id",
      "title": "Task Title",
      "description": "Task Description",
      "project": "project_id",
      "status": "Not Started",
      "createdAt": "timestamp",
      "completedAt": null
    }
  ]
  ```

#### Update Task
- **URL**: `/api/v1/tasks/:taskId`
- **Method**: `PUT`
- **Auth required**: Yes
- **URL Parameters**: `taskId=[string]` where `taskId` is the ID of the task
- **Body**:
  ```json
  {
    "title": "Updated Task Title",
    "description": "Updated Task Description",
    "status": "In Progress"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Task updated successfully",
    "task": {
      "_id": "task_id",
      "title": "Updated Task Title",
      "description": "Updated Task Description",
      "project": "project_id",
      "status": "In Progress",
      "createdAt": "timestamp",
      "completedAt": null
    }
  }
  ```
- **Note**: Task status can be one of: "Not Started", "In Progress", "Completed"

#### Delete Task
- **URL**: `/api/v1/tasks/:taskId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **URL Parameters**: `taskId=[string]` where `taskId` is the ID of the task
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. When a user logs in or signs up, a token is generated and stored in an HTTP-only cookie. This token is automatically sent with subsequent requests and verified by the server.

To access protected routes, the client must include the token either in:
1. The `Cookie` header (automatically handled by browsers)
2. The `Authorization` header in the format: `Bearer <token>`

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required or invalid credentials
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

## Data Models

### User
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `firstname` (String, required)
- `lastname` (String, required)
- `country` (String, required)
- `projects` (Array of Project references)
- `timestamps` (createdAt, updatedAt)

### Project
- `user` (Reference to User, required)
- `title` (String, required)
- `tasks` (Array of Task references)
- `timestamps` (createdAt, updatedAt)

### Task
- `project` (Reference to Project, required)
- `title` (String, required)
- `description` (String, required)
- `status` (String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started")
- `createdAt` (Date, default: current date)
- `completedAt` (Date, optional)
