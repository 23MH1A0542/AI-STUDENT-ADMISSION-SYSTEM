import pytest

def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "teststudent@admissions.edu",
            "password": "securepassword123",
            "full_name": "Test Student",
            "role": "student"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "teststudent@admissions.edu"
    assert data["full_name"] == "Test Student"
    assert data["role"] == "student"
    assert "id" in data

def test_register_duplicate_user(client):
    # Try registering the same user again
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "teststudent@admissions.edu",
            "password": "securepassword123",
            "full_name": "Test Student",
            "role": "student"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_user(client):
    # Valid login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "teststudent@admissions.edu",
            "password": "securepassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    # Invalid password
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "teststudent@admissions.edu",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 400

def test_get_me(client):
    # Login first
    login_response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "teststudent@admissions.edu",
            "password": "securepassword123"
        }
    )
    token = login_response.json()["access_token"]
    
    # Get profile
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "teststudent@admissions.edu"
    assert data["role"] == "student"
