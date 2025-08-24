import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/ui/button"
import { X } from "lucide-react"

interface PopupWrapperProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  showCloseButton?: boolean
  className?: string
}

export const PopupWrapper: React.FC<PopupWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className={cn(
        "relative w-full mx-4 bg-background border border-border rounded-lg shadow-lg",
        sizeClasses[size],
        className
      )}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            {title && (
              <h2 className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Usage Example Component
export const PopupExample = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Open Popup
      </Button>
      
      <PopupWrapper
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Popup"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This is an example popup content. You can put any content here!
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </PopupWrapper>
    </div>
  )
}
