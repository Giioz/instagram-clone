# UploadThing Setup for Story Uploads

This project now uses UploadThing for efficient file uploads instead of base64 encoding.

## Environment Setup

Add this to your `.env` file:

```
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

## How to get UploadThing Token

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new project
3. Get your token from the dashboard
4. Add it to your `.env` file

## What was implemented

1. **FileRouter** (`src/app/api/uploadthing/core.ts`):
   - Handles image (16MB max) and video (64MB max) uploads
   - Uses JWT authentication from existing auth system
   - Returns uploaded file URLs

2. **API Route** (`src/app/api/uploadthing/route.ts`):
   - Next.js API route for UploadThing

3. **Upload Components**:
   - `src/utils/uploadthing.ts` - Generated UploadButton and UploadDropzone components
   - `src/modules/stories/components/StoryUploader.tsx` - Story-specific upload component
   - Updated `useStoryUpload` hook to use UploadThing
   - Updated `StoryUploadModal` to include UploadThing button

4. **Benefits over base64**:
   - Much faster uploads
   - No base64 encoding overhead
   - Proper file handling
   - Cloud storage
   - Better error handling

## Usage

The story upload modal now shows two options:
1. **UploadThing button** - Recommended, uses cloud storage
2. **Legacy file input** - Fallback, uses object URLs

Both methods work, but UploadThing is much more efficient.
