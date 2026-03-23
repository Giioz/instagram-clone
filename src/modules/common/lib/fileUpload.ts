import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest } from 'next/server';

export async function saveFile(file: File, folder: string = 'stories'): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name}`;
  const path = join(process.cwd(), 'public', 'uploads', folder, filename);
  
  await writeFile(path, buffer);
  
  return `/uploads/${folder}/${filename}`;
}

export async function getFileFromRequest(request: NextRequest): Promise<File | null> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return null;
    }
    
    return file;
  } catch (error) {
    console.error('Error parsing file from request:', error);
    return null;
  }
}
