
import { useMessageHistory } from './messageHistory';
import { useFileHandler } from './fileHandler';
import { useChatMessages } from './useChatMessages';
import { useChatSender } from './useChatSender';

export const useChat = () => {
  const { 
    messages, 
    isLoading, 
    chatContainerRef, 
    addMessage, 
    setMessages, 
    toggleFavorite, 
    copyMessageToClipboard, 
    deleteMessage 
  } = useChatMessages();
  
  const { selectedFiles, handleFileChange, removeFile, clearFiles } = useFileHandler();
  const { sendMessage } = useChatSender({ addMessage, selectedFiles, clearFiles });
  
  const { isLoadingHistory, loadMessageHistory } = useMessageHistory(() => {
    // This will be used as a callback after loading messages
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  });

  // Function to load historical messages and set them
  const loadAndSetMessageHistory = async (userPhone: string) => {
    const historyMessages = await loadMessageHistory(userPhone);
    if (historyMessages.length > 0) {
      setMessages(historyMessages);
    }
  };

  return {
    messages,
    isLoading,
    isLoadingHistory,
    selectedFiles,
    chatContainerRef,
    sendMessage,
    loadMessageHistory: loadAndSetMessageHistory,
    handleFileChange,
    removeFile,
    clearFiles,
    toggleFavorite,
    copyMessageToClipboard,
    deleteMessage
  };
};

export default useChat;
