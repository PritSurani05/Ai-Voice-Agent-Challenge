# Day 3 Frontend Setup - Apollo Pharmacy Theme

## ✅ Frontend Updates Complete

The frontend has been updated to support the Apollo Pharmacy theme for Day 3.

### Changes Made

1. **Created `wellness-welcome.tsx`** - Apollo Pharmacy welcome screen with:
   - Blue/Teal gradient theme
   - Wellness icon (heart with medical cross)
   - Apollo Pharmacy branding
   - Wellness-focused features

2. **Updated `welcome-view.tsx`** - Conditionally shows:
   - Day 3: Apollo Pharmacy wellness welcome
   - Day 2: Zepto Cafe coffee welcome

3. **Updated `app.tsx`** - Uses conditional gradient:
   - Day 3: `apollo-gradient` (blue/teal)
   - Day 2: `zepto-gradient` (purple)

4. **Updated `session-view.tsx`** - Uses conditional gradient for active session

5. **Added CSS styles** - Apollo Pharmacy theme:
   - `.apollo-gradient` - Blue/teal gradient background
   - `.glow-blue` - Blue glow effects
   - `.glow-teal` - Teal glow effects

6. **Updated `start_app.bat`** - Sets `NEXT_PUBLIC_AGENT_DAY` environment variable

## How to Run Day 3

### Windows
```batch
start_app.bat 3
```

This will:
1. Start LiveKit server
2. Start backend with `AGENT_DAY=3`
3. Start frontend with `NEXT_PUBLIC_AGENT_DAY=3`

### Manual Start (if needed)

**Backend:**
```batch
cd backend
set AGENT_DAY=3
uv run python src/agent.py dev
```

**Frontend:**
```batch
cd frontend
set NEXT_PUBLIC_AGENT_DAY=3
pnpm dev
```

## Access the Application

Once all services are running:
- **Frontend**: http://localhost:3000
- **LiveKit Server**: http://localhost:7880

## What You'll See

### Day 3 (Apollo Pharmacy)
- Blue/teal gradient background
- "APOLLO PHARMACY" branding
- Wellness icon (heart with medical cross)
- "Your daily wellness check-in companion" tagline
- Wellness-focused features (Daily Check-ins, Wellness Goals, Health Insights)

### Day 2 (Zepto Cafe)
- Purple gradient background
- "zepto CAFE" branding
- Coffee cup animation
- "Order in minutes with our AI barista!" tagline

## Troubleshooting

### Still seeing Day 2 theme?
1. Make sure you ran `start_app.bat 3` (not just `start_app.bat`)
2. Check that `NEXT_PUBLIC_AGENT_DAY=3` is set in the frontend window
3. Restart the frontend if needed
4. Clear browser cache if the old theme persists

### Environment variable not working?
- Make sure the frontend window shows `NEXT_PUBLIC_AGENT_DAY=3` in the command
- Restart the frontend after setting the variable
- Check `.env.local` in frontend directory (if using)

## Files Modified

- `frontend/components/app/wellness-welcome.tsx` (NEW)
- `frontend/components/app/welcome-view.tsx` (UPDATED)
- `frontend/components/app/app.tsx` (UPDATED)
- `frontend/components/app/session-view.tsx` (UPDATED)
- `frontend/styles/globals.css` (UPDATED)
- `start_app.bat` (UPDATED)

---

**Status**: ✅ Ready to run Day 3 with Apollo Pharmacy theme!

