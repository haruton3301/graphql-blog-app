import { Post } from "@/libs/types/post"
import { unixTimeToDate } from "@/libs/utils/date"
import { TbHeart } from "react-icons/tb"
import { Link } from "react-router-dom"

type Props = {
  post: Post
}

export const PostItem = ({ post }: Props) => {
  return (
    <li className="relative w-full px-6 py-4 rounded-lg bg-white shadow-sm">
      <Link to={`/posts/${post.id}`} className="absolute inset-0" />
      <Link
        to={`/users/${post.author.id}`}
        className="relative z-10 text-sm hover:underline"
      >
        {post.author.name}
      </Link>
      <p className="text-sm text-slate-700">
        {unixTimeToDate(post.createdAt).toLocaleDateString()}
      </p>
      <Link
        to={`/posts/${post.id}`}
        className="relative z-10 text-lg font-semibold hover:underline"
      >
        {post.title}
      </Link>
      <div className="flex items-center gap-1 text-gray-600">
        <TbHeart />
        <p className="text-sm">{post.likeCount}</p>
      </div>
    </li>
  )
}
