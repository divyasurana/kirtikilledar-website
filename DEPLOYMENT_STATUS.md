# Admin Panel Issues - Production vs Preview

## Current State (2026-03-11)

### PREVIEW Environment ✅
- All code fixes are present
- Admin login works
- Add buttons exist
- Upload to Object Store works
- Empty state messages show

### PRODUCTION Environment ❌  
- Running OLD code (before all fixes)
- Admin pages show empty messages but NO ADD BUTTONS
- Upload might work but images don't display
- Frontend still points to preview backend URL

## Root Causes

### Issue 1: Production Not Redeployed
**Problem:** All fixes made in preview environment haven't been deployed to production
**Impact:** No "Add Project", "Add Image", "Add Event" buttons visible
**Solution:** Redeploy to production

### Issue 2: Frontend Environment Variable
**Problem:** `REACT_APP_BACKEND_URL` still points to preview in production build
**Current:** `https://killedar-portfolio.preview.emergentagent.com`
**Should Be:** `https://kirtikilledar.com`
**Impact:** API calls go to wrong backend, data doesn't sync
**Solution:** Update env var in deployment settings OR ensure .env is correct before deploy

### Issue 3: Database Mismatch
**Problem:** Preview and Production use different databases
- Preview DB: `kirti_portfolio` (has test data)
- Production DB: `killedar_portfolio` OR different instance
**Impact:** Changes in admin don't appear on website
**Solution:** Both should use SAME database

## What Needs To Happen

### Step 1: Fix Environment Variable
In `/app/frontend/.env`:
```
REACT_APP_BACKEND_URL=https://kirtikilledar.com
```
NOT:
```
REACT_APP_BACKEND_URL=https://killedar-portfolio.preview.emergentagent.com
```

### Step 2: Redeploy to Production
- Ensures all button fixes are live
- Ensures Object Store integration is active
- Ensures auth token fixes are deployed

### Step 3: Test Complete Flow
1. Login at kirtikilledar.com/admin
2. Click "Add Project" button (should be visible)
3. Fill form with image URL or upload
4. Save
5. Check kirtikilledar.com/work page
6. Image should appear

## Quick Verification Commands

Test if admin user exists in production DB:
```bash
mongosh --eval "use killedar_portfolio; db.admin_users.find({username:'admin'}).count()"
```

Test if production backend responds:
```bash
curl https://kirtikilledar.com/api/content/home
```

Test admin login:
```bash
curl -X POST https://kirtikilledar.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Kirti2024!"}'
```

## Files Changed (Need Redeployment)

**Backend:**
- `/app/backend/storage.py` (NEW - Object Store)
- `/app/backend/server.py` (Object Store init, file download endpoint)
- `/app/backend/admin_routes.py` (Upload to Object Store, auth token fixes, timezone import)
- `/app/backend/.env` (Added EMERGENT_LLM_KEY)

**Frontend:**
- `/app/frontend/.env` (MUST point to kirtikilledar.com)
- `/app/frontend/src/components/admin/AdminLogin.jsx` (JSON body fix)
- `/app/frontend/src/components/admin/AdminProjects.jsx` (Auth token, empty state, URL field)
- `/app/frontend/src/components/admin/AdminGallery.jsx` (Auth token, empty state, URL field)
- `/app/frontend/src/components/admin/AdminEvents.jsx` (Auth token)
- `/app/frontend/src/components/admin/AdminHome.jsx` (URL field for images)
- `/app/frontend/src/components/admin/AdminAbout.jsx` (URL field for images)

## The Core Problem

**You're looking at PRODUCTION which has OLD CODE.**
**All fixes exist in PREVIEW but haven't been deployed to PRODUCTION.**

That's why:
- You see empty messages but no buttons
- Uploads don't reflect on website
- Nothing works

**Solution: ONE final redeploy with correct env vars.**
