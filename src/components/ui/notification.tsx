
import * as React from "react"
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  X
} from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const notificationVariants = cva(
  "relative w-full rounded-lg border p-4 pr-10 flex items-center gap-3 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface NotificationProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string
  description?: string
  onClose?: () => void
}

export function Notification({
  className,
  variant,
  title,
  description,
  onClose,
  ...props
}: NotificationProps) {
  const IconComponent = React.useMemo(() => {
    switch(variant) {
      case "success":
        return CheckCircle2
      case "error":
        return AlertCircle
      case "warning":
        return AlertTriangle
      case "info":
        return Info
      default:
        return Info
    }
  }, [variant])

  return (
    <div
      className={cn(notificationVariants({ variant }), className)}
      role="alert"
      {...props}
    >
      <IconComponent className="h-5 w-5" />
      <div className="flex-1">
        {title && <h5 className="font-medium">{title}</h5>}
        {description && <div className="text-sm mt-1">{description}</div>}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
