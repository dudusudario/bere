
import React from 'react';
import FileUpload from '../FileUpload';
import MessageInput from '../MessageInput';
import { FilePreview } from '../../hooks/chat/types';

interface MessageInputContainerProps {
  selectedFiles: FilePreview[];
  onFileChange: (files: FileList | null) => void;
  onRemoveFile: (fileId: string) => void;
  onClearFiles: () => void;
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

const MessageInputContainer: React.FC<MessageInputContainerProps> = ({
  selectedFiles,
  onFileChange,
  onRemoveFile,
  onClearFiles,
  onSendMessage,
  isLoading
}) => {
  return (
    <div className="border-t p-4 bg-background">
      <FileUpload
        selectedFiles={selectedFiles}
        onFileChange={onFileChange}
        onRemove={onRemoveFile}
        onClear={onClearFiles}
      />
      <MessageInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MessageInputContainer;
