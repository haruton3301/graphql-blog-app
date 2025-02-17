import Breadcrumbs from "@/components/common/Breadcrumbs"
import Loader from "@/components/common/Loader"
import MetaTitle from "@/components/common/MetaTitle"
import { PostList } from "@/components/posts/list"
import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { Post } from "@/libs/types/post"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.list()
        setPosts(data)
      } catch (error) {
        toast.error(messages.commonMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) return <Loader />

  return (
    <>
      <MetaTitle />
      <Breadcrumbs />
      <div className="flex justify-center">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p>{messages.postNotExistMessage}</p>
        )}
      </div>
    </>
  )
}
