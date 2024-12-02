export interface UploadedFile {
  id: string;
  name: string;
  content: string;  // base64 encoded
  type: string;
  size: number;
  uploadedAt: number;
}

export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';