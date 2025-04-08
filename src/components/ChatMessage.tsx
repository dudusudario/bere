
import React, { useState, useEffect } from 'react';
import { Heart, Copy, Share2 } from 'lucide-react';
import { Message } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  toggleFavorite: (messageId: string) => void;
  copyMessage: (messageId: string) => void;
  showTypingAnimation?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  toggleFavorite,
  copyMessage,
  showTypingAnimation = false
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(!showTypingAnimation);
  
  useEffect(() => {
    if (!showTypingAnimation) {
      setDisplayText(message.content);
      setIsComplete(true);
      return;
    }
    
    let index = 0;
    const content = message.content;
    setDisplayText('');
    
    const typingInterval = setInterval(() => {
      if (index < content.length) {
        setDisplayText((prev) => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsComplete(true);
      }
    }, 15);
    
    return () => clearInterval(typingInterval);
  }, [message.content, showTypingAnimation]);
  
  return (
    <div 
      className={cn(
        'flex flex-col gap-1 mb-4 animate-fade-in',
        message.sender === 'user' ? 'items-end' : 'items-start'
      )}
    >
      <div 
        className={cn(
          'message-bubble',
          message.sender === 'user' ? 'message-user' : 'message-ai'
        )}
      >
        {message.files && message.files.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.files.map((file, index) => {
              const isImage = file.type.startsWith('image/');
              const isVideo = file.type.startsWith('video/');
              const isPdf = file.type === 'application/pdf';
              
              return (
                <div key={index} className="relative">
                  {isImage && (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Uploaded" 
                      className="max-w-[120px] max-h-[120px] rounded-md"
                    />
                  )}
                  {isVideo && (
                    <div className="w-[120px] h-[80px] bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-xs">Vídeo</span>
                    </div>
                  )}
                  {isPdf && (
                    <div className="w-[120px] h-[80px] bg-gray-200 flex items-center justify-center rounded-md">
                      <span className="text-xs">PDF</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="whitespace-pre-wrap">
          {displayText}
        </div>
      </div>
      
      {message.sender === 'ai' && isComplete && (
        <div className="flex space-x-2">
          <Button 
            onClick={() => toggleFavorite(message.id)} 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full",
              message.isFavorite ? "text-red-500" : "text-muted-foreground"
            )}
          >
            <Heart size={16} fill={message.isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button 
            onClick={() => copyMessage(message.id)} 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-muted-foreground"
          >
            <Copy size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-muted-foreground"
          >
            <Share2 size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
