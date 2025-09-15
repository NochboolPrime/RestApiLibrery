"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token_hash || type !== "email") {
          setStatus("error")
          setMessage("Неверная ссылка подтверждения. Проверьте ссылку из письма.")
          return
        }

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: "email",
        })

        if (error) {
          console.error("Email confirmation error:", error)
          setStatus("error")
          setMessage("Ошибка подтверждения email. Возможно, ссылка устарела или уже была использована.")
          return
        }

        if (data.user) {
          setStatus("success")
          setMessage("Email успешно подтвержден! Теперь вы можете войти в систему.")

          // Перенаправляем на страницу входа через 3 секунды
          setTimeout(() => {
            router.push("/auth/login?message=Email подтвержден, теперь вы можете войти")
          }, 3000)
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        setStatus("error")
        setMessage("Произошла неожиданная ошибка. Попробуйте еще раз.")
      }
    }

    confirmEmail()
  }, [searchParams, router, supabase.auth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />}
            {status === "success" && <CheckCircle className="w-12 h-12 text-green-500" />}
            {status === "error" && <XCircle className="w-12 h-12 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Подтверждение email..."}
            {status === "success" && "Email подтвержден!"}
            {status === "error" && "Ошибка подтверждения"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Mail className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Готово!</span>
                </div>
                <p className="text-sm text-green-700">
                  Ваш аккаунт активирован. Вы будете перенаправлены на страницу входа.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/auth/login">Войти в систему</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">Если проблема повторяется, попробуйте:</p>
                <ul className="text-sm text-red-600 mt-2 space-y-1">
                  <li>• Проверить ссылку в письме</li>
                  <li>• Запросить новое письмо подтверждения</li>
                  <li>• Обратиться в поддержку</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/auth/register">Регистрация</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/auth/login">Вход</Link>
                </Button>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Пожалуйста, подождите...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
