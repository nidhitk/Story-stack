# StoryStack

StoryStack is a full-stack discussion board project with a FastAPI backend and a React frontend.

Users can register, log in, create titles, publish posts under titles, and edit or delete their own posts.

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PostgreSQL, Alembic
- Auth: JWT access and refresh tokens
- Frontend: React, Create React App
- Database driver: psycopg2

## Project Structure

```text
Story-stack/
  app/                    FastAPI backend
    main.py               API routes
    auth.py               Password hashing and JWT helpers
    database.py           SQLAlchemy database connection
    models.py             SQLAlchemy models
    schemas.py            Pydantic schemas
  alembic/                Database migration files
  frontend/readit-v2/     React frontend
  requirements.txt        Python dependencies
  alembic.ini             Alembic configuration
  runtime.txt             Python runtime hint
```

## Backend Setup

Create and activate a virtual environment, then install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/storystack_db"
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

The API will run at:

```text
http://localhost:8000
```

FastAPI docs are available at:

```text
http://localhost:8000/docs
```

## Frontend Setup

Install frontend dependencies:

```powershell
cd frontend\readit-v2
npm install
```

Start the React app:

```powershell
npm start
```

The frontend will run at:

```text
http://localhost:3000
```

By default, the frontend calls:

```text
http://localhost:8000
```

To use a different backend URL, create `frontend/readit-v2/.env`:

```env
REACT_APP_API_URL="https://your-backend-url"
```

## Main API Endpoints

Auth:

- `POST /register` creates a user with `username`, `email`, and `password`
- `POST /login` logs in with OAuth form data and returns JWT tokens

Titles:

- `POST /Title` creates a title
- `GET /titles` lists all titles with posts
- `GET /titile/{titile_id}/allposts` gets one title with posts
- `PATCH /editTitle?title_id=ID` edits a title
- `DELETE /deletecontent?titile_id=ID&forced_delete=true` deletes a title

Posts:

- `POST /posts?parent_id=ID` creates an authenticated post
- `PATCH /editposts?post_id=ID` edits an authenticated user's post
- `DELETE /deletepost?post_id=ID` deletes an authenticated user's post

## Auth Flow

The React frontend supports registration and login.

Registration calls `/register`, then logs in through `/login` and stores the returned access token in `localStorage`. Authenticated post create, edit, and delete requests send:

```http
Authorization: Bearer <access_token>
```

## Build Frontend

Create a production build:

```powershell
cd frontend\readit-v2
npm run build
```

The output is written to:

```text
frontend/readit-v2/build
```
