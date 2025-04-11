
import React, { useState, useEffect } from 'react';
import ProfileEditSheet from './ProfileEditSheet';
import { useChat } from '../hooks/chat';
import ChatFeed from './ChatFeed';
import ChatHeader from './chat/ChatHeader';
import ChatContainer from './chat/ChatContainer';
import MessageInputContainer from './chat/MessageInputContainer';

const ChatInterface: React.FC = () => {
  const userPhone = localStorage.getItem('userPhone') || '';
  const [profileOpen, setProfileOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

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
    deleteMessage,
    sendMessage
  } = useChat();

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

  const handleSendMessage = (content: string) => {
    sendMessage(content, userPhone);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <ChatHeader 
        userPhone={userPhone}
        onOpenProfile={() => setProfileOpen(true)}
      />

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

      <MessageInputContainer
        selectedFiles={selectedFiles}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
        onClearFiles={clearFiles}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />

      <ProfileEditSheet open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};

export default ChatInterface;
