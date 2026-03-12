# Docker & GitHub Actions Setup Guide

## Overview
This project is configured with Docker containerization and GitHub Actions CI/CD pipeline for automated testing and Docker image deployment.

## Files Created

### 1. GitHub Actions Workflow (`.github/workflows/ci.yml`)
Automated CI/CD pipeline that:
- **Triggers on**: Push to main/develop branches and pull requests
- **Build & Test Stage**:
  - Spins up MongoDB service automatically
  - Installs dependencies
  - Runs type checking (`npm run check`)
  - Builds the project (`npm run build`)
- **Docker Push Stage** (only on main/develop branch):
  - Builds Docker image using Buildx
  - Pushes to Docker Hub with automated tags

### 2. Dockerfile
Multi-stage Docker setup:
- Based on `node:20-alpine` (lightweight)
- Installs build dependencies (python3, make, g++)
- Installs npm dependencies
- Builds the application
- Runs in production mode on port 5000

### 3. Docker Compose (`docker-compose.yml`)
Orchestrates two services:
- **MongoDB**: Latest version with health checks
- **App**: Node.js application connected to MongoDB

## Configuration

### Docker Hub Setup
To enable GitHub Actions to push images, configure these secrets in GitHub:
1. Go to Repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token (not password)

### Environment Variables
In `docker-compose.yml`:
- `MONGODB_URI`: `mongodb://admin:mongodb_password@mongodb:27017/clinic?authSource=admin`
- `NODE_ENV`: `production`
- `PORT`: `5000`

MongoDB credentials:
- Username: `admin`
- Password: `mongodb_password`

## Local Development with Docker

### Build & Run Locally
```bash
# Build the Docker image
docker build -t clinic-management:latest .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

### Access Services
- **Application**: http://localhost:5000
- **MongoDB**: localhost:27017

### MongoDB Access
```bash
# Connect to MongoDB container
docker exec -it clinic-mongodb mongosh -u admin -p mongodb_password

# List databases
show databases

# Use clinic database
use clinic
```

### Rebuild After Code Changes
```bash
# Rebuild image
docker-compose build

# Restart with new image
docker-compose up -d
```

## CI/CD Pipeline Flow

1. **Developer pushes code** → GitHub detects push
2. **Tests run** → Type checking, build verification
3. **MongoDB spins up** → For build environment
4. **If tests pass & main/develop branch**:
   - Docker image is built
   - Image tagged with:
     - Branch name (e.g., `main`, `develop`)
     - Git SHA (e.g., `main-a1b2c3d`)
     - `latest` (for main branch only)
   - Image pushed to Docker Hub

5. **Production deployment**:
   - Pull latest image from Docker Hub
   - Use `docker-compose up` on your server
   - MongoDB data persists in named volumes

## Volume Management
Docker Compose uses named volumes for data persistence:
- `mongodb_data`: MongoDB database files
- `mongodb_config`: MongoDB configuration

### Backup MongoDB Data
```bash
# Backup
docker exec clinic-mongodb mongodump --uri "mongodb://admin:mongodb_password@localhost:27017" --out /backup

# Restore
docker exec clinic-mongodb mongorestore --uri "mongodb://admin:mongodb_password@localhost:27017" /backup
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs app

# Verify MongoDB is healthy
docker ps  # Check STATUS column
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
docker-compose ps

# Check connection string in environment
docker exec clinic-app env | grep MONGODB_URI
```

### Clear everything and restart
```bash
# Remove containers and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose build
docker-compose up -d
```

## Production Deployment

On your production server:

1. **Install Docker & Docker Compose**
2. **Clone repository**
3. **Update environment variables**:
   ```bash
   # Edit docker-compose.yml with production settings
   # Change mongodb_password to secure value
   # Use environment file: docker-compose --env-file .env up
   ```
4. **Run**:
   ```bash
   docker-compose up -d
   ```

5. **Setup reverse proxy** (nginx/Apache):
   - Forward requests to `localhost:5000`
   - Enable SSL/TLS

## GitHub Actions Secrets Example
```
DOCKER_USERNAME: yourusername
DOCKER_PASSWORD: dckr_pat_XXXXXXXXXXXXXXXXXXXX
```

Access token from Docker Hub: Settings → Security → New Access Token

## Image Registry
Images are pushed to: `docker.io/yourusername/clinic-management`

Latest tags available:
- `yourusername/clinic-management:main`
- `yourusername/clinic-management:develop`
- `yourusername/clinic-management:latest`
- `yourusername/clinic-management:main-a1b2c3d` (specific commit)
