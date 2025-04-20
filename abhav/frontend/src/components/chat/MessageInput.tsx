"use client"

import type React from "react"

// MessageInput.tsx - Component for message input
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Smile, Paperclip } from "lucide-react"
import contentModerationService from "@/services/ContentModerationService"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import EmojiPicker from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<boolean>
  onTyping: (isTyping: boolean) => void
  onAttachmentUpload: (file: File) => Promise<boolean>
  disabled?: boolean
}

export default function MessageInput({
  onSendMessage,
  onTyping,
  onAttachmentUpload,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [moderationError, setModerationError] = useState<string | null>(null)
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle typing indicator
  useEffect(() => {
    if (message && !typingTimeoutRef.current) {
      onTyping(true)
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
        typingTimeoutRef.current = null
      }, 3000)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
      }
    }
  }, [message, onTyping])

  // Clear moderation error when message changes
  useEffect(() => {
    if (moderationError) {
      setModerationError(null)
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isSending || disabled) return

    // Check content moderation
    const moderationResult = contentModerationService.checkContent(message.trim())
    if (!moderationResult.isAppropriate) {
      setModerationError("Your message contains words that violate our content policy. Please revise your message.")

      // Show toast notification
      toast({
        title: "Content Policy Violation",
        description: "This message violates our content policy. Please edit your message.",
        variant: "destructive",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      })

      return
    }

    try {
      setIsSending(true)
      const success = await onSendMessage(message.trim())

      if (success) {
        setMessage("")
        // Focus the input after sending
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    } finally {
      setIsSending(false)
      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = null
        onTyping(false)
      }
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0
      const end = inputRef.current.selectionEnd || 0
      const newMessage = message.substring(0, start) + emojiData.emoji + message.substring(end)
      setMessage(newMessage)

      // Show toast notification
      toast({
        title: "Emoji added",
        description: `Added emoji: ${emojiData.emoji}`,
        duration: 1500,
      })

      // Focus the input and set cursor position after the inserted emoji
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          const newCursorPos = start + emojiData.emoji.length
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        }
      }, 0)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should not exceed 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSending(true)
      const success = await onAttachmentUpload(file)
      if (success) {
        toast({
          title: "File uploaded",
          description: "Your file has been uploaded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
      setIsAttachmentDialogOpen(false)
    }
  }

  return (
    <div className="p-4 border-t bg-white dark:bg-slate-900">
      {moderationError && (
        <div className="mb-2 p-2 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm">
          {moderationError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          title="Attach file"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </Button>

        <Input
          ref={inputRef}
          placeholder="Type your message..."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled || isSending}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" disabled={disabled} title="Add emoji">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </PopoverContent>
        </Popover>

        <Button type="submit" disabled={!message.trim() || isSending || disabled}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
