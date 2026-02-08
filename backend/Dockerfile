
# Use the official Playwright image which includes Python and browser binaries
FROM mcr.microsoft.com/playwright/python:v1.49.0-jammy

# Set the working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8002

# Command to run the application
# We use 0.0.0.0 to allow external access from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]