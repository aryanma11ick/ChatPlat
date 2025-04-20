// Define interfaces for chat-related entities following OOP principles

// User interface
export interface IUser {
  id: string
  username: string
  avatar?: string
  email?: string
  status?: "online" | "offline" | "away" | "busy"
  lastSeen?: Date
}

// Group interface
export interface IGroup {
  id: string
  name: string
  avatar?: string
  members: IUser[]
  createdAt: Date
  description?: string
}

// Message types using discriminated unions
export type MessageType = "text" | "image" | "file" | "system"

// Base message interface
export interface IMessageBase {
  id: string
  senderId: string
  timestamp: Date
  status: "sent" | "delivered" | "read" | "failed"
  type: MessageType
}

// Text message
export interface ITextMessage extends IMessageBase {
  type: "text"
  content: string
}

// Image message
export interface IImageMessage extends IMessageBase {
  type: "image"
  imageUrl: string
  caption?: string
}

// File message
export interface IFileMessage extends IMessageBase {
  type: "file"
  fileUrl: string
  fileName: string
  fileSize: number
}

// System message
export interface ISystemMessage extends IMessageBase {
  type: "system"
  content: string
}

// Union type for all message types
export type IMessage = ITextMessage | IImageMessage | IFileMessage | ISystemMessage

// Chat state interface
export interface IChatState {
  messages: IMessage[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
}

// Message payload for sending messages
export interface IMessagePayload {
  content: string
  recipientId: string
  type: MessageType
  isGroupChat: boolean
}

// Chat service interface
export interface IChatService {
  getMessages(chatId: string, isGroup: boolean, limit?: number, before?: Date): Promise<IMessage[]>
  sendMessage(payload: IMessagePayload): Promise<IMessage>
  markAsRead(messageIds: string[]): Promise<void>
  subscribeToMessages(chatId: string, callback: (message: IMessage) => void): () => void
  getUser(userId: string): Promise<IUser>
  getGroup(groupId: string): Promise<IGroup>
  addGroup(group: IGroup): Promise<IGroup>
}
