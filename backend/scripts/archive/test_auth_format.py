
import requests

def test_401():
    url = "http://localhost:8000/api/v1/profiles/"
    headers = {
        "Authorization": "Bearer invalid_token"
    }
    try:
        response = requests.post(url, headers=headers, json={})
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type')}")
        print(f"Body: '{response.text}'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_401()
