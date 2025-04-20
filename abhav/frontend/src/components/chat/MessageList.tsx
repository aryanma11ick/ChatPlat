"use client"

// MessageList.tsx - Component for rendering a list of messages
import { useRef, useEffect } from "react"
import MessageItem from "./MessageItem"
import type { IMessage } from "@/lib/types/chat"

interface MessageListProps {
  messages: IMessage[]
  isLoading: boolean
  hasMore: boolean
  loadMoreMessages: () => Promise<void>
  currentUserId: string
  typingUsers?: string[]
}

export default function MessageList({
  messages,
  isLoading,
  hasMore,
  loadMoreMessages,
  currentUserId,
  typingUsers = [],
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadTriggerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length, typingUsers.length])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMessages()
        }
      },
      { threshold: 0.5 },
    )

    if (loadTriggerRef.current) {
      observerRef.current.observe(loadTriggerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, loadMoreMessages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadTriggerRef} className="h-10 flex items-center justify-center">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
          ) : (
            <div className="text-sm text-slate-500">Scroll up to load more</div>
          )}
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} isCurrentUser={message.senderId === currentUserId} />
      ))}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-start gap-3 mb-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-slate-500">
              {typingUsers.length === 1 ? `${typingUsers[0]} is typing...` : `${typingUsers.join(", ")} are typing...`}
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
          <p>No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      )}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}
