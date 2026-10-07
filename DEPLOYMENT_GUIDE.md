# 🚀 Deployment Guide - Document Analyzer Pro

## Option 1: Railway.app (EMPFOHLEN - 5 Minuten)

### Warum Railway?
- ✅ Kostenlos zum Start ($5 credit/Monat)
- ✅ Automatische HTTPS
- ✅ GitHub Integration
- ✅ Einfachste Deployment

### Steps:

1. **GitHub Repository erstellen**
   ```bash
   # Create new repo on github.com
   # Name: chatgpt-document-analyzer-plugin
   # Public or Private
   
   # Push local code:
   git remote add origin https://github.com/DEIN-USERNAME/chatgpt-document-analyzer-plugin.git
   git branch -M main
   git push -u origin main
   ```

2. **Railway Setup**
   - Gehe zu: https://railway.app
   - "Login with GitHub"
   - "New Project" → "Deploy from GitHub repo"
   - Select: `chatgpt-document-analyzer-plugin`
   - Railway deployed automatisch!

3. **Environment Variable setzen**
   - In Railway Dashboard: "Variables" Tab
   - Add: `PLUGIN_URL` = `https://DEINE-APP.railway.app`
   - (URL findest du unter "Settings" → "Domains")
   - Redeploy (automatic)

4. **Test**
   - URL öffnen: `https://DEINE-APP.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`
   - Plugin Manifest: `https://DEINE-APP.railway.app/.well-known/ai-plugin.json`

### Railway Commands:
```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Deploy from CLI
railway up

# View logs
railway logs
```

---

## Option 2: Render.com (Alternative - Auch gut)

1. **Render Setup**
   - https://render.com → Sign Up
   - "New" → "Web Service"
   - Connect GitHub Repo
   
2. **Configuration**
   - Name: `document-analyzer-plugin`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free
   
3. **Environment Variables**
   - Add: `PLUGIN_URL` = `https://document-analyzer-plugin.onrender.com`
   
4. **Deploy** (takes ~5 minutes)

---

## Option 3: DigitalOcean App Platform

1. **DigitalOcean Setup**
   - https://cloud.digitalocean.com/apps
   - "Create App" → GitHub
   - Select Repo
   
2. **Configure**
   - Name: `doc-analyzer`
   - Build: `npm install`
   - Run: `npm start`
   - Port: 3000 (auto-detected)
   - Environment: Add `PLUGIN_URL`
   
3. **Launch** ($5/mo after trial)

---

## Option 4: Heroku (Classic)

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
cd ~/chatgpt-document-analyzer-plugin
heroku create document-analyzer-[your-name]

# Set environment
heroku config:set PLUGIN_URL=https://document-analyzer-[your-name].herokuapp.com

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open
```

---

## Nach dem Deployment: ChatGPT Plugin Registration

### Prerequisites:
- ChatGPT Plus oder Enterprise Account
- Plugin Developer Access (check Settings → Beta Features)

### Steps:

1. **Öffne ChatGPT**
   - https://chat.openai.com
   - Wähle GPT-4 (mit Plugins)

2. **Plugin Store**
   - Click "Plugins" (neben Model Selector)
   - "Plugin store" → "Develop your own plugin"

3. **Register Plugin**
   - Enter URL: `https://DEINE-APP-URL.com`
   - OpenAI fetched: `/.well-known/ai-plugin.json`
   - Verification: OpenAPI spec wird geprüft

4. **Install & Test**
   - Plugin erscheint in deiner Liste
   - Click "Install"
   - Enable in Chat
   - Test: "Can you help me analyze a document?" + Upload PDF

### Troubleshooting Plugin Registration:

**Problem: "Could not verify plugin"**
- Check: `https://YOUR-URL/.well-known/ai-plugin.json` returns valid JSON
- Check: `https://YOUR-URL/openapi.yaml` returns valid YAML
- Check: CORS enabled (already done in code)
- Check: HTTPS (Railway/Render auto-provide)

**Problem: "Plugin not showing up"**
- Clear ChatGPT cache (hard refresh)
- Try in new chat
- Verify plugin is "Installed" not just "Available"

**Problem: "Plugin errors during use"**
- Check Railway logs: `railway logs`
- Check `/health` endpoint is responding
- Verify file upload size limits

---

## Monitoring & Logs

### Railway:
```bash
railway logs
# Or in dashboard: View logs
```

### Render:
- Dashboard → Your Service → Logs

### Heroku:
```bash
heroku logs --tail
```

---

## Custom Domain (Optional)

### Buy Domain ($10/year):
- Namecheap.com
- Google Domains
- Cloudflare

### Configure DNS:

**Railway:**
- Dashboard → Settings → Domains
- Add custom domain
- Update DNS: CNAME → your-app.railway.app

**Render:**
- Settings → Custom Domain
- Add domain
- Update DNS as shown

---

## Scaling & Performance

### Free Tier Limits:
- **Railway**: $5 credit/mo (~500 hours)
- **Render**: 750 hours/mo (sleeps after 15min idle)
- **Heroku**: 550 hours/mo (sleeps after 30min idle)

### When to Upgrade:
- Railway Pro: $20/mo (unlimited)
- Render Standard: $7/mo (always on)
- DO App Platform: $5/mo

### Performance Tips:
- Railway: Always-on by default (best for plugin)
- Render Free: Add health check to keep alive
- Heroku: Use `heroku ps:scale web=1`

---

## Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Railway | $5 credit/mo | $20/mo unlimited |
| Render | 750 hrs/mo | $7/mo always-on |
| Heroku | 550 hrs/mo | $7/mo hobby |
| DigitalOcean | $200 credit (60 days) | $5/mo |

**Recommendation**: Start with Railway Free → Upgrade only if you get traction

---

## Next Steps After Deployment

1. ✅ Deploy plugin
2. ✅ Register with ChatGPT
3. ✅ Test with real documents
4. → Share on Twitter/Reddit
5. → Collect user feedback
6. → Add authentication (Phase 2)
7. → Implement monetization (Stripe)

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- ChatGPT Plugin Docs: https://platform.openai.com/docs/plugins/introduction
- OpenAPI Validator: https://editor.swagger.io

---

**Ready to Deploy?** → Start with Railway! 🚀
