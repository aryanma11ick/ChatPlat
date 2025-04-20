// IndividualChatPage.tsx - Page for individual chat
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import BaseChatPage from "@/components/chat/BaseChatPage"
import Sidebar from "@/components/chat/Sidebar"
import type { IUser } from "@/lib/types/chat"
import chatService from "@/services/ChatService"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function IndividualChatPage() {
  const params = useParams()
  const userId = params.userId as string
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { user: currentUser, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser && !authLoading) {
      router.push("/login")
    }
  }, [currentUser, authLoading, router])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await chatService.getUser(userId)
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId && currentUser) {
      fetchUser()
    }
  }, [userId, currentUser])

  if (authLoading || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">User not found</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar activeChat={userId} />
      <BaseChatPage chatId={userId} isGroup={false} />
    </div>
  )
}
