#!/bin/bash
set -e

echo "Waiting for database to be ready..."
python -c "
import time, sys, urllib.parse, psycopg2
db_url = '${DATABASE_URL}'
if not db_url:
    print('DATABASE_URL is not set')
    sys.exit(1)

# Extract connection parameters manually or let psycopg2 handle the connection string
while True:
    try:
        conn = psycopg2.connect(db_url)
        conn.close()
        print('Database is ready!')
        sys.exit(0)
    except Exception as e:
        print(f'Database not ready yet ({e}). Waiting 2 seconds...')
        time.sleep(2)
"

echo "Running migrations..."
# Check if migrations directory exists, if not, initialize alembic
if [ ! -d "alembic/versions" ]; then
    echo "Alembic not initialized, setting up initial structure..."
    alembic init alembic
fi

# Run database migrations
alembic upgrade head || echo "Migration failed or no migrations to run"

echo "Running seed script..."
python seed.py || echo "Seeding failed or database already seeded"

echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
