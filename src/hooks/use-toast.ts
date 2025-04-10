
import { toast as sonnerToast } from "sonner";
import { useState } from "react";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

type Toast = {
  id: string | number;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

export function toast({
  title,
  description,
  action,
  variant = "default",
  duration = 5000,
}: ToastProps) {
  return sonnerToast(title, {
    description,
    action,
    duration,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
  });
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // This is a mock implementation to satisfy the type requirements
  // In a real app, this would manage the toast state
  
  return { 
    toast,
    toasts // Added to fix the type error
  };
};
