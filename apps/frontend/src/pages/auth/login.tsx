import Breadcrumbs, { Breadcrumb } from "@/components/common/Breadcrumbs"
import MetaTitle from "@/components/common/MetaTitle"
import LoginForm from "@/components/forms/auth/login"

export default function LoginPage() {
  const breadcrumbs: Array<Breadcrumb> = [
    {
      label: "ログイン",
    },
  ]

  return (
    <>
      <MetaTitle title="ログイン" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </>
  )
}
