# HealthSync - Quick Start Guide

Get your AI-powered healthcare management system running in minutes!

## ⚡ 5-Minute Setup

### Step 1: Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click **"Get API Key"**
3. Select **"Create API key in new project"** (or existing project)
4. Copy the API key

### Step 2: Configure Environment
Create a file named `.env.local` in your project root:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=paste_your_api_key_here
```

### Step 3: Install & Run
```bash
pnpm install
pnpm dev
```

### Step 4: Open in Browser
Navigate to: **http://localhost:3000**

✅ **You're ready to go!**

---

## 🎯 Testing the Application

### Patient Portal Demo
1. Click **"Patient Portal"**
2. Enter name: **John Doe** (or any name)
3. Click **"Continue to Portal"**
4. Explore:
   - Upload prescription images
   - View health metrics
   - Check AI health insights

### Doctor Portal Demo
1. Click **"Logout"**
2. Click **"Doctor Portal"**
3. Enter name: **Dr. Sarah Smith**
4. Click **"Continue to Portal"**
5. Explore:
   - View patient list
   - Check analytics
   - Manage prescriptions

### Admin Portal Demo
1. Click **"Logout"**
2. Click **"Admin Portal"**
3. Enter name: **Admin User**
4. Click **"Continue to Portal"**
5. Explore:
   - System dashboard
   - User management
   - System settings

---

## 🎨 What You'll See

### Patient Portal
- Clean dashboard with prescription management
- AI-powered health insights
- Health metrics tracking
- Upload interface for prescription images
- Active prescriptions list with details

### Doctor Portal
- Patient statistics dashboard
- Patient list with health status
- Risk assessment badges
- Analytics with charts
- Prescription management tools

### Admin Portal
- System health metrics
- Active users monitoring
- API usage analytics
- User management interface
- System settings controls

---

## 🔧 Troubleshooting

### "API key not found" Error
- ✅ Check `.env.local` file exists
- ✅ Verify key is pasted correctly (no extra spaces)
- ✅ Restart dev server after adding key

### Prescription Upload Not Working
- ✅ Check image file is JPG, PNG, or similar
- ✅ Verify file size is under 5MB
- ✅ Ensure Gemini API key is valid
- ✅ Check browser console for error details

### Dev Server Won't Start
- ✅ Delete `node_modules` folder
- ✅ Run `pnpm install` again
- ✅ Run `pnpm dev`

---

## 📚 Documentation

For detailed information, see:
- **README.md** - Complete feature documentation
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## 🚀 Next Steps

### To Extend the Application

1. **Add Database** (Optional)
   - Integrate Neon PostgreSQL
   - Implement persistent data storage
   - Add user authentication

2. **Deploy to Vercel** (Free)
   ```bash
   vercel
   ```

3. **Customize Design**
   - Edit `app/globals.css` color tokens
   - Modify component styles in `components/`
   - Update branding in components

4. **Add Features**
   - Email notifications
   - Appointment scheduling
   - Telemedicine integration
   - Advanced reporting

---

## 💡 Pro Tips

### Testing Without API Key
The app has fallback responses if the API key is missing. All features still work with sample data!

### Customize Colors
Edit the color variables in `app/globals.css`:
```css
:root {
  --primary: oklch(0.39 0.18 253.75);  /* Blue */
  --secondary: oklch(0.52 0.11 167.85); /* Teal */
  --accent: oklch(0.65 0.2 17.77);     /* Red */
}
```

### Change Sample Data
Edit the portal components:
- `components/portals/patient-portal.tsx`
- `components/portals/doctor-portal.tsx`
- `components/portals/admin-portal.tsx`

---

## ✨ Features at a Glance

| Feature | Patient | Doctor | Admin |
|---------|---------|--------|-------|
| Prescription Management | ✅ | ✅ | - |
| Health Tracking | ✅ | - | - |
| AI Insights | ✅ | ✅ | - |
| Patient Management | - | ✅ | ✅ |
| Analytics | - | ✅ | ✅ |
| User Management | - | - | ✅ |
| System Monitoring | - | - | ✅ |

---

## 📞 Support

Need help? Check these resources:

1. **Console Errors**: Open browser DevTools (F12) to see error messages
2. **API Issues**: Verify Gemini API key in [Google AI Studio](https://aistudio.google.com)
3. **Build Issues**: Try clearing cache:
   ```bash
   rm -rf .next node_modules
   pnpm install
   ```

---

## 🎉 You're All Set!

Your healthcare management system is ready to use. Start with the Patient Portal and explore each role to see all the features in action!

**Happy coding!** 🚀

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready
