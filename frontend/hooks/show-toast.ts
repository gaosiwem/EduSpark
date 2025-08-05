"use client";

import { toast as sonnerToast } from "sonner";
import type { ReactNode } from "react";

// Optional custom types
type ToastType = "success" | "error" | "info" | "warning" | "default";

interface ShowToastProps {
  title: string | ReactNode;
  description?: string | ReactNode;
  type?: ToastType;
  duration?: number;
  position: string
}

export function showToast({
  title,
  description, 
  duration = 4000,
  type="default",
  position="top-right",
}: ShowToastProps) {
  // Use toast[type] if available, fallback to toast()
  const toastFn =
    typeof sonnerToast[type] === "function" ? sonnerToast[type] : sonnerToast;

  toastFn(title, {
    description,
    duration,
    type,
    position
  });
}
