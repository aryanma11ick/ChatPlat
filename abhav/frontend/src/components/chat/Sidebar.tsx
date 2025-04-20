"use client"

// Sidebar.tsx - Sidebar component for chat navigation
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, Search, Plus, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { IUser, IGroup } from "@/lib/types/chat"
import chatService from "@/services/ChatService"
import { useAuth } from "@/contexts/AuthContext"

interface SidebarProps {
  activeChat?: string
}

export default function Sidebar({ activeChat }: SidebarProps) {
  const [users, setUsers] = useState<IUser[]>([])
  const [groups, setGroups] = useState<IGroup[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Fetch users and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls to get the user's contacts and groups
        const mockUsers = [
          await chatService.getUser("user1"),
          await chatService.getUser("user2"),
          await chatService.getUser("user3"),
        ]

        const mockGroups = [await chatService.getGroup("group1"), await chatService.getGroup("group2")]

        setUsers(mockUsers)
        setGroups(mockGroups)
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
      }
    }

    fetchData()
  }, [])

  // Filter chats based on search query
  const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Handle sidebar toggle with animation
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      className={`border-r bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {isExpanded && <h1 className="text-xl font-bold">ChatPlat</h1>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      {isExpanded && (
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search chats..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Channels/Contacts */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Groups section */}
        {(isExpanded || (!isExpanded && filteredGroups.length > 0)) && (
          <div className="mb-2">
            {isExpanded && (
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-semibold text-slate-500">GROUPS</span>
                <Link href="/chat/new-group">
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Plus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}

            {filteredGroups.map((group) => (
              <Link
                key={group.id}
                href={`/chat/group/${group.id}`}
                className={`block p-2 rounded-md ${
                  activeChat === group.id || pathname === `/chat/group/${group.id}`
                    ? "bg-slate-200 dark:bg-slate-800"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                } cursor-pointer flex items-center gap-3`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={group.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isExpanded && (
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{group.name}</p>
                    <p className="text-xs text-slate-500 truncate">{group.members.length} members</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Direct messages section */}
        {(isExpanded || (!isExpanded && filteredUsers.length > 0)) && (
          <div>
            {isExpanded && (
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-semibold text-slate-500">DIRECT MESSAGES</span>
                <Link href="/chat/new-message">
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Plus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}

            {filteredUsers.map((chatUser) => (
              <Link
                key={chatUser.id}
                href={`/chat/individual/${chatUser.id}`}
                className={`block p-2 rounded-md ${
                  activeChat === chatUser.id || pathname === `/chat/individual/${chatUser.id}`
                    ? "bg-slate-200 dark:bg-slate-800"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                } cursor-pointer flex items-center gap-3`}
              >
                <Avatar className="h-8 w-8 relative">
                  <AvatarImage src={chatUser.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{chatUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  {chatUser.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                  )}
                </Avatar>
                {isExpanded && (
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{chatUser.username}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {chatUser.status === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* User profile */}
      <div className="p-4 border-t flex items-center gap-3">
        <Link href="/settings/profile">
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user?.avatar || "/avatars/user.jpg"} />
            <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "ME"}</AvatarFallback>
          </Avatar>
        </Link>
        {isExpanded && (
          <>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">{user?.username || "You"}</p>
              <p className="text-xs text-slate-500">Online</p>
            </div>
            <div className="flex gap-1">
              <Link href="/settings/profile">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
