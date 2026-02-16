# CampusSafe Claim Submission Fix

## Problem
Claim submission fails with "Match ID is required" or "Server Error"

## Root Causes Fixed
1. ✅ Missing multer middleware for file uploads
2. ✅ Database schema mismatch (added match_id column)
3. ⚠️  **SERVER NEEDS RESTART** to load new code

## Solution Steps

### 1. Database Schema (COMPLETED ✅)
- Added `match_id` column to ItemClaims table
- Added `claimed_at` column to ItemClaims table
- Schema now matches code expectations

### 2. Backend Code (COMPLETED ✅)
- Installed multer package
- Created `middleware/upload.js` for file handling
- Updated `routes/claimRoutes.js` to use multer
- Fixed `controllers/claimController.js` to handle FormData

### 3. Frontend Code (COMPLETED ✅)
- Fixed ItemClaim.jsx to use real file input
- Added file preview and validation
- Sends data via FormData with multipart/form-data

## CRITICAL: Server Restart Required

**The server MUST be restarted for changes to take effect!**

### How to Restart:

1. **Stop current server:**
   - Find terminal running: `$env:PORT=5013; node server.js`
   - Press `Ctrl+C`

2. **Start server:**
   ```powershell
   cd d:\uiux\backend
   $env:PORT=5013; node server.js
   ```

3. **Verify startup:**
   - Should see: "Server running on port 5013"
   - Should see: "Connected to MySQL database"
   - NO errors about missing modules

### Test After Restart:

1. Go to My Matches page
2. Click "Claim Item" on any verified match
3. Fill in proof description
4. (Optional) Upload image
5. Click "Submit Claim Request"
6. Should see success message

## Files Modified

### Backend:
- `middleware/upload.js` (NEW)
- `routes/claimRoutes.js` (UPDATED)
- `controllers/claimController.js` (REWRITTEN)
- `package.json` (multer added)

### Frontend:
- `src/pages/user/ItemClaim.jsx` (REWRITTEN)
- `src/App.jsx` (added /my-matches route)

### Database:
- ItemClaims table (added columns)

## Verification

After restart, check server logs for:
- ✅ No "Cannot find module 'multer'" errors
- ✅ Routes load successfully
- ✅ Claims submit without "Match ID is required" error
