import Breadcrumbs, { Breadcrumb } from "@/components/common/Breadcrumbs"
import Loader from "@/components/common/Loader"
import MetaTitle from "@/components/common/MetaTitle"
import { PostDetail } from "@/components/posts/detail"
import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { Post } from "@/libs/types/post"
import { useAuth } from "@/providers/auth"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      if (!id) return

      try {
        const data = await postService.get({ id })
        setPost(data)
      } catch (error) {
        toast.error(messages.commonMessage)
        navigate("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [id])

  const breadcrumbs: Array<Breadcrumb> = [
    {
      label: "投稿詳細",
    },
  ]

  if (isLoading || !post) return <Loader />

  const isMine = user?.id === post.author.id

  return (
    <>
      <MetaTitle />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex flex-col items-center">
        {isMine && (
          <div className="max-w-4xl w-full flex justify-end mb-2">
            <Link to={`/posts/${post.id}/edit`} className="btn btn-primary">
              編集
            </Link>
          </div>
        )}
        <PostDetail post={post} />
      </div>
    </>
  )
}
