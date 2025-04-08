
import { useState, useCallback } from 'react';
import { FilePreview } from './types';
import { generateId } from './utils';

export const useFileHandler = () => {
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles: FilePreview[] = [];
    
    Array.from(files).forEach(file => {
      const fileType = file.type.split('/')[0];
      let type: 'image' | 'video' | 'document';
      
      if (fileType === 'image') {
        type = 'image';
      } else if (fileType === 'video') {
        type = 'video';
      } else {
        type = 'document';
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        newFiles.push({
          id: generateId(),
          file,
          preview: reader.result as string,
          type
        });
        
        if (newFiles.length === files.length) {
          setSelectedFiles(prev => [...prev, ...newFiles]);
        }
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  return {
    selectedFiles,
    handleFileChange,
    removeFile,
    clearFiles
  };
};
