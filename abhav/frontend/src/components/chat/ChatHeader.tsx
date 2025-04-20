"use client"

// ChatHeader.tsx - Header component for chat interfaces
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, MoreVertical } from "lucide-react"
import type { IUser, IGroup } from "@/lib/types/chat"
import chatService from "@/services/ChatService"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Import Dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Update the ChatHeader props interface
interface ChatHeaderProps {
  chatId: string
  isGroup: boolean
  onClearChat: () => void
}

export default function ChatHeader({ chatId, isGroup, onClearChat }: ChatHeaderProps) {
  const [chatInfo, setChatInfo] = useState<IUser | IGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        setLoading(true)
        setError(null)

        if (isGroup) {
          const group = await chatService.getGroup(chatId)
          setChatInfo(group)
        } else {
          const user = await chatService.getUser(chatId)
          setChatInfo(user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat information")
        console.error("Error fetching chat info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchChatInfo()
  }, [chatId, isGroup])

  if (loading) {
    return (
      <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          <div>
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mt-1 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !chatInfo) {
    return (
      <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="text-red-500">Error loading chat information</div>
      </div>
    )
  }

  // Determine if we're dealing with a user or group
  const isUserChat = "username" in chatInfo

  // Get the appropriate name and status
  const name = isUserChat ? chatInfo.username : chatInfo.name
  const status = isUserChat ? chatInfo.status : `${(chatInfo as IGroup).members.length} members`
  const statusText =
    isUserChat && chatInfo.status === "online"
      ? "Online"
      : isUserChat && chatInfo.status === "away"
        ? "Away"
        : isUserChat && chatInfo.status === "busy"
          ? "Busy"
          : status

  // Get the appropriate avatar
  const avatar = chatInfo.avatar || "/placeholder.svg"
  const fallback = isUserChat
    ? chatInfo.username.substring(0, 2).toUpperCase()
    : (chatInfo as IGroup).name.substring(0, 2).toUpperCase()

  return (
    <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-bold">{name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{statusText}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isGroup && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Group members"
                onClick={() => {
                  toast({
                    title: "Group members",
                    description: "Viewing group members",
                    duration: 1500,
                  })
                }}
              >
                <Users className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Group Members</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-3">
                  {isGroup &&
                    (chatInfo as IGroup).members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{member.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.username}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {member.status === "online" ? "Online" : "Offline"}
                          </p>
                        </div>
                      </div>
                    ))}
                  {/* TODO: Fetch group members from backend once available */}
                  {/* const members = await api.getGroupMembers(groupId); */}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="More options">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                onClearChat()
                toast({
                  title: "Chat cleared",
                  description: "All messages have been cleared",
                  duration: 2000,
                })
              }}
            >
              Clear chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
