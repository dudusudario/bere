
import { File } from "@web-std/file";

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isFavorite: boolean;
  files?: File[];
};

export type FilePreview = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
};

// Define database message type to match our Supabase schema
export type DbMessage = {
  id: string;
  user_phone: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  is_favorite: boolean;
  files: any | null;
}
