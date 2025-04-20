"use client"

import type React from "react"

import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Camera, Loader2, LogOut, Moon, Sun } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function ProfileSettingsPage() {
  const { user, updateUser, isLoading, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setDisplayName(user.username || "")
      setAvatar(user.avatar || null)
    }
  }, [user])

  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Create a URL for the file
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!displayName.trim()) {
      setError("Display name cannot be empty")
      return
    }

    try {
      await updateUser({
        username: displayName,
        avatar: avatar || undefined,
      })
      setSuccess("Profile updated successfully")
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      setError("Failed to update profile")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  // Generate initials for avatar fallback
  const getInitials = () => {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar would go here */}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 border-b bg-white dark:bg-slate-900 flex items-center">
          <Link href="/chat" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Profile Settings</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                        <AvatarImage src={avatar || undefined} />
                        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div
                        className="absolute bottom-0 right-0 bg-slate-900 dark:bg-slate-700 rounded-full p-1 cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload a new profile picture</p>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium">
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                    />
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Moon className="h-4 w-4" />
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                  </div>

                  {/* Error and Success Messages */}
                  {error && (
                    <div className="p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm">
                      {success}
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t pt-4">
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <Link href="/chat" className="w-full">
                  <Button variant="outline" className="w-full">
                    Back to Chat
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
