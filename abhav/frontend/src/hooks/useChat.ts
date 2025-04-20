"use client"

// useChat.ts - Custom hook for chat functionality
import { useState, useEffect, useCallback } from "react"
import type { IChatState, IMessagePayload } from "@/lib/types/chat"
import chatService from "@/services/ChatService"

interface UseChatProps {
  chatId: string
  isGroup: boolean
}

// Mock data (replace with actual data fetching)
const MOCK_GROUP_MESSAGES: { [chatId: string]: any[] } = {}
const MOCK_INDIVIDUAL_MESSAGES: { [chatId: string]: any[] } = {}

export function useChat({ chatId, isGroup }: UseChatProps) {
  const [state, setState] = useState<IChatState>({
    messages: [],
    isLoading: true,
    error: null,
    hasMore: true,
  })

  const [isTyping, setIsTyping] = useState(false)

  // Load initial messages
  useEffect(() => {
    let isMounted = true

    const loadMessages = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))
        const messages = await chatService.getMessages(chatId, isGroup)

        if (isMounted) {
          setState({
            messages,
            isLoading: false,
            error: null,
            hasMore: messages.length >= 20, // Assume there are more if we got a full page
          })
        }
      } catch (error) {
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to load messages",
          }))
        }
      }
    }

    loadMessages()

    // Subscribe to new messages
    const unsubscribe = chatService.subscribeToMessages(chatId, (newMessage) => {
      if (isMounted) {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }))
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [chatId, isGroup])

  // Load more messages (for infinite scrolling)
  const loadMoreMessages = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return

    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const oldestMessage = state.messages[0]
      const olderMessages = await chatService.getMessages(chatId, isGroup, 20, oldestMessage?.timestamp)

      setState((prev) => ({
        messages: [...olderMessages, ...prev.messages],
        isLoading: false,
        error: null,
        hasMore: olderMessages.length >= 20,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load more messages",
      }))
    }
  }, [chatId, isGroup, state.isLoading, state.hasMore, state.messages])

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        const payload: IMessagePayload = {
          content,
          recipientId: chatId,
          type: "text",
          isGroupChat: isGroup,
        }

        await chatService.sendMessage(payload)
        return true
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to send message",
        }))
        return false
      }
    },
    [chatId, isGroup],
  )

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    try {
      await chatService.markAsRead(messageIds)
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }, [])

  // Simulate typing indicator
  const setTypingStatus = useCallback(
    async (typing: boolean) => {
      setIsTyping(typing)
      await chatService.simulateTyping(chatId, typing)
    },
    [chatId],
  )

  // Clear all messages
  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
    }))

    // Clear messages from storage
    if (isGroup) {
      if (MOCK_GROUP_MESSAGES[chatId]) {
        MOCK_GROUP_MESSAGES[chatId] = []
      }
    } else {
      if (MOCK_INDIVIDUAL_MESSAGES[chatId]) {
        MOCK_INDIVIDUAL_MESSAGES[chatId] = []
      }
    }

    // TODO: Connect to API for clearing chat messages
    // await api.clearChatMessages(chatId, isGroup);

    return true
  }, [chatId, isGroup])

  return {
    ...state,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    isTyping,
    setTypingStatus,
    clearMessages,
  }
}
