# 🚀 Ubuntu Deployment Guide (Docker + Nginx Proxy)

This guide details how to deploy your React + Vite project using **Docker** and **Nginx Reverse Proxy**. This is the most professional and flexible way to host modern web apps.

## Prerequisites
- **Ubuntu Server** (20.04 or 22.04 LTS recommended)
- **Root/Sudo Access** via SSH
- **Domain Name** (points to server IP)

---

## Step 1: System Prep & Docker Installation

Connect to your server and install Docker.

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install Docker & Compose
sudo apt install docker.io docker-compose -y

# Install Nginx & Certbot (For SSL Proxy)
sudo apt install nginx certbot python3-certbot-nginx -y

# Add user to docker group (avoid sudo for docker commands)
sudo usermod -aG docker $USER
# NOTE: Logout and login again for this to take effect!
```

---

## Step 2: Clone & Run Project (Docker)

We will run the application inside a container on port `3000`.

```bash
# Go to web directory
cd /var/www

# Clone Repo
git clone https://github.com/kadiraydemir97/kadiraydemir.com.tr.git
cd kadiraydemir.com.tr

# Start the Container
# This builds the app and starts it on localhost:3000
docker-compose up -d --build
```

**Check if running:** `curl localhost:3000` (Should return HTML).

---

## Step 3: Configure Nginx (Reverse Proxy)

Now we tell the main Nginx server to forward traffic from the internet to your Docker container.

```bash
sudo nano /etc/nginx/sites-available/kadiraydemir.com.tr
```

**Paste this config:**

```nginx
server {
    listen 80;
    server_name kadiraydemir.com.tr www.kadiraydemir.com.tr;

    location / {
        # Forward traffic to Docker container
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable Site & Restart:**

```bash
sudo ln -s /etc/nginx/sites-available/kadiraydemir.com.tr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 4: SSL Setup (HTTPS)

Secure your site with a free certificate.

```bash
sudo certbot --nginx -d kadiraydemir.com.tr -d www.kadiraydemir.com.tr
```

Follow the prompts. Certbot will automatically configure HTTPS redirect.

---

## 🔄 Updating the Site

When you push new code to GitHub:

```bash
cd /var/www/kadiraydemir.com.tr
git pull
docker-compose up -d --build
```
*Docker will rebuild the image with new code and restart the container seamlessly.*

---

## 🗑️ Reset / Uninstall

To remove everything and start fresh:

```bash
docker-compose down
sudo systemctl stop nginx
sudo rm -rf /var/www/kadiraydemir.com.tr
sudo rm /etc/nginx/sites-available/kadiraydemir.com.tr
sudo rm /etc/nginx/sites-enabled/kadiraydemir.com.tr
sudo certbot delete --cert-name kadiraydemir.com.tr
sudo systemctl start nginx
```
