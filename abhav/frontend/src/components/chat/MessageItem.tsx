"use client"

// MessageItem.tsx - Component for rendering individual messages
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { IMessage, IUser } from "@/lib/types/chat"
import { formatDistanceToNow } from "date-fns"
import chatService from "@/services/ChatService"
import { Check, CheckCheck, FileText, Info } from "lucide-react"

interface MessageItemProps {
  message: IMessage
  isCurrentUser: boolean
}

export default function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const [sender, setSender] = useState<IUser | null>(null)

  useEffect(() => {
    // Only fetch sender info if it's not the current user
    if (!isCurrentUser && message.type !== "system") {
      const fetchSender = async () => {
        try {
          const user = await chatService.getUser(message.senderId)
          setSender(user)
        } catch (error) {
          console.error("Error fetching sender:", error)
        }
      }

      fetchSender()
    }
  }, [message.senderId, isCurrentUser, message.type])

  // Format timestamp
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })

  // Render system message
  if (message.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-500 dark:text-slate-400 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          {message.content}
        </div>
      </div>
    )
  }

  // Render message status indicator
  const renderStatus = () => {
    if (!isCurrentUser) return null

    switch (message.status) {
      case "sent":
        return <Check className="h-3 w-3 text-slate-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-slate-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  // Render message content based on type
  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <p>{message.content}</p>
      case "image":
        return (
          <div className="space-y-1">
            <div className="relative rounded-lg overflow-hidden">
              <img src={message.imageUrl || "/placeholder.svg"} alt="Image message" className="max-w-xs rounded-lg" />
            </div>
            {message.caption && <p className="text-sm text-slate-500">{message.caption}</p>}
          </div>
        )
      case "file":
        return (
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{message.fileName}</p>
              <p className="text-xs text-slate-500">{(message.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )
      default:
        return <p>Unsupported message type</p>
    }
  }

  return (
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender?.avatar || "/placeholder.svg"} />
          <AvatarFallback>{sender?.username.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
        </Avatar>
      )}

      <div className={isCurrentUser ? "text-right" : ""}>
        <div className={`flex items-baseline gap-2 ${isCurrentUser ? "justify-end" : ""}`}>
          {!isCurrentUser && <p className="font-bold text-sm">{sender?.username || "Unknown"}</p>}
          <p className="text-xs text-slate-500">{formattedTime}</p>
          {isCurrentUser && <p className="font-bold text-sm">You</p>}
        </div>

        <div
          className={`mt-1 p-3 rounded-lg inline-block max-w-md ${
            isCurrentUser ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
          }`}
        >
          {renderContent()}
        </div>

        <div className="flex items-center justify-end mt-1 h-3">{renderStatus()}</div>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/user.jpg" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
