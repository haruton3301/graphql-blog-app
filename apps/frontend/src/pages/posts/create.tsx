import Breadcrumbs, { Breadcrumb } from "@/components/common/Breadcrumbs"
import MetaTitle from "@/components/common/MetaTitle"
import CreatePostForm from "@/components/forms/post/create"

export default function CreatePostPage() {
  const breadcrumbs: Array<Breadcrumb> = [
    {
      label: "新規投稿作成",
    },
  ]

  return (
    <>
      <MetaTitle title="新規投稿作成" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <CreatePostForm />
        </div>
      </div>
    </>
  )
}
