import { toast as sonner } from "sonner";

type ToastOptions = {
  description?: string;
  duration?: number;
  onDismiss?: () => void;
  onAutoClose?: () => void;
};

const defaultDurations = {
  success: 3000,
  error: 4500,
  warning: 4000,
  info: 3500,
} as const;

function baseOptions(opts?: ToastOptions) {
  return {
    description: opts?.description,
    duration: opts?.duration,
    onDismiss: opts?.onDismiss,
    onAutoClose: opts?.onAutoClose,
    classNames: {
      toast:
        "group toast border border-slate-200/80 bg-white text-slate-900 shadow-lg shadow-slate-200/60 rounded-xl font-poppins",
      title: "text-sm font-semibold text-slate-900",
      description: "text-sm text-slate-600",
      actionButton:
        "bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-emerald-700 transition-colors",
      cancelButton:
        "bg-slate-100 text-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-slate-200 transition-colors",
      closeButton:
        "border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors",
    },
  };
}

export const notify = {
  success(title: string, description?: string, opts?: ToastOptions) {
    return sonner.success(title, {
      ...baseOptions(opts),
      duration: opts?.duration ?? defaultDurations.success,
    });
  },

  error(title: string, description?: string, opts?: ToastOptions) {
    return sonner.error(title, {
      ...baseOptions(opts),
      duration: opts?.duration ?? defaultDurations.error,
    });
  },

  warning(title: string, description?: string, opts?: ToastOptions) {
    return sonner.warning(title, {
      ...baseOptions(opts),
      duration: opts?.duration ?? defaultDurations.warning,
    });
  },

  info(title: string, description?: string, opts?: ToastOptions) {
    return sonner.info(title, {
      ...baseOptions(opts),
      duration: opts?.duration ?? defaultDurations.info,
    });
  },

  loading(title: string, description?: string) {
    return sonner.loading(title, {
      description,
      classNames: baseOptions().classNames,
    });
  },

  dismiss(id?: string | number) {
    sonner.dismiss(id);
  },

  /** Drop-in replacement for Swal.fire("Title", "message", "type") */
  show(
    title: string,
    description?: string,
    type: "success" | "error" | "warning" | "info" = "info",
    opts?: ToastOptions
  ) {
    return notify[type](title, description, opts);
  },
};
