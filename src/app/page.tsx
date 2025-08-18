import Posts from '@/components/Posts'
import RecentPosts from '@/components/RecentPosts'
import SuggestedWriters from '@/components/SuggestedWriters'
import RecommendedTopics from '@/components/RecommendedTopics'

export default function Home() {
  return (
    <section className='mt-[65px]'>
      <div className='container mx-auto p-4'>
        <div className='flex flex-col gap-x-16 gap-y-6 xl:flex-row xl:items-start'>
          <main className='flex-1 pt-20 xl:py-20'>
            <Posts />
          </main>

          <aside className='flex w-full flex-col justify-between gap-6 pb-10 md:flex-row xl:sticky xl:top-[65px] xl:w-[350px] xl:flex-col xl:py-20'>
            <RecentPosts />
            <RecommendedTopics />
            <SuggestedWriters />
          </aside>
        </div>
      </div>
    </section>
  )
}