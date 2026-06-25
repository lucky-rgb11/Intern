 TaskFlow - Task Management Application

A full-stack task management application built with **React** (frontend) and **Express.js** (backend). TaskFlow allows users to create, edit, delete, and track tasks with priority levels and due dates.

## Repository

GitHub: [https://github.com/lucky-rgb11/Intern](https://github.com/lucky-rgb11/Intern)

## Features

- **User Authentication**: Secure signup and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter by status (All, Pending, Completed) and priority (High, Medium, Low)
- **Search**: Search tasks by title or description
- **Progress Tracking**: View completion percentage and task statistics
- **Responsive UI**: Modern, dark-themed interface with Lucide icons

## Tech Stack

### Frontend
- React 19
- React Router v7
- Axios (HTTP client)
- Lucide React (icons)
- React Hot Toast (notifications)
- CSS (custom styling)

### Backend
- Node.js v26.3.1
- Express.js
- MongoDB (with in-memory fallback for development)
- Mongoose (ODM)
- JWT (authentication)
- bcryptjs (password hashing)

## Project Structure

```
Intern/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seedUser.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v26+ with npm
- (Optional) MongoDB running locally or in the cloud

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lucky-rgb11/Intern.git
   cd Intern
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Frontend setup** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### Default Test User

After startup, use these credentials to log in:
- **Email**: `test@taskflow.local`
- **Password**: `Password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create a new task (protected)
- `GET /api/tasks/:id` - Get a single task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)
- `PATCH /api/tasks/:id/toggle` - Toggle task completion (protected)

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Features Implemented

✅ User authentication with JWT  
✅ Task CRUD operations  
✅ Task filtering and search  
✅ Priority levels (High, Medium, Low)  
✅ Due date tracking  
✅ Progress dashboard  
✅ Responsive design  
✅ In-memory MongoDB fallback  

## Development Notes

- The backend includes an in-memory MongoDB fallback (`mongodb-memory-server`) for development without a local MongoDB instance
- All passwords are hashed using bcryptjs before storage
- JWT tokens expire after 7 days
- CORS is enabled with the frontend URL configured

## Future Enhancements

- Task categories/labels
- Recurring tasks
- Task reminders
- User profiles and settings
- Export tasks to PDF/CSV

## License

This project is open source and available under the MIT License.

## Author

Created by: TaskFlow User  
Contact: taskflow@example.com
