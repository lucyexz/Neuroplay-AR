# MindAR Image Targets

This folder contains the `.mind` files used for image tracking in the AR Reader feature.

## Required Files

You need to create three `.mind` files using the MindAR Image Tracking Compiler:

1. **bandaid.mind** - For detecting band-aid/curativo cards (redirects to Vacinação Amiga)
2. **school.mind** - For detecting school supplies (redirects to Mochila Interativa)
3. **tooth.mind** - For detecting teeth/toothbrush cards (redirects to Escovação)

## How to Create .mind Files

### Method 1: Using MindAR Image Tracking Compiler (Recommended)

1. Visit: https://hiukim.github.io/mind-ar-js-doc/tools/compile
2. Upload your target image(s)
3. Click "Start" to compile
4. Download the generated `.mind` file
5. Place it in this folder with the correct name

### Method 2: Using mind-ar-js CLI

```bash
npx mind-ar-js-compiler
```

Follow the prompts to select your images and generate the `.mind` files.

## Target Image Guidelines

For best tracking results, your target images should:

- Be high contrast with clear features
- Have good texture and patterns
- Not be too plain or too complex
- Be at least 480x640 pixels
- Work well in various lighting conditions
- Not be too reflective or glossy

## Example Target Images

### Band-Aid Card (bandaid.mind)
- A colorful band-aid illustration
- Medical cross symbol
- Vaccine-related imagery

### School Supplies Card (school.mind)
- Backpack
- Notebook
- Pencils
- School-related items

### Tooth Card (tooth.mind)
- Tooth illustration
- Toothbrush
- Dental hygiene imagery

## File Structure

After adding your `.mind` files, this folder should contain:

```
/public/targets/
  ├── README.md (this file)
  ├── bandaid.mind
  ├── school.mind
  └── tooth.mind
```

## Testing Your Targets

1. Print or display your target images
2. Open the AR Reader feature in the app
3. Point your camera at the printed image
4. The app should detect and redirect automatically

## Troubleshooting

If tracking is not working:

- Ensure good lighting
- Hold camera steady
- Make sure image is in focus
- Check that the `.mind` file matches the physical image
- Try different distances (20-40cm works best)
- Ensure target image is not too small

## Notes

- The `.mind` files are binary compiled versions of your target images
- They are optimized for fast detection
- Each file contains feature points extracted from your target image
- These files work on both iOS and Android in PWA mode
