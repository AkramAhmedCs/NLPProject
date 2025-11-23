# Deploying to Render.com 🚀

This guide will help you deploy your Markov Chain NLP Tool to Render.com for FREE!

## Prerequisites

- GitHub account (you already have the repo!)
- Render.com account (free - sign up at https://render.com)

## Step-by-Step Deployment

### 1. Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (recommended)

### 2. Create New Web Service

1. Click "New +" button in the Render dashboard
2. Select "Web Service"
3. Connect your GitHub account if you haven't
4. Find and select your repository: `AkramAhmedCs/NLPProject`
5. Click "Connect"

### 3. Configure the Service

Render will auto-detect it's a Python app. Configure these settings:

**Name:** `markov-nlp-tool` (or whatever you prefer)

**Environment:** `Python 3`

**Build Command:** (auto-detected)
```
pip install -r requirements.txt
```

**Start Command:** (auto-detected)
```
python app.py
```

**Instance Type:** `Free`

### 4. Deploy!

1. Click "Create Web Service"
2. Wait 2-3 minutes while Render builds and deploys
3. Your app will be live at: `https://markov-nlp-tool.onrender.com` (or your chosen name)

## ✅ That's It!

Your app is now live with:
- ✅ Python Flask backend running
- ✅ Frontend served from the same domain
- ✅ No CORS issues
- ✅ HTTPS automatically enabled
- ✅ Auto-deploys on every GitHub push!

## 🎯 Using Your Deployed App

Just visit: `https://YOUR-APP-NAME.onrender.com`

The frontend will load and automatically connect to the backend API!

## 📝 Notes

**Free Tier Limitations:**
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month of runtime (plenty for personal use)

**To Keep It Always Awake (optional):**
- Upgrade to paid tier ($7/month)
- Or use a service like UptimeRobot to ping it every 14 minutes

## 🔄 Updating Your App

Every time you push to GitHub, Render automatically rebuilds and redeploys:

```bash
git add .
git commit -m "Update message"
git push
```

Wait 2-3 minutes and your changes are live!

## 🌐 Custom Domain (Optional)

You can add your own domain in Render settings (even on free tier!):
1. Go to Settings → Custom Domains
2. Add your domain
3. Update your DNS records as instructed

## 🐛 Troubleshooting

**If deployment fails:**
1. Check the logs in Render dashboard
2. Make sure `requirements.txt` has all dependencies
3. Verify `render.yaml` is in the root directory

**If app loads but doesn't work:**
1. Check browser console for errors
2. Verify the API URL is correct (should use relative `/api`)
3. Check Render logs for backend errors

## 🎊 Success!

Your Markov Chain NLP Tool is now publicly accessible and shareable!

Share the link with anyone: `https://YOUR-APP-NAME.onrender.com`
