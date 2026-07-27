# FormFlow

A Typeform-inspired full-stack form builder built using

- Next.js
- FastAPI
- SQLite
- TypeScript

## Features

- Form Builder
- Public Form Filling
- Forms Dashboard
- Forms CRUD API

## Tech Stack

- Frontend: Next.js, React, Zustand, Tailwind CSS
- Backend: FastAPI, SQLModel, SQLite, Alembic, Pydantic Settings

## Backend Setup

1. Open the `backend` directory.
2. Create or activate a virtual environment.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

The backend uses SQLite and creates `formflow.db` automatically on startup.

## How to Run

From `backend/`:

```bash
uvicorn app.main:app --reload
```

Useful URLs:

- API root: `http://127.0.0.1:8000/`
- Health check: `http://127.0.0.1:8000/health`
- Swagger UI: `http://127.0.0.1:8000/docs`

## API Endpoints

- `GET /api/forms` - List all forms
- `POST /api/forms` - Create a form
- `GET /api/forms/{id}` - Fetch one form
- `PATCH /api/forms/{id}` - Update form title, description, or status
- `DELETE /api/forms/{id}` - Delete a form
- `POST /api/forms/{id}/duplicate` - Duplicate a form and its questions
- `POST /api/forms/{id}/publish` - Publish a form

## Notes

- Responses are not implemented yet.
- Authentication is not implemented yet.
- Analytics is not implemented yet.
