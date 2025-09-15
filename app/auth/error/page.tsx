import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <span className="text-orange-500 font-bold text-4xl">DSS</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Ошибка</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Что-то пошло не так</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {params?.error ? (
                  <p className="text-sm text-muted-foreground">Код ошибки: {params.error}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Произошла неизвестная ошибка.</p>
                )}
                <div className="text-center">
                  <Link href="/auth/login">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">Попробовать снова</Button>
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
