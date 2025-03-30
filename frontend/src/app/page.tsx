import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageCircle, ArrowRight } from "lucide-react"
import ParticleNetwork from "@/components/ParticleNetwork";

export default function Home() {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Particle Background */}
            <div className="fixed inset-0 -z-10">
                <ParticleNetwork />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <header className="shrink-0 py-6">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-2">
                            <MessageCircle className="h-6 w-6 text-slate-900 dark:text-white" />
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">ChatPlat</span>
                        </div>
                    </div>
                </header>

                {/* Main Content - Properly Centered */}
                <main className="flex-1 grid place-items-center p-4">
                    <div className="w-full max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                            Connect with friends on <span className="text-slate-900 dark:text-white">ChatPlat</span>
                        </h1>

                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            A simple, fast, and secure way to chat with your friends and family.
                        </p>

                        {/* Buttons - Horizontal on desktop, vertical on mobile */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/login" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                                >
                                    Login
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/signup" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-slate-900 text-slate-900 hover:bg-slate-100 dark:border-slate-400 dark:text-slate-400 dark:hover:bg-slate-800/30"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="shrink-0 py-6">
                    <div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                        <p>© {new Date().getFullYear()} ChatPlat. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}