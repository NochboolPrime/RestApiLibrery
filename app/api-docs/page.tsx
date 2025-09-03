"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ApiDocsPage() {
  useEffect(() => {
    // Динамически загружаем Swagger UI
    const script = document.createElement("script")
    script.src = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"
    script.onload = () => {
      // @ts-ignore
      window.SwaggerUIBundle({
        url: "/api/swagger.json",
        dom_id: "#swagger-ui",
        presets: [
          // @ts-ignore
          window.SwaggerUIBundle.presets.apis,
          // @ts-ignore
          window.SwaggerUIBundle.presets.standalone,
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
      })
    }
    document.head.appendChild(script)

    // Загружаем CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="gap-2 mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Назад к приложению
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Todo API Documentation</CardTitle>
              <CardDescription>
                Интерактивная документация REST API с возможностью тестирования endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Базовый URL:</h3>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {typeof window !== "undefined" ? window.location.origin : ""}/api
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Формат ответов:</h3>
                  <p className="text-sm text-muted-foreground">
                    Все ответы возвращаются в формате JSON с полями success, data/error
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Доступные endpoints:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• GET /api/todos - получить все задачи</li>
                    <li>• POST /api/todos - создать новую задачу</li>
                    <li>• GET /api/todos/[id] - получить задачу по ID</li>
                    <li>• PUT /api/todos/[id] - обновить задачу</li>
                    <li>• DELETE /api/todos/[id] - удалить задачу</li>
                    <li>• GET /api/todos/stats - получить статистику</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Swagger UI Container */}
        <div id="swagger-ui" className="bg-white rounded-lg shadow-sm"></div>
      </div>
    </div>
  )
}
