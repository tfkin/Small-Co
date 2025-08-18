"use client"

import { z } from 'zod'
import { toast } from 'sonner'
import { JSONContent } from 'novel'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'

import { newPostSchema } from '@/lib/schemas'
import { createSlugFromName } from '@/lib/utils'

import { useMutation } from 'convex/react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import ImageUploader from '@/components/ImageUploader'
import Editor from '@/components/editor/Editor'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'

type Inputs = z.infer<typeof newPostSchema>

export default function NewPostForm() {
    const createPost = useMutation(api.posts.createPost)
    const router = useRouter()
    const { isLoaded, isSignedIn } = useUser()

    const [openFilePicker, setOpenFilePicker] = useState(false)

    const {
        watch,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<Inputs>({
        resolver: zodResolver(newPostSchema),
        defaultValues: {}
    })

    function setCoverImageId(url: string) {
        setValue("coverImageId", url)
        setOpenFilePicker(false)
    }

    function setContent(content: JSONContent) {
        setValue("content", content, { shouldValidate: true })
    }

    const title = watch("title")
    useEffect(() => {
        if (title) {
            const slug = createSlugFromName(title)

            if (slug) {
                setValue("slug", slug, { shouldValidate: true })
            }
        }
    }, [title, setValue])

    const processForm: SubmitHandler<Inputs> = async (data) => {
        if (!isLoaded) {
            toast.error("Please wait while we verify your authentication")
            return
        }

        if (!isSignedIn) {
            toast.error("You must be signed in to create a post")
            return
        }

        const contentJson = data.content
        const hasContent = contentJson?.content?.some(
            c => c.content && c.content.length > 0
        )

        if (!hasContent) {
            toast.error("Please add some content to your post")
            return
        }

        try {
            const coverImageId = data.coverImageId && data.coverImageId.trim() !== ""
                ? (data.coverImageId as Id<'_storage'>)
                : undefined

            const postSlug = await createPost({
                ...data,
                coverImageId,
                content: JSON.stringify(contentJson)
            })

            if (!postSlug) throw new Error("Failed to create post")

            router.push(`/posts/${postSlug}`)
            toast.success("Post created successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create post")
        }
    }
    return (
        <form onSubmit={handleSubmit(processForm)} className="mt-6 max-w-2xl">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-4">
                    <div className="w-full">
                        <Input disabled type="text" className="w-full" placeholder="Select a cover image" {...register("coverImageId")} />
                        {errors.coverImageId?.message && <p className="mt-1 px-2 text-red-400">{errors.coverImageId.message}</p>}
                    </div>
                </div>

                <Dialog open={openFilePicker} onOpenChange={setOpenFilePicker}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant='outline' className='rounded-full hover:bg-current/5'>Select file</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <div className='absolute inset-0 bg-current invert -z-10' />
                        <div className='relative z-10'>
                            <DialogTitle className='mb-4'>Select Cover Image</DialogTitle>
                            <ImageUploader setImageId={setCoverImageId} />
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="flex justify-between gap-4">
                    <div className="flex-1">
                        <Input type="text" placeholder="Title" {...register("title")} />
                        {errors.title?.message && <p className="mt-1 px-2 text-red-400">{errors.title.message}</p>}
                    </div>
                    <div className='flex-1'>
                        <Input type="text" placeholder="Post slug" {...register("slug")} />
                        {errors.slug?.message && <p className="mt-1 px-2 text-red-400">{errors.slug.message}</p>}
                    </div>
                </div>

                <div>
                    <Input type="text" placeholder="Excerpt" {...register("excerpt")} />
                    {errors.excerpt?.message && <p className="mt-1 px-2 text-red-400">{errors.excerpt.message}</p>}
                </div>

                <div>
                    <Editor editable={true} setContent={setContent} />
                </div>

                <div className='w-full flex items-center justify-center'>
                    <Button
                        type='submit'
                        variant='outline'
                        disabled={isSubmitting || !isLoaded || !isSignedIn}
                        className='w-full sm:w-1/2 rounded-full hover:bg-current/5'
                    >
                        {!isLoaded ? (
                            <>
                                <Spinner className='mr-2' />
                                <span>Loading...</span>
                            </>
                        ) : !isSignedIn ? (
                            'Sign in to create post'
                        ) : isSubmitting ? (
                            <>
                                <Spinner className='mr-2' />
                                <span>Creating post...</span>
                            </>
                        ) : (
                            'Create post'
                        )}
                    </Button>
                </div>
            </div>
        </form >
    )
}