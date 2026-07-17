import pytest

@pytest.fixture(scope="module")
def admin_token(client):
    # Register an admin
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "admin@admissions.edu",
            "password": "adminpassword123",
            "full_name": "Admin User",
            "role": "admin"
        }
    )
    # Login
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
    # Register a student
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "course_student@admissions.edu",
            "password": "securepassword123",
            "full_name": "Course Student",
            "role": "student"
        }
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "course_student@admissions.edu",
            "password": "securepassword123"
        }
    )
    return response.json()["access_token"]

def test_admin_create_course(client, admin_token):
    response = client.post(
        "/api/v1/courses/",
        json={
            "code": "CS101",
            "name": "Introduction to Computer Science",
            "description": "Learn basic programming principles.",
            "department": "Computer Science",
            "credits": 3,
            "capacity": 30,
            "is_active": True
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
    assert response.json()["code"] == "CS101"

def test_student_create_course_forbidden(client, student_token):
    response = client.post(
        "/api/v1/courses/",
        json={
            "code": "CS102",
            "name": "Data Structures",
            "description": "Learn basic data structures.",
            "department": "Computer Science",
            "credits": 3,
            "capacity": 30,
            "is_active": True
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 403

def test_get_courses_public(client):
    response = client.get("/api/v1/courses/")
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["code"] == "CS101"

def test_update_course(client, admin_token):
    # First get the course ID
    course_list = client.get("/api/v1/courses/").json()
    course_id = course_list[0]["id"]
    
    response = client.put(
        f"/api/v1/courses/{course_id}",
        json={
            "name": "Introduction to Computer Science v2",
            "capacity": 45
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Introduction to Computer Science v2"
    assert response.json()["capacity"] == 45
