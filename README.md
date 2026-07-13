# 🚀 WorkZen – Task Management System

WorkZen is a full-stack task management web application built using **Spring Boot, React, MySQL, and JWT Authentication**. It helps users organize their daily tasks with secure authentication, task management, search, filtering, pagination, and a clean modern interface.

🌐 **Live Demo:** https://work-nnsmief74-ashritha12.vercel.app

---

# ✨ Features

- 🔐 Secure user registration and login using JWT Authentication
- ✅ Create, update, delete, and mark tasks as completed
- 📅 Set task priorities and optional due dates
- 🔍 Search tasks by keyword
- 🎯 Filter tasks by status and priority
- 📄 Pagination and sorting support
- 🌙 Light/Dark mode
- 🔒 Server-side task ownership validation
- 📱 Responsive UI for desktop and mobile

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios
- React Bootstrap
- React Toastify

## Backend

- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT Authentication
- MySQL

## Deployment

- Frontend: Vercel
- Backend: Railway

---

# 📂 Project Structure

```
Task-Management-System-master/
│
├── src/main/java/taskmanagementsystem/      # Spring Boot Backend
├── src/main/resources/                      # Configuration files
├── frontend/Task-Management-System/         # React Frontend
├── pom.xml
└── README.md
```

---

# 🚀 Running Locally

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd Task-Management-System-master
```

---

## 2. Create MySQL Database

```sql
CREATE DATABASE task_management_system_db;
```

---

## 3. Start Backend

```bash
mvn spring-boot:run
```

Backend runs on

```
http://localhost:8080
```

Swagger:

```
http://localhost:8080/swagger-ui.html
```

---

## 4. Start Frontend

```bash
cd frontend/Task-Management-System

npm install

npm run dev
```

Frontend runs on

```
http://localhost:3000
```

---

# 🌐 Deployment

## Frontend

- Vercel

## Backend

- Railway

Environment Variable

```
VITE_API_BASE_URL=https://your-backend-url.up.railway.app
```

---

# 🔐 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/v1/tasks` | Get all tasks |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/{id}` | Get task |
| PUT | `/api/v1/tasks/{id}` | Update task |
| DELETE | `/api/v1/tasks/{id}` | Delete task |
| PATCH | `/api/v1/tasks/{id}/task-done` | Mark task completed |
| PATCH | `/api/v1/tasks/{id}/task-pending` | Mark task pending |

---

# 🔒 Security

- Passwords encrypted using BCrypt
- Stateless JWT Authentication
- Protected REST APIs
- User-specific task ownership validation
- Spring Security authorization

---

# 📸 Screenshots

> *(Add screenshots here after capturing your application.)*

Suggested screenshots:

- Login Page
- Register Page
- Dashboard
- Create Task
- Edit Task
- Completed Task
- Dark Mode

---

# 📈 Future Improvements

- Notifications & reminders
- Task categories
- File attachments
- Team collaboration
- Calendar integration
- Drag & Drop Kanban board

---

# 👩‍💻 Author

**Ashritha**

Computer Science Engineering (Data Science)

SJBIT, Bengaluru

GitHub: https://github.com/V-Ashritha1

---

## ⭐ If you like this project, consider giving it a star!
