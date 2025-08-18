import NewPostForm from "@/components/NewPostForm";

export default async function Write() {
    return (
        <section className="pb-24 pt-32 sm:pt-40">
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold">New Post</h1>

                <NewPostForm />
            </div>
        </section>
    )
}