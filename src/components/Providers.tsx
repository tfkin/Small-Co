'use client'

import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { ConvexClientProvider } from "@/components/ConvexClientProvider"
import { useEffect, useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <ConvexClientProvider>
            <ThemeProvider
                enableSystem
                attribute='class'
                defaultTheme='dark'
                disableTransitionOnChange
            >
                {mounted ? (
                    <>
                        {children}
                        <ToasterProvider />
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
                            <p>Loading...</p>
                        </div>
                    </div>
                )}
            </ThemeProvider>
        </ConvexClientProvider >
    )
}

function ToasterProvider() {
    const { resolvedTheme } = useTheme()

    return (
        <Toaster
            richColors
            closeButton
            position='top-center'
            theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        />
    )
}