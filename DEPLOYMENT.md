# HealthSync - Deployment Guide

This guide covers deploying your HealthSync application to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended) ⭐
The fastest and easiest way to deploy a Next.js application.

#### Steps:
1. **Push to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HealthSync v1.0"
   git remote add origin https://github.com/yourusername/healthsync.git
   git push -u origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your healthsync repository
   - Click "Import"

3. **Configure Environment**
   - In "Environment Variables" section:
     - Add `NEXT_PUBLIC_GEMINI_API_KEY` with your API key value
   - Click "Deploy"

4. **Custom Domain** (Optional)
   - Go to project Settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration steps

**Deployment time:** 2-3 minutes  
**Cost:** Free tier available (up to 100GB bandwidth/month)

---

### Option 2: Self-Hosted (Node.js)
Deploy to your own server or VPS.

#### Prerequisites:
- Node.js 18+ installed
- SSH access to server
- Domain name (optional)

#### Steps:

1. **SSH into your server**
   ```bash
   ssh user@your-server.com
   ```

2. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthsync.git
   cd healthsync
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set environment variables**
   ```bash
   nano .env.production.local
   ```
   Add:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key
   NODE_ENV=production
   ```

5. **Build the application**
   ```bash
   pnpm build
   ```

6. **Start the application**
   ```bash
   pnpm start
   ```

7. **Set up PM2 for persistent running** (Recommended)
   ```bash
   npm install -g pm2
   pm2 start npm --name "healthsync" -- start
   pm2 startup
   pm2 save
   ```

8. **Set up Nginx as reverse proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/healthsync
   ```
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/healthsync /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Set up SSL (Let's Encrypt)**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 3: Docker Containerization
Deploy using Docker for consistency across environments.

#### Dockerfile
Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy application
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV production

# Start the application
CMD ["pnpm", "start"]
```

#### .dockerignore
```
node_modules
.next
.git
.gitignore
README.md
npm-debug.log
```

#### Build and run:
```bash
# Build image
docker build -t healthsync:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GEMINI_API_KEY=your_key \
  healthsync:latest
```

#### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  healthsync:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_GEMINI_API_KEY: ${GEMINI_API_KEY}
    restart: unless-stopped
```

Run:
```bash
GEMINI_API_KEY=your_key docker-compose up -d
```

---

### Option 4: Traditional Hosting (cPanel, etc.)
For shared hosting with Node.js support.

1. Upload files via FTP/SFTP
2. SSH into account
3. Install dependencies: `pnpm install`
4. Build: `pnpm build`
5. Configure Node.js app in hosting control panel
6. Point domain to Node.js application

---

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] `.env.local` added to `.gitignore`
- [ ] All dependencies installed
- [ ] Build succeeds: `pnpm build`
- [ ] No console errors: `pnpm dev`
- [ ] All portals tested in development
- [ ] API key validated
- [ ] Database backups (if using database)
- [ ] Security headers configured
- [ ] Domain configured
- [ ] SSL certificate setup

---

## 🔒 Security Checklist

### Before Production:

1. **API Key Security**
   - Never commit `.env.local` to Git
   - Use environment variables only
   - Rotate API keys regularly
   - Monitor API usage

2. **Application Security**
   - Enable HTTPS/SSL
   - Set security headers
   - Implement CORS properly
   - Validate all inputs

3. **Database Security** (if added)
   - Use strong passwords
   - Enable encryption at rest
   - Enable encryption in transit
   - Regular backups
   - Row-level security (RLS)

4. **Monitoring**
   - Set up error logging
   - Monitor API usage
   - Track user activity
   - Set up alerts

---

## 📊 Production Performance Tips

1. **Optimize Images**
   ```bash
   # Generate responsive images
   pnpm add next-image-export-optimizer
   ```

2. **Enable Caching**
   - Set appropriate cache headers
   - Use CDN for static assets
   - Enable browser caching

3. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Check API response times

4. **Backup Strategy**
   - Daily backups
   - Off-site storage
   - Disaster recovery plan

---

## 🔍 Monitoring in Production

### Vercel Monitoring (if using Vercel):
- Analytics dashboard
- Real-time logs
- Error tracking
- Performance metrics

### Self-Hosted Monitoring:
Set up application monitoring with:
- PM2 Plus
- New Relic
- DataDog
- Sentry (error tracking)
- Grafana (metrics)

---

## 📞 Troubleshooting Deployment

### Common Issues:

**"Cannot find module" error**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**API Key not working**
- Verify key in environment variables
- Check Gemini API console for usage limits
- Ensure key has proper permissions

**High memory usage**
- Check for memory leaks in code
- Increase server RAM
- Enable caching
- Optimize database queries

**Slow response times**
- Enable gzip compression
- Use CDN for static assets
- Optimize images
- Check database queries
- Review API response times

---

## 📈 Scaling Tips

### Horizontal Scaling:
- Load balancer (nginx, HAProxy)
- Multiple application instances
- Shared database
- Redis cache

### Vertical Scaling:
- Increase server resources
- Optimize application code
- Database optimization
- Caching strategy

### Database Scaling (when added):
- Read replicas
- Sharding strategy
- Connection pooling
- Index optimization

---

## 🎯 Deployment Timeline

| Step | Time | Notes |
|------|------|-------|
| Prepare code | 5 min | Ensure all tests pass |
| Set env vars | 2 min | Add API keys to hosting |
| Build | 2 min | `pnpm build` locally |
| Deploy | 2 min | Push to Vercel or server |
| Verify | 3 min | Test all features |
| Monitor | Ongoing | Check logs and metrics |

**Total time:** ~15 minutes (first deployment)

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [SSL/Let's Encrypt](https://letsencrypt.org/)

---

## ✨ Post-Deployment

After successful deployment:

1. **Test All Features**
   - Test each portal
   - Verify API integration
   - Check file uploads
   - Test error handling

2. **Monitor Performance**
   - Check response times
   - Monitor API usage
   - Review error logs
   - Track user activity

3. **Set Up Alerts**
   - Downtime alerts
   - Error rate alerts
   - API quota alerts
   - Performance alerts

4. **User Communication**
   - Update documentation
   - Inform users of URL
   - Share access credentials
   - Provide support contact

---

## 🎉 You're Live!

Your HealthSync application is now in production and accessible to users. Monitor performance and user feedback to ensure smooth operation.

**Congratulations on your deployment!** 🚀

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready
