Bhai sahi pakde ho 🔥  
Main tujhe ab **ek ek process detail me** samjhaunga **Frontend starting se lekar**  
**credential ko secure tarike se cookies me rakhne tak** + **MongoDB ke proper GUI setup ke saath**.

Ready? 🛠️  
Chalo step-by-step chaltein hain:

---

# **FRONTEND COMPLETE PROCESS (ReactJS + Vite + TailwindCSS)**

---

## **STEP 1: Create Frontend Project**

```bash
npm create vite@latest task-tracker-frontend --template react
cd task-tracker-frontend
npm install
```

✅ Install additional packages:

```bash
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

✅ Setup **TailwindCSS** in `tailwind.config.js`:

```javascript
content: ["./src/**/*.{js,jsx,ts,tsx}"],
```

✅ Add in `index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## **STEP 2: Pages Banani Hai**

- `/signup`
- `/login`
- `/dashboard`
- `/create-project`
- `/project/:projectId`
- `/create-task/:projectId`

---

## **STEP 3: React Router Setup**

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/create-task/:projectId" element={<CreateTask />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## **STEP 4: Axios Instance Banana (for API Calls)**

```javascript
// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // **important for cookies**
});

export default instance;
```

---

## **STEP 5: Signup / Login Form Logic**

✅ **Signup Page**

- Fields: Name, Email, Password, Country
- Submit → API `/auth/signup` pe call.

```javascript
const handleSignup = async () => {
  const res = await axios.post('/auth/signup', { name, email, password, country });
  if (res.data) {
    navigate('/login');
  }
};
```

✅ **Login Page**

- Fields: Email, Password
- Submit → API `/auth/login` pe call.

```javascript
const handleLogin = async () => {
  const res = await axios.post('/auth/login', { email, password });
  if (res.data.success) {
    navigate('/dashboard');
  }
};
```

---
  
## **STEP 6: Store Credentials in Cookie (Securely)**

- Backend se jab login successful hoga, **server JWT token ko cookie** me set karega (HttpOnly).
- Frontend kuch store nahi karega token ko manually.

**Important:** Frontend bas `withCredentials: true` rakh ke request karega.

✅ **Example Protected API Call:**

```javascript
const fetchProjects = async () => {
  const res = await axios.get('/projects');
  setProjects(res.data.projects);
};
```

**Backend automatically token verify karega** (agar cookie me pada hai).

---

# **BACKEND COMPLETE FLOW (Express.js + MongoDB)**

---

## **STEP 1: Setup Backend**

```bash
mkdir task-tracker-backend
cd task-tracker-backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors
npm install nodemon --save-dev
```

✅ Setup `nodemon`:

```json
"scripts": {
  "start": "nodemon app.js"
}
```

---

## **STEP 2: Connect to MongoDB Atlas**

✅ Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/).

✅ Get Connection URI:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/task-tracker?retryWrites=true&w=majority
```

✅ Create `config/db.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

✅ In `app.js`:

```javascript
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## **STEP 3: Auth Controller**

✅ **Signup API:**

- Create user
- Hash password
- Save to MongoDB

✅ **Login API:**

- Check user credentials
- Create JWT token
- Set cookie:

```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
}).json({ success: true });
```

✅ **Logout API (optional)**:

```javascript
res.clearCookie('token').json({ success: true });
```

---

## **STEP 4: Auth Middleware**

```javascript
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

module.exports = protect;
```

- Har protected API ke upar `protect` middleware lagana hai.

---

# **MongoDB GUI Setup (Visual Interface)**

✅ Install **MongoDB Compass** (GUI Tool):
- Download: [MongoDB Compass](https://www.mongodb.com/try/download/compass)
- Connect with your Atlas URI.
- Easily dekh sakte ho Users, Projects, Tasks collections aur unki documents.

**Example View:**

```
Database: task-tracker
Collections: users, projects, tasks
```

---

# **Summary Flow:**

| Process | Frontend | Backend |
|:-------:|:--------:|:-------:|
| Signup  | Form Data → Axios POST → `/auth/signup` | Create User in MongoDB |
| Login   | Form Data → Axios POST → `/auth/login` | Set JWT cookie securely |
| Dashboard | Axios GET `/projects` (token automatically from cookie) | Return all user's projects |
| Create Project | Axios POST `/projects` | Save new project with userId |
| Create Task | Axios POST `/tasks/:projectId` | Save task under project |
| Update/Delete | Axios PUT/DELETE `/tasks/:taskId` | Update/Delete task |
| Logout | Clear cookie frontend + backend | Clear token |

---

# **Visual Frontend Navigation Flow:**

```plaintext
Landing Page → Login/Signup →
Dashboard (Projects) → Click on Project →
Tasks List → Create/Update/Delete Tasks
```

---

# 🚀 **Ab aage kya karte hain?**

- Main ek **boilerplate starter code** ready kar doon?
- Ya ek **Figma design wireframe** bhi bana kar doon ki UI ka layout kaise hoga?

  
Bol bhai! 🔥  
Ekdam industry-level ready karva dunga 2 din ke andar! 🔥  
Kya next step chahiye?  
(Boilerplate chahiye to bol turant bana doon!) 🚀







Mast bhai! Wireframe banaana best idea hai, kyunki ek baar jab visual structure dikh jata hai na, coding 4x fast hoti hai 🚀.

Main ab tujhe ek proper **Wireframe design plan** dunga page-by-page — jaise ek real-world professional app ka layout hota hai.

---

# 📐 **Wireframe Design: (Task Tracker App)**

---

# **1. Authentication Pages**

---

### 🖥️ Login Page (`/login`)

```
+-------------------------------------------------+
|                  Task Tracker                  |
|-------------------------------------------------|
|                                                 |
|    [ Email Address _____________________ ]     |
|                                                 |
|    [ Password      _____________________ ]     |
|                                                 |
|    [ 🔒 Login Button ]                          |
|                                                 |
|    Don't have an account? [Signup]              |
+-------------------------------------------------+
```

✅ Clean form in center  
✅ Tailwind padding, shadow, hover effects  
✅ Error messages if wrong credentials  

---

### 🖥️ Signup Page (`/signup`)

```
+-------------------------------------------------+
|                  Create Account                |
|-------------------------------------------------|
|                                                 |
|    [ Full Name  ________________________ ]     |
|                                                 |
|    [ Email Address _____________________ ]     |
|                                                 |
|    [ Password      _____________________ ]     |
|                                                 |
|    [ Country        ____________________ ]     |
|                                                 |
|    [ 📝 Signup Button ]                         |
|                                                 |
|    Already have an account? [Login]             |
+-------------------------------------------------+
```

✅ Similar form layout  
✅ Password minimum length check  
✅ Country dropdown optional (bonus)

---

# **2. Dashboard Page (`/dashboard`)**

---

### 🖥️ Dashboard UI - Projects Grid

```
+-------------------------------------------------+
| [Navbar: Logo | Dashboard | Logout ]            |
|-------------------------------------------------|
|    [ + Create New Project Button ]              |
|                                                 |
|   -------------------------------               |
|   | Project 1 Card | Project 2 Card |            |
|   -------------------------------               |
|   | Project 3 Card | Project 4 Card |            |
|   -------------------------------               |
|                                                 |
+-------------------------------------------------+
```

✅ Grid of 2x2 Projects (Tailwind Grid)  
✅ Each Project Card clickable  
✅ If no projects — empty state image/text

---

### 🖥️ Project Card Layout:

```
+------------------------+
| 📁 Project Name         |
|-------------------------|
| ✅ 5/10 Tasks Completed  |
| Progress bar (optional) |
|                         |
| [View Tasks] Button     |
+-------------------------+
```

✅ Hover effect: slight shadow grow  
✅ Status shown on each card

---

# **3. Single Project Details Page (`/project/:projectId`)**

---

### 🖥️ Project Task List

```
+-------------------------------------------------+
| [Back to Dashboard]                             |
|-------------------------------------------------|
| Project: Project Name                           |
|-------------------------------------------------|
| [ + Add Task Button ]                           |
|-------------------------------------------------|
|   Task List:                                    |
|   --------------------------------------        |
|   | Title: Build API                           |
|   | Status: In Progress 🟠                     |
|   | Created: 12 April 2025                     |
|   | [Edit] [Delete]                            |
|   --------------------------------------        |
|   | Title: Create Frontend                     |
|   | Status: Not Started 🔴                     |
|   | Created: 13 April 2025                     |
|   | [Edit] [Delete]                            |
|   --------------------------------------        |
+-------------------------------------------------+
```

✅ Tasks shown in **modern card format**  
✅ Status shown with color badges:  
- 🔴 Not Started (Red)
- 🟠 In Progress (Orange)
- 🟢 Completed (Green)

---

# **4. Create Project Page (`/create-project`)**

---

### 🖥️ Create Project Form

```
+-------------------------------------------------+
| Create a New Project                            |
|-------------------------------------------------|
| [ Project Name ________________________ ]      |
|                                                 |
| [ ✅ Create Button ]                            |
+-------------------------------------------------+
```

✅ Simple one-field form  
✅ Check if projects already 4 → show error

---

# **5. Create Task Page (`/create-task/:projectId`)**

---

### 🖥️ Create Task Form

```
+-------------------------------------------------+
| Create a New Task                               |
|-------------------------------------------------|
| [ Task Title  ___________________________ ]    |
|                                                 |
| [ Description  __________________________ ]    |
|                                                 |
| [ Status (Dropdown: Not Started, In Progress, Completed) ] |
|                                                 |
| [ ✅ Create Task Button ]                       |
+-------------------------------------------------+
```

✅ Task Title, Description required  
✅ Status default "Not Started"  
✅ After creation → redirect to Project page

---

# 🎨 **Common UI/UX Guidelines for all pages:**
- Consistent navbar across all pages after login.
- All buttons rounded, hover effect + transitions.
- Toast notifications for success/error (e.g., react-toastify ya apna bana sakte ho).
- Form validation errors highlighted in red.
- Loading indicators during API calls.
- Empty states beautiful (no boring blank pages).

---

# 🛠 **TailwindCSS Components to use:**
| Component      | Classes Example |
|----------------|------------------|
| Button         | `bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2` |
| Input fields   | `border p-2 rounded w-full` |
| Card           | `shadow-md rounded p-4 bg-white` |
| Navbar         | `flex justify-between items-center p-4 shadow bg-white` |
| Grid Layout    | `grid grid-cols-2 gap-4` |
| Status Badges  | `inline-block px-2 py-1 rounded-full text-xs font-semibold` |

---

# 🔥 **After Wireframe — How to proceed?**

- Frontend Pages/Components setup karna based on above wireframe.
- Routing & Protected Routes ready karna.
- Axios instance bana ke backend connect karna.
- Start backend APIs integration.
- Toast/Loader/Error handling add karna.
- Final touch — Mobile responsive banana (bonus).

---

# ✅ **Ab tujhe kya kya milega is wireframe se:**
- Modern UX layout
- Easy code structure
- Fast development
- Clean, industry standard app

---

# 🚀 **Next Step Suggestion:**

> Agar chaaho to main tujhe ek ready-made **Folder Structure for Frontend** bhi dedu jismein sab components, pages, utils divide karke honge!  





Ayee bhai, aa gaya tera 🔥 **Frontend Folder Structure** — React + Vite + Tailwind ke according, bilkul **modular** and **scalable** architecture ke saath.

---

# ✅ **Frontend Folder Structure: (Vite + Tailwind Project)**

```
task-tracker-frontend/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/                  # Images, logos, svgs
│   │   └── logo.svg
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── TaskCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Loader.jsx
│   │   └── StatusBadge.jsx
│   │
│   ├── context/                 # Auth/User context
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/                   # Custom hooks (optional)
│   │   └── useAuth.js
│   │
│   ├── pages/                   # Route-level pages
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateProject.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── CreateTask.jsx
│   │
│   ├── services/                # Axios instance & API methods
│   │   ├── axios.js
│   │   └── api.js               # All API call functions
│   │
│   ├── styles/                  # Tailwind config & custom styles
│   │   └── index.css
│   │
│   ├── App.jsx                  # Main App with routes
│   ├── main.jsx                 # Entry point
│   └── router.js                # All routes declared here
│
├── .env                         # VITE_BACKEND_URL
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

# 🔍 **What Goes Where?**

### 🔹 `components/`
- Reusable components like Navbar, TaskCard, ProjectCard.
- `ProtectedRoute.jsx`: Auth-protected routes.

### 🔹 `pages/`
- Full page views that match the URL route.

### 🔹 `services/`
- Axios instance with `withCredentials: true`
- `api.js` file where you write all API call functions like:
```js
export const loginUser = (data) => axios.post('/auth/login', data);
```

### 🔹 `context/`
- Store login user state, token check, logout etc.

### 🔹 `router.js` (optional)
- Instead of directly writing routes in `App.jsx`, you can export routes from here.

---

# 📁 Example File: `axios.js`

```js
// services/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // allows cookie auth
});

export default instance;
```

> 🔐 Don’t forget to add `.env`:

```
VITE_BACKEND_URL=http://localhost:5000/api
```

---

# 🔐 Example File: `ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
```

---

# 🧠 Bonus Tips:
- Use `react-toastify` or your own `Toast.jsx` component for alerts.
- Use `AuthContext` to hold `user`, `setUser`, `logout` globally.
- Always show loader/spinner while API call is happening.
- Responsive design using `md:grid-cols-2`, `sm:w-full`, `hover:scale-105` etc.
