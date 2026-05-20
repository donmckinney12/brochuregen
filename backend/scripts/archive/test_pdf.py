
import requests
import os

url = "http://localhost:8002/api/generate-pdf"
data = {
    "headline": "Awesome Product",
    "subheadline": "The best solution for your needs.",
    "about_us": "We are a company dedicated to excellence.",
    "features": ["Feature A", "Feature B", "Feature C"],
    "contact_info": "www.awesome.com"
}

try:
    print("Testing PDF Generation...")
    response = requests.post(url, json=data)
    
    if response.status_code == 200:
        with open("test_brochure.pdf", "wb") as f:
            f.write(response.content)
        print("Success! Saved to test_brochure.pdf")
        print(f"File size: {os.path.getsize('test_brochure.pdf')} bytes")
    else:
        print(f"Failed: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"Error: {e}")
