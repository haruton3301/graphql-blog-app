import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { PostData } from "@/libs/validations/post"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import PostForm from "./common/PostForm"

export default function CreatePostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (data: PostData) => {
    setIsSubmitting(true)
    try {
      await postService.create(data)
      toast.success(messages.postCreatedMessage)
      navigate("/")
    } catch (error) {
      console.log(error)
      toast.error(messages.commonMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PostForm
      title="新規投稿作成"
      submitLabel="作成"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
