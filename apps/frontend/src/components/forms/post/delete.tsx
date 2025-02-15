import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { useAuth } from "@/providers/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

type Props = {
  postId: string
}

export const DeletePostButton = ({ postId }: Props) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await postService.delete({ postId })
      toast.success(messages.postDeletedMessage)
      navigate(`/users/${user?.id}`)
    } catch (error) {
      toast.error(messages.commonMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="btn btn-error">
      {loading ? "削除中..." : "削除"}
    </button>
  )
}
