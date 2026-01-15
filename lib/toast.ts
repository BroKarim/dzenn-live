import { toastManager } from "@/components/ui/toast";

type ToastType = "success" | "error" | "info" | "warning" | "loading";

export function toast({
  title,
  description,
  type = "info",
  duration = 5000,
}: {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}) {
  return toastManager.add({
    title,
    description,
    type,
    timeout: duration,
  });
}

export const toastSuccess = (title: string, description?: string) =>
  toast({ title, description, type: "success" });

export const toastError = (title: string, description?: string) =>
  toast({ title, description, type: "error" });

export const toastInfo = (title: string, description?: string) =>
  toast({ title, description, type: "info" });

export const toastWarning = (title: string, description?: string) =>
  toast({ title, description, type: "warning" });

export const toastLoading = (title: string, description?: string) =>
  toast({ title, description, type: "loading" });

