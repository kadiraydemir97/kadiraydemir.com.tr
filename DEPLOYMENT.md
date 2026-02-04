# 🚀 Ubuntu Deployment Guide (Coolify)

This guide details how to deploy your project using **Coolify**. Coolify is an open-source, self-hosted Heroku/Netlify alternative that automates Docker, Reverse Proxy (Traefik/Caddy), and SSL (Let's Encrypt) for you.

---

## 🛠️ Step 1: Install Docker

If Docker is not already installed on your server, run the following commands:

```bash
# Update package index
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose (if needed)
sudo apt-get install docker-compose-plugin -y
```

## 🚀 Step 2: Install Coolify

Connect to your server via SSH and run the official installation script. This script will install Docker (if missing) and set up the Coolify dashboard.

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Once installed, access your dashboard at:  
`http://<YOUR-SERVER-IP>:8000`

---

## 📦 Step 3: Deploying the Application

1.  **Login:** Create your admin account on the Coolify dashboard.
2.  **Connect GitHub:**
    *   Go to **Sources** -> **GitHub App**.
    *   Follow the instructions to link your GitHub account.
3.  **Create New Resource:**
    *   Go to **Projects** -> **Default** (or create new).
    *   Click **+ New Resource** -> **Public Repository** or **Private Repository**.
    *   Select your repository: `kadiraydemir97/kadiraydemir.com.tr`.
4.  **Configuration:**
    *   **Build Pack:** Select `Docker Compose` or `Nginx` (Coolify will detect the `Dockerfile` or `docker-compose.yml`).
    *   **Domains:** Enter `https://kadiraydemir.com.tr`. Coolify will automatically generate the SSL certificate and configure the reverse proxy.
5.  **Deploy:** Click **Deploy**.

---

## 🔄 Automatic CI/CD

Coolify automatically sets up a **Webhook**.  
Every time you `git push` to your `main` branch, Coolify will:
*   Pull the latest code.
*   Build the Docker image.
*   Deploy it with zero downtime.
*   Keep your SSL certificates updated.

---

## 🖥️ Management

*   **Logs:** You can view real-time build and application logs directly in the Coolify UI.
*   **Health Checks:** Coolify monitors your container and restarts it if it crashes.
*   **Backups:** You can easily add database backups or S3 integrations for persistent data.


