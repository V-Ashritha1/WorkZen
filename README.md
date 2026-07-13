# Task Management Web Application

A full-stack task management app — Spring Boot + React + MySQL — with JWT authentication,
server-side ownership checks, search/filter/pagination, and a modern UI.

**Live demo:** _add your deployed link here once live_

## Features

- Register / log in with JWT-based, stateless authentication
- Create, edit, delete, and complete tasks, each with a priority and optional due date
- Search, filter by priority/status, sort, and paginate your task list
- Ownership enforced server-side — a task can only be read/edited/deleted by the user who owns it
- API documented with Swagger UI (`/swagger-ui.html`)
- Light/dark mode

## Tech stack

**Backend:** Java 17, Spring Boot 3, Spring Security, Spring Data JPA, MySQL, JWT (JJWT), springdoc-openapi
**Frontend:** React, Vite, React Router, React Bootstrap, Axios, React Toastify

## Project structure

```
Task-Management-System-master/
├── src/main/java/taskmanagementsystem/   # Spring Boot backend
├── frontend/Task-Management-System/      # React + Vite frontend
├── Dockerfile                            # Backend container build (used by Render)
├── render.yaml                           # Render Blueprint
└── .env.example                          # Backend env vars reference
```

## Running locally

### 1. Database
Create the database — the app creates/updates tables automatically on startup:
```sql
CREATE DATABASE task_management_system_db;
```

### 2. Backend
```bash
cd Task-Management-System-master
./mvnw clean spring-boot:run
```
Runs on `http://localhost:8080` by default. No `.env` file is required locally —
`application.properties` already defaults to `root` / `1234` / `localhost:3306`. If your
MySQL credentials differ, either update `application.properties` directly or export the
env vars listed in `.env.example`.

Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend
```bash
cd frontend/Task-Management-System
npm install
npm run dev
```
Runs on `http://localhost:3000` and talks to `http://localhost:8080` by default — no `.env`
needed locally either.

Default seeded accounts: `admin` / `admin` and `user` / `user`.

## Deploying it publicly

The app is split into two deployments: the **backend** (Render, as a Docker web service) and
the **frontend** (Vercel). You'll also need a publicly reachable MySQL database — Render's
own MySQL isn't available on the free tier, so use a free external one such as
[Aiven](https://aiven.io/mysql), [Railway](https://railway.app), or Clever Cloud.

### Step 1 — Get a MySQL database
Spin one up on any provider above and note down the host, port, database name, username, and
password. You'll need them as `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` in the next step.
`DB_URL` format: `jdbc:mysql://<host>:<port>/<database>`.

### Step 2 — Deploy the backend on Render
1. Push this project to a GitHub repo.
2. On Render: **New → Web Service** → connect your repo.
3. Runtime: **Docker** (Render will detect the `Dockerfile` automatically).
4. Under **Environment**, add:

   | Key | Value |
   |---|---|
   | `DB_URL` | your MySQL connection string |
   | `DB_USERNAME` | your MySQL username |
   | `DB_PASSWORD` | your MySQL password |
   | `JWT_SECRET` | a long random string — generate with `openssl rand -base64 32` |
   | `CORS_ALLOWED_ORIGINS` | your Vercel URL (add after step 3 — see below) |

5. Health check path: `/health`.
6. Deploy. Render gives you a URL like `https://task-management-backend.onrender.com`.

   (Alternatively, `render.yaml` in this repo is a Render **Blueprint** — "New → Blueprint" and
   point it at this repo does steps 3–5 for you; you'll still fill in the env var values.)

### Step 3 — Deploy the frontend on Vercel
1. On Vercel: **Add New → Project** → import the same GitHub repo.
2. **Root Directory:** `frontend/Task-Management-System` (important — the repo root is the backend).
3. Framework preset: Vite (auto-detected).
4. Add an environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | your Render backend URL from Step 2, e.g. `https://task-management-backend.onrender.com` |

5. Deploy. Vercel gives you a URL like `https://your-app.vercel.app`.

### Step 4 — Close the loop on CORS
Go back to Render → your backend service → Environment → set `CORS_ALLOWED_ORIGINS` to your
Vercel URL from Step 3 (e.g. `https://your-app.vercel.app`), then redeploy the backend so the
change takes effect. Without this step the frontend can load, but every API call will fail
with a CORS error.

### Notes on the free tiers
- Render's free web services spin down after 15 minutes of inactivity — the first request
  after idling can take 30–50 seconds while it wakes up. This is normal, not a bug.
- `spring.jpa.hibernate.ddl-auto=update` means the schema is created automatically on first
  boot against your production database — no manual migration step needed for a demo project.

## API overview

All `/api/v1/**` routes require `Authorization: Bearer <token>` (obtained from `/api/auth/login`).
Full interactive docs are at `/swagger-ui.html`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/v1/tasks` | List your tasks — supports `?keyword=&priority=&completed=&page=&size=&sortBy=&direction=` |
| POST | `/api/v1/tasks` | Create a task |
| GET | `/api/v1/tasks/{id}` | Get a task (must be yours) |
| PUT | `/api/v1/tasks/{id}` | Update a task (must be yours) |
| DELETE | `/api/v1/tasks/{id}` | Delete a task (must be yours) |
| PATCH | `/api/v1/tasks/{id}/task-done` | Mark complete |
| PATCH | `/api/v1/tasks/{id}/task-pending` | Mark incomplete |
| GET | `/health` | Health check (public) |

## Security notes

- Passwords are hashed with BCrypt; never stored or logged in plain text.
- Authentication is stateless JWT — no server-side session.
- Every task read/write is checked against the requester's id from the verified token, not
  from the URL or request body, closing an IDOR vulnerability present in the original base
  project (any authenticated user could otherwise read/edit/delete any other user's tasks by
  guessing an id).
