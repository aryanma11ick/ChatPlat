import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Menu, Users, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <div className="w-16 md:w-64 border-r bg-white dark:bg-slate-900 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <h1 className="hidden md:block text-xl font-bold">ChatPlat</h1>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Channels/Contacts */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    <div className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatars/group.png" />
                            <AvatarFallback>GP</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:block">General</span>
                    </div>
                    {/* More channels would go here */}
                </div>

                {/* User profile */}
                <div className="p-4 border-t flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/user.jpg" />
                        <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                        <p className="font-medium">You</p>
                        <p className="text-xs text-slate-500">Online</p>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="/avatars/group.png" />
                            <AvatarFallback>GP</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-bold">General Chat</h2>
                            <p className="text-sm text-slate-500">3 online</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Users className="h-5 w-5" />
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Sample messages */}
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src="/avatars/user1.jpg" />
                            <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <p className="font-bold">Alice</p>
                                <p className="text-xs text-slate-500">2:30 PM</p>
                            </div>
                            <p className="mt-1">Hey everyone! How's it going?</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarImage src="/avatars/user2.jpg" />
                            <AvatarFallback>CD</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <p className="font-bold">Bob</p>
                                <p className="text-xs text-slate-500">2:32 PM</p>
                            </div>
                            <p className="mt-1">Doing great! Just finished the new project.</p>
                        </div>
                    </div>

                    {/* User's message */}
                    <div className="flex gap-3 justify-end">
                        <div className="text-right">
                            <div className="flex items-baseline gap-2 justify-end">
                                <p className="text-xs text-slate-500">2:33 PM</p>
                                <p className="font-bold">You</p>
                            </div>
                            <p className="mt-1 bg-blue-500 text-white p-3 rounded-lg inline-block">
                                That's awesome! Can't wait to see it.
                            </p>
                        </div>
                        <Avatar>
                            <AvatarImage src="/avatars/user.jpg" />
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Message input */}
                <div className="p-4 border-t bg-white dark:bg-slate-900">
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                            <PlusCircle className="h-5 w-5" />
                        </Button>
                        <Input
                            placeholder="Type your message..."
                            className="flex-1"
                        />
                        <Button>
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}