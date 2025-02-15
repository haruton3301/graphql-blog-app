import messages from "@/libs/constants/messages"
import { postService } from "@/libs/services"
import { useState } from "react"
import { TbHeart } from "react-icons/tb"
import { toast } from "react-toastify"

type Props = {
  postId: string
  initialLiked: boolean
  initialLikeCount: number
}

export const LikePostButton = ({
  postId,
  initialLiked,
  initialLikeCount,
}: Props) => {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(false)

  const toggleLike = async () => {
    if (loading) return

    setLoading(true)
    try {
      await postService.like({ postId })
      if (liked) {
        setLikeCount((prev) => prev - 1)
      } else {
        setLikeCount((prev) => prev + 1)
      }
      setLiked((prev) => !prev)
    } catch (error) {
      toast.error(messages.commonMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center space-x-1"
    >
      <TbHeart
        className={`w-6 h-6 ${liked ? "text-red-500" : "text-black"} transition-colors`}
      />
      <span className="text-sm text-gray-600">{likeCount}</span>
    </button>
  )
}
