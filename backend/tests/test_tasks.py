"""Test task endpoints."""


def test_create_task(client, auth_headers):

    response = client.post(
        "/tasks",
        json={
            "title": "Belajar CI/CD",
            "description": "Workshop backend",
        },
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Belajar CI/CD"
    assert "id" in data


def test_create_task_unauthorized(client):

    response = client.post(
        "/tasks",
        json={
            "title": "Unauthorized Task"
        }
    )

    assert response.status_code == 401


def test_get_tasks(client, auth_headers):

    client.post(
        "/tasks",
        json={
            "title": "Task 1"
        },
        headers=auth_headers
    )

    client.post(
        "/tasks",
        json={
            "title": "Task 2"
        },
        headers=auth_headers
    )

    response = client.get(
        "/tasks",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) >= 2


def test_get_task_not_found(client, auth_headers):

    response = client.get(
        "/tasks/9999",
        headers=auth_headers
    )

    assert response.status_code == 404


def test_update_task(client, auth_headers):

    create_response = client.post(
        "/tasks",
        json={
            "title": "Old Task"
        },
        headers=auth_headers
    )

    task_id = create_response.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Updated Task"
        },
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated Task"


def test_delete_task(client, auth_headers):

    create_response = client.post(
        "/tasks",
        json={
            "title": "Delete Me"
        },
        headers=auth_headers
    )

    task_id = create_response.json()["id"]

    response = client.delete(
        f"/tasks/{task_id}",
        headers=auth_headers
    )

    assert response.status_code == 204


def test_create_task_empty_title(client, auth_headers):

    response = client.post(
        "/tasks",
        json={
            "title": ""
        },
        headers=auth_headers
    )

    assert response.status_code == 422


def test_create_task_without_title(client, auth_headers):

    response = client.post(
        "/tasks",
        json={
            "description": "No title"
        },
        headers=auth_headers
    )

    assert response.status_code == 422


def test_update_task_not_found(client, auth_headers):

    response = client.put(
        "/tasks/9999",
        json={
            "title": "Not Found"
        },
        headers=auth_headers
    )

    assert response.status_code == 404


def test_delete_task_not_found(client, auth_headers):

    response = client.delete(
        "/tasks/9999",
        headers=auth_headers
    )

    assert response.status_code == 404

def test_get_single_task(client, auth_headers):

    create_response = client.post(
        "/tasks",
        json={
            "title": "Single Task"
        },
        headers=auth_headers
    )

    task_id = create_response.json()["id"]

    response = client.get(
        f"/tasks/{task_id}",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Single Task"


def test_update_task_status(client, auth_headers):

    create_response = client.post(
        "/tasks",
        json={
            "title": "Status Task"
        },
        headers=auth_headers
    )

    task_id = create_response.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "status": "done"
        },
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "done"