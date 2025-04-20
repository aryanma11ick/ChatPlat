// GroupChatPage.tsx - Page for group chat
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import BaseChatPage from "@/components/chat/BaseChatPage"
import Sidebar from "@/components/chat/Sidebar"
import type { IGroup } from "@/lib/types/chat"
import chatService from "@/services/ChatService"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function GroupChatPage() {
  const params = useParams()
  const groupId = params.groupId as string
  const [group, setGroup] = useState<IGroup | null>(null)
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
    const fetchGroup = async () => {
      try {
        setLoading(true)
        const groupData = await chatService.getGroup(groupId)
        setGroup(groupData)
      } catch (error) {
        console.error("Error fetching group:", error)
      } finally {
        setLoading(false)
      }
    }

    if (groupId && currentUser) {
      fetchGroup()
    }
  }, [groupId, currentUser])

  if (authLoading || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  if (!group) {
    return <div className="flex h-screen items-center justify-center">Group not found</div>
  }

  return (
    <div className="flex h-screen">
      <Sidebar activeChat={groupId} />
      <BaseChatPage chatId={groupId} isGroup={true} />
    </div>
  )
}
