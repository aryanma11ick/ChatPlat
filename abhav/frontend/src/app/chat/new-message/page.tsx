"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import chatService from "@/services/ChatService"
import type { IUser } from "@/lib/types/chat"

export default function NewMessagePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<IUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call to get all users
        const mockUsers = [
          await chatService.getUser("user1"),
          await chatService.getUser("user2"),
          await chatService.getUser("user3"),
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUsers()
    }
  }, [user])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter((u) => u.username.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  if (isLoading || loading) {
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 border-b bg-white dark:bg-slate-900 flex items-center">
          <Link href="/chat" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">New Message</h1>
        </header>

        {/* Search */}
        <div className="p-4 border-b bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <Link key={u.id} href={`/chat/individual/${u.id}`}>
                <div className="p-4 border-b hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={u.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{u.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.username}</p>
                      <p className="text-sm text-slate-500">{u.status === "online" ? "Online" : "Offline"}</p>
                    </div>
                  </div>
                  <MessageSquare className="h-5 w-5 text-slate-400" />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-slate-500">
              {searchQuery ? "No users found" : "No users available"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
