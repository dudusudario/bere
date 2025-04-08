
import React from 'react';
import { Paperclip, X } from 'lucide-react';
import { FilePreview } from '@/hooks/chat/types';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  selectedFiles: FilePreview[];
  onFileChange: (files: FileList | null) => void;
  onRemove: (fileId: string) => void;
  onClear: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  selectedFiles,
  onFileChange,
  onRemove,
  onClear
}) => {
  return (
    <div>
      <div className="file-input-wrapper">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Paperclip size={20} />
        </Button>
        <input 
          type="file"
          multiple
          className="file-input"
          onChange={(e) => onFileChange(e.target.files)}
          accept="image/*, video/*, application/pdf"
        />
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto p-2">
          {selectedFiles.map((file) => (
            <div 
              key={file.id}
              className="relative group rounded-md bg-secondary p-1"
            >
              {file.type === 'image' ? (
                <img 
                  src={file.preview} 
                  alt="Preview" 
                  className="h-16 w-16 object-cover rounded"
                />
              ) : file.type === 'video' ? (
                <div className="h-16 w-16 bg-muted flex items-center justify-center rounded">
                  <span className="text-xs text-center">Vídeo</span>
                </div>
              ) : (
                <div className="h-16 w-16 bg-muted flex items-center justify-center rounded">
                  <span className="text-xs text-center">PDF</span>
                </div>
              )}
              <button 
                onClick={() => onRemove(file.id)}
                className="absolute -top-2 -right-2 bg-foreground text-primary-foreground rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
