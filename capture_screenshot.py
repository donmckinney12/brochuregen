import requests
import base64
import os

def capture():
    print("Requesting screenshot from backend...")
    try:
        response = requests.post(
            "http://localhost:8002/api/scrape",
            json={"url": "http://example.com"},
            timeout=60
        )
        response.raise_for_status()
        data = response.json()
        
        screenshot_data = data.get("screenshot")
        if not screenshot_data:
            print("No screenshot data received.")
            return

        # Remove header "data:image/png;base64,"
        if "base64," in screenshot_data:
            screenshot_b64 = screenshot_data.split("base64,")[1]
        else:
            screenshot_b64 = screenshot_data

        # Ensure assets directory exists
        os.makedirs("assets", exist_ok=True)

        # Save as assets/preview.png
        with open("assets/preview.png", "wb") as f:
            f.write(base64.b64decode(screenshot_b64))
        
        print("Screenshot saved to assets/preview.png")

    except Exception as e:
        error_msg = f"Error: {e}\n"
        if hasattr(e, 'response') and e.response is not None:
             error_msg += f"Response Body: {e.response.text}\n"
        
        print(error_msg)
        with open("scan_error.txt", "w") as f:
            f.write(error_msg)

if __name__ == "__main__":
    capture()
