# FormFlow

**FormFlow** is a modern, production-quality form builder inspired by Typeform. It delivers a beautiful one-question-at-a-time public form experience, a drag-and-drop builder, a real-time dashboard, and a fully typed REST API — all out of the box.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Backend Overview](#backend-overview)
- [Frontend Overview](#frontend-overview)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Database Initialization](#database-initialization)
- [Future Improvements](#future-improvements)

---

## Project Overview

FormFlow lets teams build beautiful, conversational forms without code. Forms are built visually in the builder, published with one click, and filled out by respondents through a distraction-free, animated, one-question-at-a-time experience. All data — forms, questions, responses, and answers — is persisted in a relational database and exposed via a versioned REST API.

---

## Features

| Feature |
|---|---|
| Modern Dashboard with real-time stats | 
| Form Builder with live question editing |
| Drag-and-drop question reordering | 
| Public one-question-at-a-time form experience | 
| Live Preview from the builder | 
| Save Draft | 
| Publish Form | 
| Duplicate Form | 
| Delete Form | 
| Dashboard search / filter |
| FastAPI backend | 
| SQLite database (auto-created) | 
| Full Forms CRUD API | 
| Response Submission API | 
| Real response counts on dashboard | 
| Real updated timestamps on dashboard | 
| React Query for server state | 
| Zustand for builder UI state | 
| Fully typed TypeScript frontend | 
| Tailwind CSS v4 styling | 
| shadcn/ui component library | 
| Responsive design | 

---

## Screenshots

> _Screenshots coming soon. Run the app locally to see the full experience._

| Dashboard | Form Builder | Public Form |
|---|---|---|
| _(placeholder)_ | _(placeholder)_ | _(placeholder)_ |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [React 19](https://react.dev) | UI rendering |
| [TypeScript 5](https://typescriptlang.org) | Static typing |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | Accessible component primitives |
| [Framer Motion](https://www.framer.com/motion/) | Animations and transitions |
| [TanStack React Query v5](https://tanstack.com/query) | Server state & data fetching |
| [Zustand v5](https://zustand-demo.pmnd.rs/) | Builder UI local state |
| [@dnd-kit](https://dndkit.com/) | Drag-and-drop question reordering |
| [Axios](https://axios-http.com/) | HTTP client |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework |
| [SQLModel](https://sqlmodel.tiangolo.com/) | ORM (SQLAlchemy + Pydantic) |
| [SQLite](https://sqlite.org/) | Embedded relational database |
| [Pydantic v2](https://docs.pydantic.dev/) | Schema validation and serialization |
| [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) | Environment variable configuration |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |

---

## Architecture

```
Browser
  │
  ▼
Next.js 16 (App Router)
  │  React Query (server state)
  │  Zustand (builder UI state)
  │  Axios → /api/*
  ▼
FastAPI (Uvicorn)
  │  Routers → Services → SQLModel ORM
  ▼
SQLite (formflow.db)
```

**Data flow:**
1. The frontend fetches all forms on dashboard load via `GET /api/forms` (React Query).
2. The builder reads/writes form data via `PATCH /api/forms/{id}` (Save Draft) or `POST /api/forms/{id}/publish` (Publish).
3. Public respondents submit answers via `POST /api/responses`.
4. The dashboard displays real `response_count` and `updated_at` returned from the backend — no mocked values.

---

## Folder Structure

```
typeform-clone/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/              # Route handlers
│   │   │   ├── forms.py
│   │   │   └── responses.py
│   │   ├── core/             # App config (Pydantic Settings)
│   │   ├── database/         # Session factory and DB init
│   │   ├── models/           # SQLModel ORM table models
│   │   │   ├── form.py
│   │   │   ├── question.py
│   │   │   ├── response.py
│   │   │   └── answer.py
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   │   ├── form.py
│   │   │   └── response.py
│   │   ├── services/         # Business logic layer
│   │   │   ├── form_service.py
│   │   │   └── response_service.py
│   │   └── main.py           # FastAPI app factory & middleware
│   ├── main.py               # Uvicorn entry point
│   ├── requirements.txt
│   └── formflow.db           # SQLite DB (auto-created)
│
└── frontend/                 # Next.js application
    ├── app/
    │   ├── (dashboard)/
    │   │   ├── dashboard/    # Main dashboard page
    │   │   └── forms/new/    # Form builder page
    │   └── f/[id]/           # Public form experience
    ├── components/
    │   ├── builder/          # Builder UI components
    │   ├── dashboard/        # Dashboard card components
    │   ├── layout/           # Sidebar, nav
    │   ├── runtime/          # Public form experience
    │   └── ui/               # shadcn/ui primitives
    ├── hooks/                # React Query hooks
    ├── lib/
    │   ├── api/              # Axios API client & endpoint functions
    │   └── utils.ts
    ├── providers/            # React Query provider
    ├── store/                # Zustand builder store
    └── types/
        └── form.ts           # Single source of truth for all frontend types
```

---

## Backend Overview

The backend follows a **layered architecture**:

- **Routers** (`app/api/`) — thin HTTP handlers. Delegate all logic to services.
- **Services** (`app/services/`) — business logic, DB queries, data validation.
- **Models** (`app/models/`) — SQLModel table definitions with ORM relationships.
- **Schemas** (`app/schemas/`) — Pydantic models for request validation and response serialization.

All read endpoints eagerly load related data (`selectinload`) to avoid N+1 queries. The `response_count` field on every form is computed server-side as `len(form.responses)` before serialization.

---

## Frontend Overview

The frontend is a **Next.js 16 App Router** application:

- **Server state** is managed by **React Query**. All API calls are in `lib/api/`. Mutations automatically invalidate the relevant queries on success.
- **Builder UI state** is managed by **Zustand**. The builder store holds the current form being edited (title, questions, status) and syncs to the backend on Save Draft or Publish.
- **`types/form.ts`** is the **single source of truth** for all frontend type definitions. The API layer maps raw snake_case API DTOs into these camelCase frontend models via `mapForm()`.

---

## Database

FormFlow uses **SQLite** via SQLModel (SQLAlchemy). The database file `formflow.db` is created automatically at startup.

### Schema (simplified)

```
Form
  id          UUID (PK)
  title       TEXT
  description TEXT
  status      TEXT  ("draft" | "published")
  slug        TEXT  (unique, indexed)
  created_at  DATETIME
  updated_at  DATETIME

Question
  id          UUID (PK)
  form_id     UUID (FK → Form.id)
  type        TEXT
  title       TEXT
  description TEXT
  required    BOOLEAN
  order       INTEGER
  placeholder TEXT
  options     JSON

Response
  id           UUID (PK)
  form_id      UUID (FK → Form.id)
  submitted_at DATETIME

Answer
  id          UUID (PK)
  response_id UUID (FK → Response.id)
  question_id UUID
  value       TEXT
```

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Forms

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/forms` | List all forms (ordered by `updated_at` desc), includes `response_count` |
| `POST` | `/api/forms` | Create a new form |
| `GET` | `/api/forms/{id}` | Get a single form with questions and response count |
| `PATCH` | `/api/forms/{id}` | Update title, description, status, or questions |
| `DELETE` | `/api/forms/{id}` | Delete a form and all its questions/responses |
| `POST` | `/api/forms/{id}/duplicate` | Duplicate a form (copies questions, starts at 0 responses) |
| `POST` | `/api/forms/{id}/publish` | Publish a form |

### Responses

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/responses` | Submit a response with answers for a published form |
| `GET` | `/api/responses/{form_id}` | List all responses for a form |

### Other

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | API welcome message |
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Swagger UI (interactive API documentation) |

---

## Installation

### Prerequisites

- **Python 3.11+**
- **Node.js 20+**
- **npm 10+**

### Clone the Repository

```bash
git clone https://github.com/your-username/typeform-clone.git
cd typeform-clone
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
APP_NAME=FormFlow
APP_VERSION=0.1.0
API_PREFIX=/api
DATABASE_URL=sqlite:///./formflow.db
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

An example file is provided at `frontend/.env.example`.

---

## Running the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload
```

The API will be available at:

- **API root**: `http://localhost:8000/`
- **Health check**: `http://localhost:8000/health`
- **Swagger UI**: `http://localhost:8000/docs`

---

## Running the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Database Initialization

The database is initialized automatically when the backend starts for the first time. SQLModel creates all tables defined in the models on startup via `init_db()` in `app/database/db.py`. No migrations are needed for development.

---

## Future Improvements

- **Authentication** — user accounts, form ownership, and private forms.
- **Analytics** — response analytics, charts, and export (CSV/JSON).
- **Conditional Logic** — show/hide questions based on previous answers.
- **Custom Themes** — brand colors, fonts, and backgrounds per form.
- **Webhooks** — notify external services on new response.
- **Multi-page Forms** — group questions into pages.
- **File Upload Questions** — allow respondents to attach files.
- **Email Notifications** — notify form owners of new responses.
- **Team Collaboration** — shared workspaces and permissions.
- **PostgreSQL Support** — production-ready database backend.
- **Alembic Migrations** — schema version control.
