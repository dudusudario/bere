
import React, { useState, useEffect } from 'react';
import { Heart, Copy, Share2, Trash2 } from 'lucide-react';
import { Message } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ChatMessageProps {
  message: Message;
  onToggleFavorite: (messageId: string) => void;
  onCopyToClipboard: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  showTypingAnimation?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onToggleFavorite,
  onCopyToClipboard,
  onDelete,
  showTypingAnimation = false
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(!showTypingAnimation);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  
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
  
  const handleDelete = () => {
    onDelete(message.id);
    setOpenDeleteDialog(false);
  };
  
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
      
      {isComplete && (
        <div className="flex space-x-2">
          {message.sender === 'ai' && (
            <Button 
              onClick={() => onToggleFavorite(message.id)} 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 rounded-full",
                message.isFavorite ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart size={16} fill={message.isFavorite ? "currentColor" : "none"} />
            </Button>
          )}
          <Button 
            onClick={() => onCopyToClipboard(message.id)} 
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
          <Button 
            onClick={() => setOpenDeleteDialog(true)}
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
      
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar Mensagem</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja apagar esta mensagem? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatMessage;
