import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <span className="text-orange-500 font-bold text-4xl">DSS</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Проверьте email</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Спасибо за регистрацию!</CardTitle>
              <CardDescription>Подтвердите свой email адрес</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Мы отправили письмо с подтверждением на ваш email адрес. Пожалуйста, проверьте почту и перейдите по
                  ссылке для активации аккаунта.
                </p>
                <div className="text-center">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full bg-transparent">
                      Вернуться к входу
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
