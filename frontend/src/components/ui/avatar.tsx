import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & {
    src?: string
    alt?: string
}
>(({ className, src, alt, children, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}
        {...props}
    >
    {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full" />
    ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
        {children}
      </span>
    )}
  </span>
))

const AvatarImage = React.forwardRef<
    HTMLImageElement,
    React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
    <img
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
))

const AvatarFallback = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700",
            className
        )}
        {...props}
    />
))

export { Avatar, AvatarImage, AvatarFallback }