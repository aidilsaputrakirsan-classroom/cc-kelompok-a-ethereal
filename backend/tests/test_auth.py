def test_register(client):

    response = client.post(
        "/auth/register",
        json={
            "email": "user@example.com",
            "password": "Password123",
            "name": "Test User"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "user@example.com"


def test_login(client):

    # register dulu
    client.post(
        "/auth/register",
        json={
            "email": "login@example.com",
            "password": "Password123",
            "name": "Login User"
        }
    )

    # login
    response = client.post(
        "/auth/login",
        data={
            "username": "login@example.com",
            "password": "Password123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data