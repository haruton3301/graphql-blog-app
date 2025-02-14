import Breadcrumbs, { Breadcrumb } from "@/components/common/Breadcrumbs"
import MetaTitle from "@/components/common/MetaTitle"
import EditPostForm from "@/components/forms/post/edit"
import { useParams } from "react-router-dom"

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()

  const breadcrumbs: Array<Breadcrumb> = [
    {
      label: "投稿",
      path: `/posts/${id}`,
    },
    {
      label: "投稿を編集",
    },
  ]

  return (
    <>
      <MetaTitle title="投稿を編集" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <EditPostForm postId={id || ""} />
        </div>
      </div>
    </>
  )
}
