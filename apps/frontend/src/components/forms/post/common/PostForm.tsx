import Card from "@/components/common/Card"
import { PostData, postSchema } from "@/libs/validations/post"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import TextInput from "../../common/Input"
import FormLabel from "../../common/Label"
import SubmitButton from "../../common/SubmitButton"
import TextArea from "../../common/TextArea"
import FormTitle from "../../common/Title"

type PostFormProps = {
  title: string
  submitLabel: string
  defaultValues?: Partial<PostData>
  onSubmit: (data: PostData) => void
  isSubmitting: boolean
}

export default function PostForm({
  title,
  submitLabel,
  defaultValues,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
    defaultValues,
  })

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <FormTitle>{title}</FormTitle>

        <div className="space-y-1">
          <FormLabel htmlFor="title">タイトル</FormLabel>
          <TextInput
            id="title"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        <div className="space-y-1">
          <FormLabel htmlFor="content">内容</FormLabel>
          <TextArea
            id="content"
            rows={5}
            error={errors.content?.message}
            {...register("content")}
          />
        </div>

        <div className="pt-3">
          <SubmitButton disabled={isSubmitting}>{submitLabel}</SubmitButton>
        </div>
      </form>
    </Card>
  )
}
