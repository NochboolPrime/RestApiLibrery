"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }
    checkUser()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6 text-center">
          <span className="text-orange-500 font-bold text-4xl">DSS</span>
          <p className="text-gray-600 mt-2">Загрузка...</p>
        </CardContent>
      </Card>
    </div>
  )
}
