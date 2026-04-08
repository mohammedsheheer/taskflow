# TaskFlow - Task Management Application

TaskFlow is a full-stack task management application designed to help users efficiently organize, track, and manage their daily tasks. It provides a clean interface, secure authentication, and a responsive user experience for productivity-focused workflows.

---

## Features

* User Authentication (Login / Register)
* Create, Update, Delete Tasks
* View all tasks in an organized interface
* Task status management
* Fast and responsive UI
* Real-time interaction with backend APIs

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* SQLite (via `sql.js`)

---

## Project Structure

```
taskflow/
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── data/
│   └── server.js
│
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mohammedsheheer/taskflow.git
cd taskflow
```

---

### 2. Setup Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on:
`http://localhost:5000` (or configured port)

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
`http://localhost:5173`

---

## Authentication

TaskFlow includes basic authentication using JWT:

* Users can register and log in
* Protected routes require a valid token

---

## API Overview

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`

### Task Routes

* `GET /api/tasks`
* `POST /api/tasks`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`

---

## Future Enhancements

* Task priority levels
* Due dates & reminders
* Drag-and-drop task organization
* Team collaboration features
* Notifications system

---

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

---