# Team Task Manager

A full stack web application for managing teams and tasks collaboratively.

## Live Demo

🔗 [https://honest-tranquility-production-3d3b.up.railway.app](https://honest-tranquility-production-3d3b.up.railway.app)

## Features

- ✅ User registration and login with secure session authentication
- ✅ Create and manage teams
- ✅ Add members to teams via email
- ✅ Create, assign, update and delete tasks
- ✅ Filter tasks by team or status
- ✅ Role-based access (only team creators can delete teams)
- ✅ Responsive UI built with React + Tailwind CSS
- ✅ HTTP-only session cookies for security
- ✅ Passwords hashed with bcrypt (never stored in plain text)
- ✅ Input validation on both frontend and backend

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Authentication | express-session + bcryptjs |
| Validation | Joi |
| Deployment | Railway |

## Project Structure

```
team-task-manager/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # UI components
│       ├── pages/           # Login, Register, Dashboard
│       ├── hooks/           # useAuth, useTeams, useTasks
│       ├── services/        # API calls
│       └── store/           # Auth context
├── server/                  # Express backend
│   ├── config/              # DB and session config
│   ├── controllers/         # Route logic
│   ├── middleware/          # Auth guard, error handler
│   ├── routes/              # API endpoints
│   └── validators/          # Joi validation schemas
└── database/
    └── migrations/          # SQL table definitions
```

## Local Setup Instructions

### Prerequisites

- Node.js v20 or higher
- PostgreSQL installed and running
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/team-task-manager.git
cd team-task-manager
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_manager
SESSION_SECRET=any_long_random_string_here
SESSION_MAX_AGE=86400000
CLIENT_URL=http://localhost:5173
```

### 3. Setup the database

Open pgAdmin or any PostgreSQL client and:

1. Create a new database called `task_manager`
2. Open the Query Tool and run all migration files in order from `database/migrations/`:
   - `001_create_users.sql`
   - `002_create_teams.sql`
   - `003_create_team_members.sql`
   - `004_create_tasks.sql`
   - `005_create_sessions.sql`

Or run them all at once — paste the contents of all 5 files into the Query Tool and press F5.

### 4. Setup the frontend

```bash
cd ../client
npm install
```

### 5. Run the application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Teams — `/api/teams`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/teams` | Get all user's teams | Yes |
| GET | `/api/teams/:id` | Get team + members | Yes |
| POST | `/api/teams` | Create team | Yes |
| POST | `/api/teams/:id/members` | Add member by email | Yes |
| DELETE | `/api/teams/:id` | Delete team (creator only) | Yes |

### Tasks — `/api/tasks`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/tasks` | Get tasks (filter by team/status) | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

## Security

- Passwords are hashed using bcrypt (salt rounds: 12)
- Sessions stored in PostgreSQL with HTTP-only cookies
- All non-auth routes protected by `isAuth` middleware
- Input validation and sanitization using Joi
- CORS configured to allow only the frontend origin

## Deployment

This app is deployed on [Railway](https://railway.app):

- **Backend + Frontend** — Railway App Service (Node.js)
- **Database** — Railway PostgreSQL Service
- The React app is built and served statically by Express in production