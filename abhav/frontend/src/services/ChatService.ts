// ChatService.ts - Encapsulates chat-related business logic and API communication
import type {
  IUser,
  IGroup,
  IMessage,
  IChatService,
  IMessagePayload,
  ITextMessage,
  ISystemMessage,
  IImageMessage,
  IFileMessage,
} from "@/lib/types/chat"

// Mock data for users
const MOCK_USERS: Record<string, IUser> = {
  user1: {
    id: "user1",
    username: "Alice",
    avatar: "/avatars/user1.jpg",
    status: "online",
  },
  user2: {
    id: "user2",
    username: "Bob",
    avatar: "/avatars/user2.jpg",
    status: "online",
  },
  user3: {
    id: "user3",
    username: "Charlie",
    avatar: "/avatars/user3.jpg",
    status: "away",
  },
  current: {
    id: "current",
    username: "You",
    avatar: "/avatars/user.jpg",
    status: "online",
  },
}

// Mock data for groups
const MOCK_GROUPS: Record<string, IGroup> = {
  group1: {
    id: "group1",
    name: "General Chat",
    avatar: "/avatars/group.png",
    members: [MOCK_USERS.user1, MOCK_USERS.user2, MOCK_USERS.user3, MOCK_USERS.current],
    createdAt: new Date("2023-01-01"),
    description: "General discussion group",
  },
  group2: {
    id: "group2",
    name: "Project Team",
    avatar: "/avatars/group.png",
    members: [MOCK_USERS.user1, MOCK_USERS.current],
    createdAt: new Date("2023-02-15"),
    description: "Project coordination and updates",
  },
}

export const MOCK_GROUP_MESSAGES: Record<string, IMessage[]> = {
  group1: [
    {
      id: "gmsg1",
      senderId: "user1",
      timestamp: new Date("2023-04-15T09:00:00"),
      status: "read",
      type: "text",
      content: "Good morning everyone!",
    } as ITextMessage,
    {
      id: "gmsg2",
      senderId: "user2",
      timestamp: new Date("2023-04-15T09:02:00"),
      status: "read",
      type: "text",
      content: "Morning! How is everyone doing?",
    } as ITextMessage,
    {
      id: "gmsg3",
      senderId: "current",
      timestamp: new Date("2023-04-15T09:05:00"),
      status: "delivered",
      type: "text",
      content: "Doing great! Ready for our meeting later?",
    } as ITextMessage,
    {
      id: "gmsg4",
      senderId: "system",
      timestamp: new Date("2023-04-15T09:10:00"),
      status: "delivered",
      type: "system",
      content: "User3 joined the group",
    } as ISystemMessage,
  ],
}

export const MOCK_INDIVIDUAL_MESSAGES: Record<string, IMessage[]> = {
  user1: [
    {
      id: "msg1",
      senderId: "user1",
      timestamp: new Date("2023-04-15T14:30:00"),
      status: "read",
      type: "text",
      content: "Hey there! How are you doing today?",
    } as ITextMessage,
    {
      id: "msg2",
      senderId: "current",
      timestamp: new Date("2023-04-15T14:32:00"),
      status: "delivered",
      type: "text",
      content: "I'm doing great! Just finished working on that project.",
    } as ITextMessage,
    {
      id: "msg3",
      senderId: "user1",
      timestamp: new Date("2023-04-15T14:33:00"),
      status: "read",
      type: "text",
      content: "That's awesome! Can you share some details?",
    } as ITextMessage,
  ],
  user2: [
    {
      id: "msg4",
      senderId: "user2",
      timestamp: new Date("2023-04-15T10:15:00"),
      status: "read",
      type: "text",
      content: "Did you see the latest update?",
    } as ITextMessage,
    {
      id: "msg5",
      senderId: "current",
      timestamp: new Date("2023-04-15T10:17:00"),
      status: "delivered",
      type: "text",
      content: "Not yet, what's new?",
    } as ITextMessage,
  ],
}

// ChatService class implementing IChatService interface
export class ChatService implements IChatService {
  private subscribers: Map<string, Set<(message: IMessage) => void>> = new Map()

  constructor() {
    // Load any saved groups from localStorage
    this.loadSavedGroups()
  }

  private loadSavedGroups() {
    try {
      const savedGroups = localStorage.getItem("chatGroups")
      if (savedGroups) {
        const groups = JSON.parse(savedGroups)
        Object.keys(groups).forEach((groupId) => {
          MOCK_GROUPS[groupId] = groups[groupId]
          // Initialize empty message array for this group if it doesn't exist
          if (!MOCK_GROUP_MESSAGES[groupId]) {
            MOCK_GROUP_MESSAGES[groupId] = []
          }
        })
      }
    } catch (error) {
      console.error("Error loading saved groups:", error)
    }
  }

  // Add a new group
  async addGroup(group: IGroup): Promise<IGroup> {
    // Simulate API call delay
    await this.delay(300)

    // Add to mock data
    MOCK_GROUPS[group.id] = group

    // Initialize empty message array for this group
    MOCK_GROUP_MESSAGES[group.id] = []

    return group
  }

  // Get messages for a chat (individual or group)
  async getMessages(chatId: string, isGroup: boolean, limit = 20, before?: Date): Promise<IMessage[]> {
    // Simulate API call delay
    await this.delay(500)

    try {
      const messages = isGroup ? MOCK_GROUP_MESSAGES[chatId] || [] : MOCK_INDIVIDUAL_MESSAGES[chatId] || []

      // Filter messages by date if 'before' is provided
      const filteredMessages = before ? messages.filter((msg) => msg.timestamp < before) : messages

      // Sort messages by timestamp (newest last)
      return [...filteredMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).slice(-limit)
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw new Error("Failed to fetch messages")
    }
  }

  // Send a message
  async sendMessage(payload: IMessagePayload): Promise<IMessage> {
    // Simulate API call delay
    await this.delay(300)

    try {
      const newMessage: ITextMessage = {
        id: `msg_${Date.now()}`,
        senderId: "current",
        timestamp: new Date(),
        status: "sent",
        type: "text",
        content: payload.content,
      }

      // Add message to mock data
      if (payload.isGroupChat) {
        const groupId = payload.recipientId
        if (!MOCK_GROUP_MESSAGES[groupId]) {
          MOCK_GROUP_MESSAGES[groupId] = []
        }
        MOCK_GROUP_MESSAGES[groupId].push(newMessage)
      } else {
        const userId = payload.recipientId
        if (!MOCK_INDIVIDUAL_MESSAGES[userId]) {
          MOCK_INDIVIDUAL_MESSAGES[userId] = []
        }
        MOCK_INDIVIDUAL_MESSAGES[userId].push(newMessage)
      }

      // Notify subscribers
      this.notifySubscribers(payload.recipientId, newMessage)

      return newMessage
    } catch (error) {
      console.error("Error sending message:", error)
      throw new Error("Failed to send message")
    }
  }

  // Send a file message
  async sendFileMessage(chatId: string, isGroup: boolean, file: File): Promise<IMessage> {
    // Simulate API call delay
    await this.delay(500)

    try {
      // Create a file URL (in a real app, this would be an uploaded file URL)
      const fileUrl = URL.createObjectURL(file)

      let newMessage: IMessage

      if (file.type.startsWith("image/")) {
        // Image message
        newMessage = {
          id: `msg_${Date.now()}`,
          senderId: "current",
          timestamp: new Date(),
          status: "sent",
          type: "image",
          imageUrl: fileUrl,
          caption: file.name,
        } as IImageMessage
      } else {
        // File message
        newMessage = {
          id: `msg_${Date.now()}`,
          senderId: "current",
          timestamp: new Date(),
          status: "sent",
          type: "file",
          fileUrl: fileUrl,
          fileName: file.name,
          fileSize: file.size,
        } as IFileMessage
      }

      // Add message to mock data
      if (isGroup) {
        if (!MOCK_GROUP_MESSAGES[chatId]) {
          MOCK_GROUP_MESSAGES[chatId] = []
        }
        MOCK_GROUP_MESSAGES[chatId].push(newMessage)
      } else {
        if (!MOCK_INDIVIDUAL_MESSAGES[chatId]) {
          MOCK_INDIVIDUAL_MESSAGES[chatId] = []
        }
        MOCK_INDIVIDUAL_MESSAGES[chatId].push(newMessage)
      }

      // Notify subscribers
      this.notifySubscribers(chatId, newMessage)

      return newMessage
    } catch (error) {
      console.error("Error sending file message:", error)
      throw new Error("Failed to send file message")
    }
  }

  // Mark messages as read
  async markAsRead(messageIds: string[]): Promise<void> {
    // Simulate API call delay
    await this.delay(200)

    try {
      // In a real implementation, this would update the message status in the database
      console.log("Marked messages as read:", messageIds)
    } catch (error) {
      console.error("Error marking messages as read:", error)
      throw new Error("Failed to mark messages as read")
    }
  }

  // Subscribe to new messages for a chat
  subscribeToMessages(chatId: string, callback: (message: IMessage) => void): () => void {
    if (!this.subscribers.has(chatId)) {
      this.subscribers.set(chatId, new Set())
    }

    this.subscribers.get(chatId)!.add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(chatId)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.subscribers.delete(chatId)
        }
      }
    }
  }

  // Get user details
  async getUser(userId: string): Promise<IUser> {
    // Simulate API call delay
    await this.delay(200)

    const user = MOCK_USERS[userId]
    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    return user
  }

  // Get group details
  async getGroup(groupId: string): Promise<IGroup> {
    // Simulate API call delay
    await this.delay(200)

    // Check localStorage first for custom groups
    try {
      const savedGroups = localStorage.getItem("chatGroups")
      if (savedGroups) {
        const groups = JSON.parse(savedGroups)
        if (groups[groupId]) {
          return groups[groupId]
        }
      }
    } catch (error) {
      console.error("Error checking localStorage for group:", error)
    }

    // Fall back to mock data
    const group = MOCK_GROUPS[groupId]
    if (!group) {
      throw new Error(`Group not found: ${groupId}`)
    }

    return group
  }

  // Helper method to notify subscribers of new messages
  private notifySubscribers(chatId: string, message: IMessage): void {
    const callbacks = this.subscribers.get(chatId)
    if (callbacks) {
      callbacks.forEach((callback) => callback(message))
    }
  }

  // Helper method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Simulate typing indicator
  async simulateTyping(chatId: string, isTyping: boolean): Promise<void> {
    // In a real implementation, this would send a typing indicator via WebSocket
    console.log(`User ${isTyping ? "started" : "stopped"} typing in chat ${chatId}`)
  }
}

// Create a singleton instance
const chatService = new ChatService()
export default chatService
