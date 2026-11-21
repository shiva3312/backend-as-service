# 10. Production & VPS Docker Deployment Guide

This guide provides step-by-step instructions for containerizing and deploying the **`data-manager`** platform on any Virtual Private Server (VPS) — such as DigitalOcean, AWS EC2, Hetzner, Linode, or Vultr — using Docker and Docker Compose.

---

## 1. Prerequisites on the VPS

Before deploying, ensure your target VPS has:
* **Operating System**: Ubuntu 22.04 / 24.04 LTS (recommended) or any modern Linux distribution.
* **Hardware Specs**: Minimum 2 vCPU, 2 GB RAM (4 GB recommended for production workloads).
* **Installed Packages**:
  - `docker` (v24.x or higher)
  - `docker-compose-plugin` (Docker Compose v2)
  - `git`
  - `nginx` or `caddy` (for HTTPS / Reverse Proxy)

---

## 2. Fast 5-Step VPS Deployment Workflow

### Step 1: Clone Repository onto the VPS
```bash
git clone https://github.com/your-org/data-manager.git /opt/data-manager
cd /opt/data-manager
```

### Step 2: Configure Environment Variables
Create your production `.env` file from the production template:
```bash
cp .env.production.example .env
```

Edit `.env` and set secure passwords and cryptographic keys:
```bash
nano .env
```

> [!IMPORTANT]
> Ensure you update:
> * `POSTGRES_PASSWORD`: Strong database password
> * `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`: High-entropy secrets (min 32 chars)
> * `MASTER_ENCRYPTION_KEY`: 32-byte hex string (64 characters) for file envelope encryption:
>   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 3: Launch Production Containers
Start PostgreSQL, Redis, and the Gateway API (with automatic migrations and initial data seeding):
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 4: Verify Container Health
Check container logs and health statuses:
```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# View live API logs
docker compose -f docker-compose.prod.yml logs -f api
```

Verify the API health status:
```bash
curl -I http://localhost:3000/docs
```

### Step 5: Configure Reverse Proxy & SSL (Nginx + Certbot)
Install Nginx and Certbot for free SSL (HTTPS):
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create Nginx site configuration (`/etc/nginx/sites-available/datamanager`):
```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and request SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/datamanager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d api.yourdomain.com
```

---

## 3. Maintenance & Operations Command Reference

| Action | Command |
| :--- | :--- |
| **View API Container Logs** | `docker compose -f docker-compose.prod.yml logs -f api` |
| **Restart Application** | `docker compose -f docker-compose.prod.yml restart api` |
| **Update to Latest Code** | `git pull && docker compose -f docker-compose.prod.yml up -d --build` |
| **Run Manual DB Migration** | `docker exec -it datamanager-api-prod pnpm db:deploy` |
| **Stop All Production Services** | `docker compose -f docker-compose.prod.yml down` |
| **Backup PostgreSQL Data** | `docker exec datamanager-postgres-prod pg_dump -U postgres datamanager_prod_db > backup.sql` |
