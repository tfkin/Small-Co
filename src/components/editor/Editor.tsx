'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Post } from '@/lib/types'

import {
    EditorCommand,
    EditorCommandEmpty,
    EditorCommandItem,
    EditorCommandList,
    EditorContent,
    EditorRoot,
    type JSONContent,
    ImageResizer,
    handleCommandNavigation,
    handleImageDrop,
    handleImagePaste,
    type SuggestionItem
} from 'novel'

import {
    slashCommand,
    suggestionItems
} from '@/components/editor/SlashCommand'
import EditorMenu from '@/components/editor/EditorMenu'
import { uploadFn } from '@/components/editor/image-upload'
import { defaultExtensions } from '@/components/editor/Extensions'
import { TextButtons } from '@/components/editor/selectors/TextButtons'
import { LinkSelector } from '@/components/editor/selectors/LinkSelector'
import { NodeSelector } from '@/components/editor/selectors/NodeSelector'
import { MathSelector } from '@/components/editor/selectors/MathSelector'
import { ColorSelector } from '@/components/editor/selectors/ColorSelector'

import { Separator } from '@/components/ui/separator'

const extensions = [...defaultExtensions, slashCommand]

export const defaultEditorContent = {
    type: 'doc',
    content: [
        {
            type: 'paragraph',
            content: []
        }
    ]
}

interface EditorProps {
    post?: Post
    editable?: boolean
    setContent?: (content: JSONContent) => void
}

export default function Editor({
    post,
    editable = true,
    setContent
}: EditorProps) {
    const [openNode, setOpenNode] = useState(false)
    const [openColor, setOpenColor] = useState(false)
    const [openLink, setOpenLink] = useState(false)
    const [openAI, setOpenAI] = useState(false)

    const initialContent = post?.content
        ? JSON.parse(post.content)
        : defaultEditorContent

    if (!initialContent) return null

    return (
        <div className='relative w-full max-w-screen-lg'>
            <EditorRoot>
                <EditorContent
                    immediatelyRender={false}
                    initialContent={initialContent}
                    extensions={extensions}
                    className={cn(
                        'relative w-full max-w-screen-lg bg-background',
                        editable
                            ? 'min-h-[450px] h-[450px] overflow-scroll rounded-md border border-input shadow-sm'
                            : 'text-justify'
                    )}
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event)
                        },
                        handlePaste: (view, event) =>
                            handleImagePaste(view, event, uploadFn),
                        handleDrop: (view, event, _slice, moved) =>
                            handleImageDrop(view, event, moved, uploadFn),
                        attributes: {
                            class: `prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full px-2 mt-1 ${editable ? 'cursor-text text-sm min-h-[420px]' : 'cursor-default !p-0'}`
                        }
                    }}
                    onUpdate={({ editor }) => {
                        if (setContent) setContent(editor.getJSON())
                    }}
                    onCreate={({ editor }) => {
                        if (!editable) editor.setEditable(editable)
                    }}
                    slotAfter={<ImageResizer />}
                >
                    <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-300 px-1 py-2 shadow-md transition-all'>
                        <div className='absolute inset-0 bg-current invert -z-10' />
                        <div className='relative z-10'>
                            <EditorCommandEmpty className='px-2 text-muted-foreground'>
                                No results
                            </EditorCommandEmpty>
                            <EditorCommandList>
                                {suggestionItems.map((item: SuggestionItem) => (
                                    <EditorCommandItem
                                        value={item.title}
                                        onCommand={val => item.command?.(val)}
                                        className='flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent'
                                        key={item.title}
                                    >
                                        <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className='font-medium'>{item.title}</p>
                                            <p className='text-xs text-muted-foreground'>
                                                {item.description}
                                            </p>
                                        </div>
                                    </EditorCommandItem>
                                ))}
                            </EditorCommandList>
                        </div>
                    </EditorCommand>

                    <EditorMenu open={openAI} onOpenChange={setOpenAI}>
                        <Separator orientation='vertical' />
                        <NodeSelector open={openNode} onOpenChange={setOpenNode} />

                        <Separator orientation='vertical' />
                        <LinkSelector open={openLink} onOpenChange={setOpenLink} />

                        <Separator orientation='vertical' />
                        <MathSelector />

                        <Separator orientation='vertical' />
                        <TextButtons />

                        <Separator orientation='vertical' />
                        <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                    </EditorMenu>
                </EditorContent>
            </EditorRoot>
        </div >
    )
}