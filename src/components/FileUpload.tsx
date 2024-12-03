import { useState, useRef, DragEvent } from 'react';
import { X, File as FileIcon, AlertCircle, Image } from 'lucide-react';
import { FileStatus } from '../types/files';

interface FileUploadProps {
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export function FileUpload({ onClose, onUpload }: FileUploadProps) {
  const [status, setStatus] = useState<FileStatus>('idle');
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
  };

  const validateFile = (file: File): string | null => {
    const ALLOWED_TYPES = [
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      return '不支持的文件类型。请上传 TXT、MD、DOC、DOCX、PDF 或 JPG、PNG、GIF、WebP、SVG 图片。';
    }
    if (file.size > MAX_SIZE) {
      return '文件大小不能超过 5MB。';
    }
    return null;
  };

  const processFile = async (file: File): Promise<void> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus('error');
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    try {
      setError('');
      setStatus('uploading');
      await onUpload(file);
      setStatus('success');
      setTimeout(onClose, 1000);
    } catch (err) {
      setError('上传文件时发生错误，请重试。');
      setStatus('error');
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>): Promise<void> => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-pop"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 
            transition-all duration-200 transform hover:scale-110 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 animate-slide-in">上传文件</h2>

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center
            transition-all duration-200
            ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${status === 'error' ? 'border-red-500 bg-red-50' : ''}
            ${status === 'success' ? 'border-green-500 bg-green-50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.md,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif,.webp,.svg"
            className="hidden"
          />

          {status === 'idle' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-center gap-2">
                <FileIcon className="w-12 h-12 text-gray-400" />
                <Image className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  拖放文件到这里，或者
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 mx-1"
                  >
                    点击上传
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  支持文档格式：TXT、MD、DOC、DOCX、PDF
                </p>
                <p className="text-sm text-gray-500">
                  支持图片格式：JPG、PNG、GIF、WebP、SVG
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  最大文件大小：5MB
                </p>
              </div>
            </div>
          )}

          {status === 'uploading' && (
            <div className="space-y-4 animate-pulse">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto object-contain" />
              ) : (
                <FileIcon className="w-12 h-12 text-blue-500 mx-auto" />
              )}
              <p className="text-blue-600">正在上传...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4 animate-bounce-in">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto object-contain" />
              ) : (
                <FileIcon className="w-12 h-12 text-green-500 mx-auto" />
              )}
              <p className="text-green-600">上传成功！</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 animate-shake">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={() => {
                    setStatus('idle');
                    setError('');
                    setPreviewUrl(null);
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  重试
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}