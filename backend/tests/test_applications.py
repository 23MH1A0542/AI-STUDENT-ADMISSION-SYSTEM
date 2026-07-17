import pytest
from io import BytesIO

@pytest.fixture(scope="module")
def admin_token(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "admin@admissions.edu",
            "password": "adminpassword123"
        }
    )
    return response.json()["access_token"]

@pytest.fixture(scope="module")
def student_token(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "course_student@admissions.edu",
            "password": "securepassword123"
        }
    )
    return response.json()["access_token"]

@pytest.fixture(scope="module")
def course_id(client):
    # Fetch course
    courses = client.get("/api/v1/courses/").json()
    return courses[0]["id"]

def test_submit_application(client, student_token, course_id):
    response = client.post(
        "/api/v1/applications/",
        json={
            "course_id": course_id,
            "gpa": 3.8,
            "statement_of_purpose": "I want to study CS."
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "submitted"
    assert data["gpa"] == 3.8

def test_submit_duplicate_application(client, student_token, course_id):
    response = client.post(
        "/api/v1/applications/",
        json={
            "course_id": course_id,
            "gpa": 3.6,
            "statement_of_purpose": "Duplicate try."
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 400

def test_get_student_applications(client, student_token):
    response = client.get(
        "/api/v1/applications/",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_upload_document(client, student_token):
    # Get application ID first
    apps = client.get(
        "/api/v1/applications/",
        headers={"Authorization": f"Bearer {student_token}"}
    ).json()
    app_id = apps[0]["id"]
    
    # Mock file upload
    file_data = BytesIO(b"dummy pdf transcript data")
    response = client.post(
        f"/api/v1/applications/{app_id}/upload?file_type=transcript",
        files={"file": ("transcript.pdf", file_data, "application/pdf")},
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 201
    assert response.json()["file_type"] == "transcript"

def test_admin_update_status(client, admin_token, student_token):
    # Get application ID first
    apps = client.get(
        "/api/v1/applications/",
        headers={"Authorization": f"Bearer {student_token}"}
    ).json()
    app_id = apps[0]["id"]
    
    response = client.put(
        f"/api/v1/applications/{app_id}/status",
        json={
            "status": "accepted",
            "reviewer_notes": "Welcome to Zenith University!"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "accepted"
    assert response.json()["reviewer_notes"] == "Welcome to Zenith University!"
