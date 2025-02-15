import { Post } from "@/libs/types/post"
import { unixTimeToDate } from "@/libs/utils/date"
import { Link } from "react-router-dom"
import { LikePostButton } from "../forms/post/like"

type Props = {
  post: Post
}

export const PostDetail = ({ post }: Props) => {
  return (
    <article className="max-w-4xl w-full px-6 py-4 rounded-lg bg-white shadow-sm">
      <Link to={`/users/${post.author.id}`} className="text-sm hover:underline">
        {post.author.name}
      </Link>
      <p className="text-sm text-slate-700">
        {unixTimeToDate(post.createdAt).toLocaleDateString()}
      </p>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <div className="whitespace-break-spaces my-2">{post.content}</div>
      <LikePostButton
        postId={post.id}
        initialLiked={post?.likedByMe || false}
        initialLikeCount={post?.likeCount || 0}
      />
    </article>
  )
}
