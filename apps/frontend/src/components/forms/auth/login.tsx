"use client"

import Card from "@/components/common/Card"
import messages from "@/libs/constants/messages"
import { LoginData, loginSchema } from "@/libs/validations/auth"
import { useAuth } from "@/providers/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import TextInput from "../common/Input"
import FormLabel from "../common/Label"
import SubmitButton from "../common/SubmitButton"
import FormTitle from "../common/Title"

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setIsSubmitting(true)
    try {
      await login(data)

      toast.success(messages.loginSuccessfulMessage)
      navigate("/")
    } catch (error) {
      setIsSubmitting(false)

      if (error instanceof Error) {
        switch (error.message) {
          case "Invalid credentials":
            toast.error(messages.invalidCredentialsMessage)
            break
          default:
            toast.error(messages.commonMessage)
            console.error(error)
        }
      } else {
        toast.error(messages.commonMessage)
        console.error(error)
      }
    }
  }

  return (
    <Card className="max-w-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
        <FormTitle>ログイン</FormTitle>

        <div className="space-y-1">
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <TextInput
            id="email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="space-y-1">
          <FormLabel htmlFor="password">パスワード</FormLabel>
          <TextInput
            id="password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="pt-3">
          <SubmitButton disabled={isSubmitting}>ログイン</SubmitButton>
        </div>
      </form>
    </Card>
  )
}
