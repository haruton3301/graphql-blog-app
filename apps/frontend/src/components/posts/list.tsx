import { Post } from "@/libs/types/post"
import { PostItem } from "./item"

type Props = {
  posts: Post[]
}

export const PostList = ({ posts }: Props) => {
  return (
    <ul className="max-w-4xl w-full mx-3 space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </ul>
  )
}
