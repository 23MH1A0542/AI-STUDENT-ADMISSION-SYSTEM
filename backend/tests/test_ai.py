import pytest

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

def test_guest_chat(client):
    response = client.post(
        "/api/v1/ai/chat",
        json={"message": "What is the minimum GPA requirement?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sender"] == "bot"
    assert "GPA" in data["message"] or "minimum" in data["message"] or "Zenith" in data["message"]
    assert data["user_id"] is None

def test_authenticated_chat(client, student_token):
    response = client.post(
        "/api/v1/ai/chat",
        json={"message": "Can I upload transcripts?"},
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["sender"] == "bot"
    assert data["user_id"] is not None

def test_course_recommendations(client):
    response = client.post(
        "/api/v1/ai/recommendations",
        json={
            "gpa": 3.5,
            "interests": "computer programming, software engineering",
            "background": "High school science"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert data["is_mock"] is True # Running in test environments usually falls back to Mock
