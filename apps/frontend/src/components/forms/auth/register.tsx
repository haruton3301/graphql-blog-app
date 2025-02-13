"use client"

import Card from "@/components/common/Card"
import messages from "@/libs/constants/messages"
import { authService } from "@/libs/services"
import { RegisterData, registerSchema } from "@/libs/validations/auth"
import { useAuth } from "@/providers/auth"
import { ApolloError } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import TextInput from "../common/Input"
import FormLabel from "../common/Label"
import SubmitButton from "../common/SubmitButton"
import FormTitle from "../common/Title"

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    setIsSubmitting(true)
    try {
      await authService.register(data)
      await login({
        email: data.email,
        password: data.password,
      })

      toast.success(messages.registerSuccessfulMessage)
      navigate("/")
    } catch (error) {
      setIsSubmitting(false)

      if (error instanceof ApolloError) {
        switch (error.message) {
          case "Email already taken":
            toast.error(messages.emailAlreadyTakenMessage)
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
        <FormTitle>ユーザー登録</FormTitle>

        <div className="space-y-1">
          <FormLabel htmlFor="name">ユーザー名</FormLabel>
          <TextInput
            id="name"
            type="text"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

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
          <SubmitButton disabled={isSubmitting}>登録</SubmitButton>
        </div>
      </form>
    </Card>
  )
}
