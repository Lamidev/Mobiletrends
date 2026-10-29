'use client';

import { toast as sonnerToast } from "sonner";

/**
 * Compatibility adapter that routes legacy shadcn `toast({ title, description, variant })`
 * calls directly to Sonner, while also supporting direct `sonner` methods (`toast.success`, `toast.error`, etc.).
 */
function toast(props) {
  if (typeof props === "string") {
    return sonnerToast(props);
  }

  const { title, description, variant, action, ...rest } = props || {};
  const message = title || description || "Notification";
  const options = {
    description: title && description ? description : undefined,
    action,
    ...rest,
  };

  if (variant === "destructive") {
    const id = sonnerToast.error(message, options);
    return {
      id,
      dismiss: () => sonnerToast.dismiss(id),
      update: () => {},
    };
  }

  const isSuccess =
    typeof title === "string" &&
    /success|added|updated|verified|completed|copied|sent/i.test(title);

  const id = isSuccess
    ? sonnerToast.success(message, options)
    : sonnerToast(message, options);

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: () => {},
  };
}

// Attach standard Sonner helper methods (toast.success, toast.error, toast.info, toast.warning, toast.loading, toast.promise, toast.dismiss)
Object.assign(toast, sonnerToast);

function useToast() {
  return {
    toast,
    toasts: [],
    dismiss: (toastId) => sonnerToast.dismiss(toastId),
  };
}

export { useToast, toast };
