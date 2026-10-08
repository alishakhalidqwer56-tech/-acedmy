import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from './Button';

export interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  accept?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  helperText,
  accept = 'image/*',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setIsUploading(true);

    // Read as Data URL and upload to server
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: result, filename: file.name }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            onChange(data.url);
            setIsUploading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Server upload fallback to data URL:', err);
      }
      // Fallback
      onChange(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setIsUrlMode(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-300">{label}</label>
          <button
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isUrlMode ? 'Switch to Upload' : 'Enter Image URL'}
          </button>
        </div>
      )}

      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#2a2a3e] bg-[#12121e] group aspect-video max-h-56 flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-purple-600/90 text-white hover:bg-purple-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <UploadCloud className="w-4 h-4" /> Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl bg-rose-600/90 text-white hover:bg-rose-600 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4" /> Remove
            </button>
          </div>
        </div>
      ) : isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 bg-[#141422] border border-[#2a2a3e] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleUrlSubmit}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Set
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-[#2a2a3e] bg-[#141422]/60 hover:border-purple-500/50 hover:bg-[#161628]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-purple-300 font-medium">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-200">
                  <span className="text-purple-400 underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
        className="hidden"
      />

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
