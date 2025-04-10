
import { toast as sonnerToast } from "sonner";

type ToastProps = {
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
  return { toast };
};
