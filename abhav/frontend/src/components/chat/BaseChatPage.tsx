"use client"

// BaseChatPage.tsx - Abstract base component for chat pages
import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import ChatHeader from "@/components/chat/ChatHeader"
import MessageList from "@/components/chat/MessageList"
import MessageInput from "@/components/chat/MessageInput"
import { useChat } from "@/hooks/useChat"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface BaseChatPageProps {
  chatId: string
  isGroup: boolean
  children?: ReactNode
}

export default function BaseChatPage({ chatId, isGroup, children }: BaseChatPageProps) {
  const {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    loadMoreMessages,
    setTypingStatus,
    isTyping,
    clearMessages,
  } = useChat({
    chatId,
    isGroup,
  })
  const { user } = useAuth()
  const router = useRouter()
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  // Current user ID
  const currentUserId = user?.id || "current"

  // Simulate typing indicators
  useEffect(() => {
    if (isTyping) {
      // In a real app, this would come from WebSocket
      const typingUser = isGroup ? "Alice" : chatId === "user1" ? "Alice" : chatId === "user2" ? "Bob" : "Charlie"
      setTypingUsers([typingUser])

      // Clear typing indicator after 3 seconds
      const timeout = setTimeout(() => {
        setTypingUsers([])
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [isTyping, isGroup, chatId])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleAttachmentUpload = async (file: File): Promise<boolean> => {
    try {
      // In a real app, this would upload the file to a server
      // For now, we'll just simulate a successful upload
      toast({
        title: "File uploaded",
        description: `Uploaded: ${file.name}`,
      })
      return true
    } catch (error) {
      console.error("Error uploading file:", error)
      return false
    }
  }

  const handleClearChat = () => {
    const success = clearMessages()
    if (success) {
      toast({
        title: "Chat cleared",
        description: "All messages have been cleared",
        duration: 2000,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to clear chat messages",
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <ChatHeader chatId={chatId} isGroup={isGroup} onClearChat={handleClearChat} />

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-center">{error}</div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        hasMore={hasMore}
        loadMoreMessages={loadMoreMessages}
        currentUserId={currentUserId}
        typingUsers={typingUsers}
      />

      {/* Message input */}
      <MessageInput
        onSendMessage={sendMessage}
        onTyping={setTypingStatus}
        onAttachmentUpload={handleAttachmentUpload}
        disabled={!!error}
      />

      {/* Additional content from child components */}
      {children}
    </div>
  )
}
