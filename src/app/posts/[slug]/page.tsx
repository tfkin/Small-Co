import Post from '@/components/Post'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    return <Post slug={slug} />
}