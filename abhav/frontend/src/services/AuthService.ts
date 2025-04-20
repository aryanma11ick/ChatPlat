// AuthService.ts - Handles authentication-related functionality
import type { IUser } from "@/lib/types/chat"

// Mock user database
const MOCK_USERS: Record<string, IUser & { password: string; email: string }> = {
  admin: {
    id: "admin",
    username: "Admin",
    password: "password123",
    email: "admin@chatplat.com",
    avatar: "/avatars/admin.jpg",
    status: "online",
  },
  user1: {
    id: "user1",
    username: "Alice",
    password: "alice123",
    email: "alice@chatplat.com",
    avatar: "/avatars/user1.jpg",
    status: "online",
  },
  user2: {
    id: "user2",
    username: "Bob",
    password: "bob123",
    email: "bob@chatplat.com",
    avatar: "/avatars/user2.jpg",
    status: "online",
  },
  user3: {
    id: "user3",
    username: "Charlie",
    password: "charlie123",
    email: "charlie@chatplat.com",
    avatar: "/avatars/user3.jpg",
    status: "away",
  },
}

// OTP storage for password reset
interface OTPRecord {
  email: string
  otp: string
  expiresAt: Date
}

class AuthService {
  private otpRecords: OTPRecord[] = []

  // Login method
  async login(username: string, password: string): Promise<IUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user by username or email
    const user = Object.values(MOCK_USERS).find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase(),
    )

    if (!user || user.password !== password) {
      throw new Error("Invalid username or password")
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Register method
  async register(username: string, password: string, email: string): Promise<IUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if username or email already exists
    const userExists = Object.values(MOCK_USERS).some(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase(),
    )

    if (userExists) {
      throw new Error("Username or email already exists")
    }

    // Create new user
    const newUserId = `user_${Date.now()}`
    const newUser: IUser & { password: string; email: string } = {
      id: newUserId,
      username,
      password,
      email,
      status: "online",
    }

    // Add to mock database
    MOCK_USERS[newUserId] = newUser

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user by email
    const user = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error("No account found with this email address")
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with expiration (10 minutes)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Remove any existing OTP for this email
    this.otpRecords = this.otpRecords.filter((record) => record.email !== email)

    // Add new OTP
    this.otpRecords.push({
      email,
      otp,
      expiresAt,
    })

    console.log(`OTP for ${email}: ${otp}`) // In a real app, this would be sent via email

    return otp
  }

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find OTP record
    const record = this.otpRecords.find((r) => r.email.toLowerCase() === email.toLowerCase() && r.otp === otp)

    if (!record) {
      throw new Error("Invalid OTP")
    }

    if (new Date() > record.expiresAt) {
      throw new Error("OTP has expired")
    }

    return true
  }

  // Reset password
  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user by email
    const user = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      throw new Error("No account found with this email address")
    }

    // Update password
    user.password = newPassword

    // Remove OTP records for this email
    this.otpRecords = this.otpRecords.filter((record) => record.email !== email)

    return true
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<IUser>): Promise<IUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find user
    const user = MOCK_USERS[userId]

    if (!user) {
      throw new Error("User not found")
    }

    // Update user data
    Object.assign(user, updates)

    // Return updated user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  // Get current user
  async getCurrentUser(userId: string): Promise<IUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Find user
    const user = MOCK_USERS[userId]

    if (!user) {
      throw new Error("User not found")
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

// Create a singleton instance
const authService = new AuthService()
export default authService
