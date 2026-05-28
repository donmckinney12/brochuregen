# BrochureGen Deployment Guide

This document outlines the deployment strategy for BrochureGen, covering both the Next.js frontend and the containerized microservices backend (Python FastAPI + Go Gin).

## 🌍 Frontend Deployment (Netlify)

The Next.js frontend is optimized for deployment on Netlify. It automatically handles server-side rendering (SSR) and API routes via Netlify Functions.

### 1. Prerequisites
- A [Netlify](https://www.netlify.com/) account.
- The repository connected to your Netlify account via GitHub/GitLab.

### 2. Build Configuration
Ensure your Netlify build settings are configured as follows:
- **Base directory**: `frontend`
- **Build command**: `npm install && npm run build`
- **Publish directory**: `frontend/.next`

*Note: The `@netlify/plugin-nextjs` plugin is automatically detected and installed by Netlify to handle Next.js App Router features.*

### 3. Environment Variables
You must configure the following environment variables in your Netlify dashboard (**Site Settings > Environment Variables**):

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | The public URL of your backend server. | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Auth public key. | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk Auth secret key. | `sk_test_...` |
| `OPENAI_API_KEY` | (If proxying requests via frontend) | `sk-...` |

---

## 🚀 Backend Deployment (Docker Compose / VPS)

The backend consists of two services (Python and Go) communicating over a private Docker network. The easiest way to deploy them in production is using a Virtual Private Server (VPS) like DigitalOcean, AWS EC2, or Hetzner.

### 1. Provision a Server
- Provision an Ubuntu 22.04 LTS server.
- Install [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose](https://docs.docker.com/compose/install/).
- Expose port `80` and `443` for web traffic.

### 2. Transfer Code
Clone your repository onto the production server:
```bash
git clone https://github.com/your-username/brochuregen.git
cd brochuregen
```

### 3. Production Environment Variables
Create a `.env` file in the `backend/` directory on the server:

```ini
# backend/.env
DATABASE_URL=sqlite:///./sql_app.db
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
CLERK_SECRET_KEY=sk_...
FRONTEND_URL=https://your-netlify-domain.netlify.app

# Go Service (Optional depending on your setup)
PORT=8080
```

### 4. Adjusting Docker Compose for Production
In production, you do **not** want to mount your local source code as volumes (which is used for hot-reloading in dev). 

Modify your `docker-compose.yml` to remove the `volumes` linking to `./backend` and `./backend-go` for the backend services. **Keep the volume for the SQLite database** to ensure data persistence:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - GO_SERVICE_URL=http://backend-go:8080
    volumes:
      # ONLY mount the database file for persistence
      - ./backend/sql_app.db:/app/sql_app.db
    restart: always

  backend-go:
    build:
      context: ./backend-go
      dockerfile: Dockerfile
    expose:
      - "8080"
    restart: always
```

### 5. Launch the Services
Start the backend services in detached mode:
```bash
docker-compose up -d --build
```

### 6. Reverse Proxy & SSL (Nginx / Caddy)
To expose your FastAPI backend securely over HTTPS, set up a reverse proxy pointing to port `8000`. 

**Using Caddy (Recommended for Auto-SSL):**
Create a `Caddyfile`:
```caddyfile
api.yourdomain.com {
    reverse_proxy localhost:8000
}
```
Run Caddy to automatically provision a Let's Encrypt SSL certificate and route traffic to your Docker container.

---

## 🔒 Security Checklist
- [ ] Ensure `sql_app.db` is correctly mounted as a volume so data is not lost when the Python container restarts.
- [ ] Ensure your CORS settings in FastAPI (`backend/main.py` or similar) are updated to only accept requests from your exact Netlify domain, rather than `*` or `localhost`.
- [ ] Hide the Go backend behind the Docker internal network (do not map port 8080 to the host). It should only be accessible internally by the Python service.
