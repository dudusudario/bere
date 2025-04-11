
import React, { useState, useEffect } from 'react';
import ProfileEditSheet from './ProfileEditSheet';
import { useChat } from '../hooks/chat';
import ChatFeed from './ChatFeed';
import { useWhatsappIntegration } from '../hooks/useWhatsappIntegration';
import { useMessageSender } from '../hooks/useMessageSender';
import ChatHeader from './chat/ChatHeader';
import ChatContainer from './chat/ChatContainer';
import MessageInputContainer from './chat/MessageInputContainer';

const ChatInterface: React.FC = () => {
  const userPhone = localStorage.getItem('userPhone') || '';
  const [profileOpen, setProfileOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const { isWhatsGWEnabled } = useWhatsappIntegration();

  const {
    messages,
    isLoading,
    isLoadingHistory,
    selectedFiles,
    chatContainerRef,
    loadMessageHistory,
    handleFileChange,
    removeFile,
    clearFiles,
    toggleFavorite,
    copyMessageToClipboard,
    deleteMessage
  } = useChat();

  const { sendingMessage, handleSendMessage } = useMessageSender({
    userPhone,
    isWhatsGWEnabled,
    selectedFiles
  });

  useEffect(() => {
    const loadHistory = async () => {
      if (userPhone) {
        await loadMessageHistory(userPhone);
        setHistoryLoaded(true);
      } else {
        setHistoryLoaded(true);
      }
    };
    
    loadHistory();
  }, [userPhone, loadMessageHistory]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <ChatHeader 
        userPhone={userPhone}
        isWhatsGWEnabled={isWhatsGWEnabled}
        onOpenProfile={() => setProfileOpen(true)}
      />

      {isWhatsGWEnabled ? (
        <ChatFeed phoneNumber={userPhone} />
      ) : (
        <ChatContainer
          chatContainerRef={chatContainerRef}
          isLoadingHistory={isLoadingHistory}
          historyLoaded={historyLoaded}
          messages={messages}
          isLoading={isLoading}
          toggleFavorite={toggleFavorite}
          copyMessageToClipboard={copyMessageToClipboard}
          handleDeleteMessage={deleteMessage}
        />
      )}

      <MessageInputContainer
        selectedFiles={selectedFiles}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
        onClearFiles={clearFiles}
        onSendMessage={handleSendMessage}
        isLoading={isLoading || sendingMessage}
      />

      <ProfileEditSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};

export default ChatInterface;
