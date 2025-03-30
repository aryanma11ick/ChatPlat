"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus } from "lucide-react"

interface FormData {
    username: string
    password: string
    confirmPassword?: string
}

export default function SignupPage() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        confirmPassword: "",
    })
    const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validateForm = (): boolean => {
        if (!formData.username.trim() || !formData.password) {
            setMessage({ text: "Username and password are required", isError: true })
            return false
        }

        if (formData.password.length < 6) {
            setMessage({ text: "Password must be at least 6 characters", isError: true })
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({ text: "Passwords do not match", isError: true })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setMessage({ text: "", isError: false })

        try {
            const res = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setMessage({ text: data.message || "Signup successful!", isError: false })
                setFormData({ username: "", password: "", confirmPassword: "" })
                setTimeout(() => router.push("/login"), 1500)
            } else {
                setMessage({
                    text: data.error || `Signup failed! (Status: ${res.status})`,
                    isError: true,
                })
            }
        } catch (error) {
            setMessage({
                text: "Network error: Could not connect to server.",
                isError: true,
            })
            console.error("Signup error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Join ChatPlat and start connecting
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium">
                                Username
                            </label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="border-slate-300 bg-white text-slate-900 focus-visible:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                                minLength={3}
                                maxLength={20}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border-slate-300 bg-white text-slate-900 focus-visible:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                                minLength={6}
                                maxLength={30}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="border-slate-300 bg-white text-slate-900 focus-visible:ring-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? "bg-slate-600 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"}`}
                        >
                            {loading ? (
                                "Signing up..."
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Sign Up
                                </>
                            )}
                        </Button>
                    </form>

                    {message.text && (
                        <div
                            className={`mt-4 rounded p-3 text-center ${
                                message.isError ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-slate-900 hover:underline dark:text-white">
                            Login
                        </Link>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center justify-center text-sm text-slate-500 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}