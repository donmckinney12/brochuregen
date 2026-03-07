# Use the official Playwright image which includes Python and browser binaries
FROM mcr.microsoft.com/playwright/python:v1.49.0-jammy

# Set the working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browser and system dependencies
RUN playwright install --with-deps chromium

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (Fly.io standard)
EXPOSE 8080

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]