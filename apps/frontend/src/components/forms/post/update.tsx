import Loader from "@/components/common/Loader"
import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { PostData } from "@/libs/validations/post"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import PostForm from "./common/PostForm"

type Props = { postId: string }

export default function UpdatePostForm({ postId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [defaultValues, setDefaultValues] = useState<Partial<PostData> | null>(
    null,
  )

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await postService.get({ id: postId })
        if (!post) throw new Error()
        setDefaultValues({ title: post.title, content: post.content })
      } catch {
        toast.error(messages.postNotFoundMessage)
      }
    }
    fetchPost()
  }, [postId])

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
