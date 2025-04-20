"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Check, X, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import chatService from "@/services/ChatService"
import type { IUser, IGroup } from "@/lib/types/chat"
import { toast } from "@/components/ui/use-toast"

export default function NewGroupPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<"select" | "create">("select")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<IUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
  const [groupName, setGroupName] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const toggleUserSelection = (selectedUser: IUser) => {
    if (selectedUsers.some((u) => u.id === selectedUser.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== selectedUser.id))
    } else {
      setSelectedUsers([...selectedUsers, selectedUser])
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Group name is required")
      return
    }

    if (selectedUsers.length < 2) {
      setError("Please select at least 2 users")
      return
    }

    setCreating(true)
    setError(null)

    try {
      // Create a new group with a unique ID
      const newGroupId = "group" + Date.now()

      // Create the group object
      const newGroup: IGroup = {
        id: newGroupId,
        name: groupName,
        members: [...selectedUsers, user as IUser],
        createdAt: new Date(),
        description: `Group created by ${user?.username}`,
      }

      // Store the group in localStorage for persistence
      const existingGroups = JSON.parse(localStorage.getItem("chatGroups") || "{}")
      existingGroups[newGroupId] = newGroup
      localStorage.setItem("chatGroups", JSON.stringify(existingGroups))

      // Add the group to the chat service
      await chatService.addGroup(newGroup)

      toast({
        title: "Group created",
        description: `Group "${groupName}" has been created successfully`,
      })

      // Navigate to the new group chat
      router.push(`/chat/group/${newGroupId}`)
    } catch (error) {
      setError("Failed to create group")
      setCreating(false)
    }
  }

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
        <header className="p-4 border-b bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center">
            {step === "select" ? (
              <Link href="/chat" className="mr-4">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setStep("select")} className="mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-bold">{step === "select" ? "New Group" : "Create Group"}</h1>
          </div>
          {step === "select" && selectedUsers.length > 0 && <Button onClick={() => setStep("create")}>Next</Button>}
        </header>

        {step === "select" ? (
          <>
            {/* Selected users */}
            {selectedUsers.length > 0 && (
              <div className="p-4 bg-white dark:bg-slate-900 border-b overflow-x-auto">
                <div className="flex gap-2">
                  {selectedUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full pl-1 pr-2 py-1"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={u.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{u.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{u.username}</span>
                      <button
                        onClick={() => toggleUserSelection(u)}
                        className="ml-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                filteredUsers.map((u) => {
                  const isSelected = selectedUsers.some((selected) => selected.id === u.id)
                  return (
                    <div
                      key={u.id}
                      className={`p-4 border-b hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between ${
                        isSelected ? "bg-slate-50 dark:bg-slate-800" : ""
                      }`}
                      onClick={() => toggleUserSelection(u)}
                    >
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
                      {isSelected ? (
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="p-4 text-center text-slate-500">
                  {searchQuery ? "No users found" : "No users available"}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 bg-white dark:bg-slate-900 p-4">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Users className="h-10 w-10 text-slate-500" />
                </div>
                <div className="space-y-2 w-full">
                  <label htmlFor="groupName" className="text-sm font-medium">
                    Group Name
                  </label>
                  <Input
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Participants ({selectedUsers.length})</h3>
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {selectedUsers.map((u) => (
                    <div key={u.id} className="flex items-center gap-2 py-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={u.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{u.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{u.username}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleCreateGroup}
                disabled={creating || !groupName.trim() || selectedUsers.length < 2}
                className="w-full"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
