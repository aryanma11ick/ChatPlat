"use client"

import { Button } from "@/components/ui/button"
import { Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/chat/Sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ChatPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area - Welcome Screen */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to ChatPlat</h2>
          <p className="text-slate-500 mb-6">
            Select a conversation from the sidebar or start a new chat to begin messaging.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat/new-group">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                New Group Chat
              </Button>
            </Link>
            <Link href="/chat/new-message">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
