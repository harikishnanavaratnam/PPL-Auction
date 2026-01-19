# Player Import Guide

## Why Players Are Not Loading

Players need to be **imported from the local PLAYERS folder** before they appear in the auction. The images in your `Frontend/public/PLAYERS` folder won't automatically appear - you need to trigger the import.

## Steps to Import Players

### 1. **Add Player Images to Local Folder**

1. Place all player images in `Frontend/public/PLAYERS/` folder
2. Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
3. File naming: The filename (without extension) will be used as the player name
   - Example: `001.png` → Player name: `001`
   - Example: `John Doe.png` → Player name: `John Doe`

### 2. **Import Players from Admin Panel**

1. Go to `/admin` page (login required)
2. Click the **"Import Players from Drive"** button (now imports from local folder)
3. Confirm the import
4. Wait for the import to complete
5. Players should now appear in the database

### 3. **Verify Import**

- Check the Players page (`/players`) - should show all imported players
- Check the Admin panel - should show players when selecting "Next Player"

## Import Details

- **Player Name**: Extracted from image filename (without extension)
- **Base Price**: Set to 100 (per auction rules)
- **Status**: Set to "Unsold"
- **Image**: Stored as local path `/PLAYERS/{filename}`

## Troubleshooting

### Error: "No image files found in Frontend/public/PLAYERS folder"
- **Fix**: 
  1. Make sure the `Frontend/public/PLAYERS` folder exists
  2. Add image files (PNG, JPG, etc.) to the folder
  3. Check file permissions

### Error: "Failed to import players"
- **Fix**: 
  1. Verify the folder path is correct: `Frontend/public/PLAYERS`
  2. Make sure image files are valid (not corrupted)
  3. Check backend console for detailed error messages

### Players imported but images not showing
- **Fix**: 
  1. Verify images are in `Frontend/public/PLAYERS` folder
  2. Check that image paths match: `/PLAYERS/{filename}`
  3. Check browser console for image loading errors
  4. Ensure Next.js can serve static files from `/public` folder

## Manual Import via API

You can also import via API call:
```bash
POST http://localhost:5000/api/auction/import-players
Authorization: Bearer YOUR_TOKEN
```

## After Import

Once players are imported:
1. They will appear in the Players page
2. You can select them in the Admin panel
3. They will be available for auction with base price of 100