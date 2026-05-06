---
description: how to start the QRPrimeGen project
---

To start both the backend and frontend servers for the QRPrimeGen project, follow these steps:

### 1. Start the Backend Server
Open a terminal in the `backend` directory and run:
```bash
npm run dev
```
Wait for the message indicating the server is running on port 8080.

### 2. Start the Frontend Server
Open another terminal in the `frontend` directory and run:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Troubleshooting
- **Database**: Ensure your PostgreSQL database is running and accessible using the `DATABASE_URL` in `backend/.env`.
- **Environment Variables**: Check that `.env` files in both `backend` and `frontend` are correctly configured.
