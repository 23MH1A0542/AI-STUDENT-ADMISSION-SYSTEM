# AI Student Admissions System

A modern, production-ready, full-stack student enrollment and admissions management portal. Built with **FastAPI**, **React (Vite + Tailwind CSS)**, and **PostgreSQL**, integrated with **Google Gemini AI** for admissions assistance and course recommendations.

---

## 🚀 Key Features

*   **Role-Based Access Control**: Separate workflows for Students and Admins, protected by JWT session authentication.
*   **Admissions Application Flow**: Multistep academic profiling (GPA, statement of purpose) and file uploads (transcripts, ID proof) for students.
*   **Admissions Decision Panel**: Comprehensive administrative dashboard to review student portfolios, download credentials, accept/decline applications, and write evaluation remarks.
*   **Einstein-Like Gemini Chatbot**: Floating admissions assistant for guests and students, answering criteria (GPA >= 2.5), tuition ($8,500/sem), and deadline (Sept 1st) questions.
*   **AI Course Recommender**: Student-facing course path suggestions based on career targets, GPA, and academic history.
*   **Admin Reports & Analytics**: Recharts data visualizations depicting application statuses and department metrics.
*   **Notification Dispatch**: Simulated email dispatches log actions to stdout whenever a student submits an application or an admin updates a decision status.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide Icons, Vitest
*   **Backend**: FastAPI, SQLAlchemy (PostgreSQL ORM), Alembic (Migrations), Pytest
*   **Database**: PostgreSQL
*   **AI Engine**: Google Gemini API (fallback to intelligent mocks when offline/unconfigured)
*   **Orchestration**: Docker, Docker Compose

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── api/                 # Endpoint routing (auth, courses, applications, analytics, ai)
│   │   ├── core/                # Config settings, security, DB connections, logging
│   │   ├── models/              # SQLAlchemy database structures
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── services/            # Gemini client wrapper, simulated notifications
│   │   └── main.py              # Application runner
│   ├── alembic/                 # DB migrations directory
│   ├── tests/                   # Pytest suite files
│   ├── Dockerfile               # Multi-stage python image builder
│   ├── requirements.txt         # Package requirements
│   └── seed.py                  # Seed script for initial catalog & user records
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable view components (Layout, Chatbot)
│   │   ├── context/             # AuthContext session manager
│   │   ├── pages/               # Views (Dashboard, Login/Register, Recommender, Courses, Analytics)
│   │   ├── services/            # Axios API client handlers
│   │   ├── App.jsx              # Routing manager
│   │   └── main.jsx
│   ├── tests/                   # Vitest unit test files
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── Dockerfile               # Node builder + Nginx static server image
├── docker-compose.yml           # Production environment orchestrator
├── .env.example                 # Config template
└── README.md                    # Detailed project overview
```

---

## ⚙️ Quick Start Installation Guide

### Prerequisites
*   Ensure **Docker** and **Docker Compose** are installed on your machine.
*   Get a Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/).

### Running the App
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/ai-student-admissions.git
    cd ai-student-admissions
    ```

2.  **Configure Environment Variables**:
    Copy the template env and insert your credentials:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and paste your Gemini Key:
    ```ini
    GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
    ```

3.  **Start Services via Docker Compose**:
    ```bash
    docker-compose up --build
    ```
    This single command spins up PostgreSQL, applies Alembic migrations, runs `seed.py` (generating initial courses & demo accounts), and launches both the backend and frontend servers.

4.  **Access the Applications**:
    *   **Frontend Client**: [http://localhost](http://localhost) (Proxied port 80)
    *   **Backend REST Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔑 Developer Test Accounts (Seeded)

The database comes pre-seeded with two accounts for easy testing:

*   **Student Login**:
    *   **Email**: `student@admissions.edu`
    *   **Password**: `studentpassword123`
*   **Admin Login**:
    *   **Email**: `admin@admissions.edu`
    *   **Password**: `adminpassword123`

---

## 🧪 Testing

### Backend (Pytest)
Run tests locally:
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest
```

### Frontend (Vitest)
Run tests locally:
```bash
cd frontend
npm install
npm run test
```
