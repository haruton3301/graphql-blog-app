import Breadcrumbs, { Breadcrumb } from "@/components/common/Breadcrumbs"
import MetaTitle from "@/components/common/MetaTitle"
import RegisterForm from "@/components/forms/auth/register"

export default function RegisterPage() {
  const breadcrumbs: Array<Breadcrumb> = [
    {
      label: "ユーザー登録",
    },
  ]
  return (
    <>
      <MetaTitle title="ユーザー登録" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </>
  )
}
