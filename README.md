# Comment App

A simple full-stack comment application with CRUD functions.

## Tech Stack

**Backend**

- FastAPI
- SQLAlchemy
- SQLite

**Frontend**

- React (Vite)

---

## Features

- List all comments
- Add a new comment (as Admin)
- Edit existing comments
- Delete comments
- Display author, text, created time, likes, and image

## Data Seeding

- Seed file: `backend/data/comments.json`
- The database auto-seeds on backend startup **only if the comments table is empty**.

## API Endpoints

- `GET /comments`
- `POST /comments`
- `PATCH /comments/{comment_id}`
- `DELETE /comments/{comment_id}`

---

## Backend Setup

1. Navigate to the backend directory
   ```
   cd .\Bobyard-Comment\
   cd .\backend\
   ```
2. Create and activate a virtual environment (optional)
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server
   ```
   uvicorn app.main:app --reload --port 8000
   ```

---

## Frontend Setup

1. Navigate to the frontend directory
   ```
   cd .\Bobyard-Comment\
   cd .\frontend\
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server
   ```
   npm run dev
   ```

---

## Time & Next Steps

I focused on implementing the core backend APIs and a clean, functional frontend that supports full CRUD operations. I also spent some additional time polishing the frontend UI (button styling and layout) to make the admin interactions clearer and easier to use.
