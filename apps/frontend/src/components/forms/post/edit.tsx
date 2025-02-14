import Loader from "@/components/common/Loader"
import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { PostData } from "@/libs/validations/post"
import { useAuth } from "@/providers/auth"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import PostForm from "./common/PostForm"

type Props = { postId: string }

export default function EditPostForm({ postId }: Props) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [defaultValues, setDefaultValues] = useState<Partial<PostData> | null>(
    null,
  )

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await postService.get({ id: postId })
        if (!post) throw new Error(messages.postNotFoundMessage)
        if (user?.id !== post.author.id)
          throw new Error(messages.NotAuthorizedMessage)
        setDefaultValues({ title: post.title, content: post.content })
      } catch (error: any) {
        toast.error(error.message)
        navigate("/")
      }
    }
    fetchPost()
  }, [postId, navigate, user])

  const handleSubmit = async (data: PostData) => {
    setIsSubmitting(true)
    try {
      await postService.update({ postId, ...data })
      toast.success(messages.postUpdatedMessage)
    } catch (error) {
      toast.error(messages.commonMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!defaultValues) return <Loader />

  return (
    <PostForm
      title="投稿を編集"
      submitLabel="保存"
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
