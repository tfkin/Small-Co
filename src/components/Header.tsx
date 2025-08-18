'use client'

import Link from 'next/link'

import { ThemeToggle } from '@/components/theme-toggle'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default function Header() {
    return (
        <header className='fixed inset-x-0 top-0 z-50 border-b bg-background/20 py-4 backdrop-blur-sm px-4'>
            <nav className='container flex max-w-none items-center justify-between'>
                <ul className='flex items-center gap-14 text-sm font-medium'>
                    <li className='font-serif text-xl font-semibold'>
                        <Link href='/'>Small</Link>
                    </li>
                </ul>

                <div className='flex items-center justify-between gap-6'>
                    <ThemeToggle />

                    <SignedIn>
                        <Button size='sm' variant='outline' asChild>
                            <Link href='/write'>Write</Link>
                        </Button>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton>
                            <Button size='sm' variant="outline">Sign in</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
}