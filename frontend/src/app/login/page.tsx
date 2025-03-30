"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogIn, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        let valid = true
        const newErrors = { username: "", password: "" }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required"
            valid = false
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters"
            valid = false
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
            valid = false
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
            valid = false
        }

        setFieldErrors(newErrors)
        return valid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors in the form",
                variant: "destructive"
            })
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`http://localhost:8080/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Login failed. Please check your credentials.")
            }

            if (data.token) {
                localStorage.setItem("authToken", data.token)
            }

            toast({
                title: "Login Successful!",
                description: "Redirecting to your chat...",
            })

            setTimeout(() => router.push("/chat"), 1000)
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
            toast({
                title: "Login Failed",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md border-slate-200 bg-white/90 backdrop-blur-sm shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:text-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                    <CardDescription className="text-center text-slate-500 dark:text-slate-400">
                        Sign in to continue to ChatPlat
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
                                className={`${fieldErrors.username ? "border-red-500 dark:border-red-500" : ""}`}
                                required
                            />
                            {fieldErrors.username && (
                                <p className="text-sm text-red-500 dark:text-red-400">{fieldErrors.username}</p>
                            )}
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
                                className={`${fieldErrors.password ? "border-red-500 dark:border-red-500" : ""}`}
                                required
                            />
                            {fieldErrors.password && (
                                <p className="text-sm text-red-500 dark:text-red-400">{fieldErrors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-0">
                    <div className="text-center text-sm">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-slate-900 hover:underline dark:text-white"
                        >
                            Sign up
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