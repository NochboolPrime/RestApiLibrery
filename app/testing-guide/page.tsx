"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, ExternalLink, Send, Copy, Check, Shield, Key } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function TestingGuidePage() {
  const [method, setMethod] = useState("GET")
  const [endpoint, setEndpoint] = useState("/api/books")
  const [headers, setHeaders] = useState(
    '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"\n}',
  )
  const [body, setBody] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setResponse("")

    try {
      const parsedHeaders = headers ? JSON.parse(headers) : {}
      const config: RequestInit = {
        method,
        headers: parsedHeaders,
      }

      if (method !== "GET" && method !== "DELETE" && body) {
        config.body = body
      }

      const res = await fetch(endpoint, config)
      const responseData = await res.json()

      const responseInfo = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: responseData,
      }

      setResponse(JSON.stringify(responseInfo, null, 2))
    } catch (error) {
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const examples = [
    {
      name: "Получить все книги",
      method: "GET",
      endpoint: "/api/books",
      headers: '{\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}',
      body: "",
    },
    {
      name: "Добавить книгу",
      method: "POST",
      endpoint: "/api/books",
      headers:
        '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}',
      body: '{\n  "title": "1984",\n  "author": "Джордж Оруэлл",\n  "year": 1949,\n  "genre": "Антиутопия",\n  "pages": 328,\n  "rating": 5,\n  "status": "unread",\n  "notes": "Классическая антиутопия о тоталитарном обществе"\n}',
    },
    {
      name: "Обновить статус книги",
      method: "PUT",
      endpoint: "/api/books/1",
      headers:
        '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}',
      body: '{\n  "status": "completed",\n  "rating": 5\n}',
    },
    {
      name: "Получить статистику",
      method: "GET",
      endpoint: "/api/books/stats",
      headers: '{\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n}',
      body: "",
    },
  ]

  const loadExample = (example: (typeof examples)[0]) => {
    setMethod(example.method)
    setEndpoint(example.endpoint)
    setHeaders(example.headers)
    setBody(example.body)
    setResponse("")
  }

  const postmanCollection = {
    info: {
      name: "Book Library API Service with JWT Auth",
      description: "Коллекция для тестирования API библиотеки книг с JWT аутентификацией",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: {
      type: "bearer",
      bearer: [
        {
          key: "token",
          value: "{{jwt_token}}",
          type: "string",
        },
      ],
    },
    item: [
      {
        name: "Authentication",
        item: [
          {
            name: "Login User",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    email: "user@example.com",
                    password: "password123",
                  },
                  null,
                  2,
                ),
              },
              url: {
                raw: "{{baseUrl}}/auth/login",
                host: ["{{baseUrl}}"],
                path: ["auth", "login"],
              },
            },
          },
          {
            name: "Register User",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    email: "newuser@example.com",
                    password: "password123",
                    display_name: "New User",
                  },
                  null,
                  2,
                ),
              },
              url: {
                raw: "{{baseUrl}}/auth/register",
                host: ["{{baseUrl}}"],
                path: ["auth", "register"],
              },
            },
          },
        ],
      },
      {
        name: "Books API",
        item: [
          {
            name: "Get All Books",
            request: {
              method: "GET",
              header: [
                {
                  key: "Authorization",
                  value: "Bearer {{jwt_token}}",
                },
              ],
              url: {
                raw: "{{baseUrl}}/api/books",
                host: ["{{baseUrl}}"],
                path: ["api", "books"],
              },
            },
          },
          {
            name: "Create Book",
            request: {
              method: "POST",
              header: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
                {
                  key: "Authorization",
                  value: "Bearer {{jwt_token}}",
                },
              ],
              body: {
                mode: "raw",
                raw: JSON.stringify(
                  {
                    title: "1984",
                    author: "Джордж Оруэлл",
                    year: 1949,
                    genre: "Антиутопия",
                    pages: 328,
                    rating: 5,
                    status: "unread",
                    notes: "Классическая антиутопия о тоталитарном обществе",
                  },
                  null,
                  2,
                ),
              },
              url: {
                raw: "{{baseUrl}}/api/books",
                host: ["{{baseUrl}}"],
                path: ["api", "books"],
              },
            },
          },
        ],
      },
    ],
    variable: [
      {
        key: "baseUrl",
        value: "http://localhost:3000",
      },
      {
        key: "jwt_token",
        value: "your_jwt_token_here",
        type: "string",
      },
    ],
  }

  const downloadCollection = () => {
    const dataStr = JSON.stringify(postmanCollection, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "Book-Library-API-JWT-Collection.postman_collection.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2 mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Назад к библиотеке
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Руководство по тестированию API</h1>
            <p className="text-muted-foreground">
              Полное руководство по тестированию API Библиотеки Книг с JWT аутентификацией
            </p>
          </div>

          <Tabs defaultValue="authentication" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="authentication">JWT Аутентификация</TabsTrigger>
              <TabsTrigger value="interactive">Интерактивное тестирование</TabsTrigger>
              <TabsTrigger value="documentation">Документация API</TabsTrigger>
              <TabsTrigger value="postman">Postman & Инструменты</TabsTrigger>
            </TabsList>

            <TabsContent value="authentication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    JWT Аутентификация
                  </CardTitle>
                  <CardDescription>
                    Все API endpoints требуют JWT токен для доступа к персональной библиотеке пользователя
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">Важно!</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Все запросы к API должны содержать валидный JWT токен в заголовке Authorization. Без токена доступ
                      к данным будет запрещен.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Получение JWT токена</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">1. Регистрация нового пользователя</h4>
                          <div className="bg-muted p-3 rounded text-sm font-mono">
                            <div className="text-green-600 mb-1">POST /auth/register</div>
                            <pre>{`{
  "email": "user@example.com",
  "password": "password123",
  "display_name": "Иван Иванов"
}`}</pre>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">2. Вход в систему</h4>
                          <div className="bg-muted p-3 rounded text-sm font-mono">
                            <div className="text-blue-600 mb-1">POST /auth/login</div>
                            <pre>{`{
  "email": "user@example.com",
  "password": "password123"
}`}</pre>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">3. Ответ с JWT токеном</h4>
                          <div className="bg-muted p-3 rounded text-sm font-mono">
                            <pre>{`{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 3600
    }
  }
}`}</pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Использование JWT токена</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Заголовок Authorization</h4>
                          <div className="bg-muted p-3 rounded text-sm font-mono">
                            <pre>{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzA2MjQwNDAwLCJpYXQiOjE3MDYyMzY4MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJ1c2VyLWlkLWhlcmUiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTcwNjIzNjgwMH1dLCJzZXNzaW9uX2lkIjoic2Vzc2lvbi1pZC1oZXJlIn0.signature-here`}</pre>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Пример запроса с токеном</h4>
                          <div className="bg-muted p-3 rounded text-sm font-mono">
                            <pre>{`curl -X GET http://localhost:3000/api/books \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"`}</pre>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Структура JWT токена</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Header:</span>
                              <div className="bg-muted p-2 rounded font-mono text-xs">
                                {"{"}"alg": "HS256", "typ": "JWT"{"}"}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Payload:</span>
                              <div className="bg-muted p-2 rounded font-mono text-xs">
                                {"{"}
                                <br />
                                &nbsp;&nbsp;"sub": "user-id-here",
                                <br />
                                &nbsp;&nbsp;"email": "user@example.com",
                                <br />
                                &nbsp;&nbsp;"exp": 1706240400,
                                <br />
                                &nbsp;&nbsp;"iat": 1706236800
                                <br />
                                {"}"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Обработка ошибок аутентификации</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">401</Badge>
                          <span className="font-medium">Unauthorized</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Отсутствует заголовок Authorization</li>
                          <li>• Неверный формат токена</li>
                          <li>• Токен истек</li>
                          <li>• Недействительная подпись токена</li>
                        </ul>
                        <div className="bg-muted p-2 rounded text-sm font-mono mt-2">
                          <pre>{`{
  "success": false,
  "error": "Unauthorized"
}`}</pre>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">403</Badge>
                          <span className="font-medium">Forbidden</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Доступ к чужим данным</li>
                          <li>• Недостаточно прав</li>
                          <li>• Заблокированный аккаунт</li>
                        </ul>
                        <div className="bg-muted p-2 rounded text-sm font-mono mt-2">
                          <pre>{`{
  "success": false,
  "error": "Access denied"
}`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Тестовые JWT токены</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 mb-3">
                        <strong>Только для разработки!</strong> Используйте эти токены только в тестовой среде:
                      </p>
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium text-sm mb-1">Пользователь: test@example.com</div>
                          <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3Nzc2NDAwLCJpYXQiOjE3MDYyNDA0MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJ0ZXN0LXVzZXItaWQtMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.test-signature-here
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm mb-1">Пользователь: admin@example.com</div>
                          <div className="bg-muted p-2 rounded text-xs font-mono break-all">
                            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3Nzc2NDAwLCJpYXQiOjE3MDYyNDA0MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJhZG1pbi11c2VyLWlkLTQ1NiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4ifQ.admin-signature-here
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interactive" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🧪 Интерактивное тестирование API</CardTitle>
                  <CardDescription>
                    Тестируйте API библиотеки книг прямо в браузере с JWT аутентификацией
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-800">Требуется аутентификация!</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Все API endpoints защищены JWT токенами. Без валидного токена в заголовке Authorization вы
                      получите ошибку 401 Unauthorized. Сначала войдите в систему или используйте тестовый токен.
                    </p>
                  </div>

                  {/* Quick Examples */}
                  <div>
                    <Label className="text-base font-semibold">Быстрые примеры:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMethod("GET")
                          setEndpoint("/api/books")
                          setHeaders(
                            '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3Nzc2NDAwLCJpYXQiOjE3MDYyNDA0MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJ0ZXN0LXVzZXItaWQtMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.test-signature-here"\n}',
                          )
                          setBody("")
                        }}
                      >
                        📚 Получить все книги
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMethod("POST")
                          setEndpoint("/api/books")
                          setHeaders(
                            '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3Nzc2NDAwLCJpYXQiOjE3MDYyNDA0MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJ0ZXN0LXVzZXItaWQtMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.test-signature-here"\n}',
                          )
                          setBody(
                            '{\n  "title": "Чистый код",\n  "author": "Роберт Мартин",\n  "year": 2008,\n  "genre": "Программирование",\n  "pages": 464,\n  "status": "unread"\n}',
                          )
                        }}
                      >
                        ➕ Добавить книгу
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMethod("GET")
                          setEndpoint("/api/books/stats")
                          setHeaders(
                            '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3Nzc2NDAwLCJpYXQiOjE3MDYyNDA0MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJ0ZXN0LXVzZXItaWQtMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.test-signature-here"\n}',
                          )
                          setBody("")
                        }}
                      >
                        📊 Статистика
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMethod("GET")
                          setEndpoint("/api/books")
                          setHeaders('{\n  "Content-Type": "application/json"\n}')
                          setBody("")
                        }}
                      >
                        ❌ Тест без токена
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">Тестирование аутентификации:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 bg-transparent"
                        onClick={() => {
                          setMethod("GET")
                          setEndpoint("/api/books")
                          setHeaders(
                            '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM3Nzc2NDAwLCJpYXQiOjE3MDYyNDA0MDAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjMwMDAiLCJzdWIiOiJ0ZXN0LXVzZXItaWQtMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.test-signature-here"\n}',
                          )
                          setBody("")
                        }}
                      >
                        ✅ С валидным токеном
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 bg-transparent"
                        onClick={() => {
                          setMethod("GET")
                          setEndpoint("/api/books")
                          setHeaders('{\n  "Content-Type": "application/json"\n}')
                          setBody("")
                        }}
                      >
                        ❌ Без токена
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-200 bg-transparent"
                        onClick={() => {
                          setMethod("GET")
                          setEndpoint("/api/books")
                          setHeaders(
                            '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer invalid.token.here"\n}',
                          )
                          setBody("")
                        }}
                      >
                        ⚠️ С неверным токеном
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="method">HTTP Метод</Label>
                        <Select value={method} onValueChange={setMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="endpoint">Endpoint</Label>
                        <Input
                          id="endpoint"
                          value={endpoint}
                          onChange={(e) => setEndpoint(e.target.value)}
                          placeholder="/api/books"
                        />
                      </div>

                      <div>
                        <Label htmlFor="headers">Заголовки (JSON)</Label>
                        <Textarea
                          id="headers"
                          value={headers}
                          onChange={(e) => setHeaders(e.target.value)}
                          placeholder='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_JWT_TOKEN"}'
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>

                      {method !== "GET" && method !== "DELETE" && (
                        <div>
                          <Label htmlFor="body">Тело запроса (JSON)</Label>
                          <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder='{"title": "Название книги", "author": "Автор"}'
                            rows={8}
                            className="font-mono text-sm"
                          />
                        </div>
                      )}

                      <Button onClick={handleTest} disabled={loading} className="w-full">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Отправить запрос
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Ответ сервера</Label>
                        {response && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(response)
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={response}
                        readOnly
                        placeholder="Ответ появится здесь после отправки запроса..."
                        rows={20}
                        className="font-mono text-sm"
                      />

                      {!response && (
                        <div className="space-y-3">
                          <div className="text-sm font-medium">Ожидаемые ответы:</div>
                          <div className="space-y-2">
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <div className="font-medium text-red-800 text-sm mb-1">
                                401 Unauthorized (без токена):
                              </div>
                              <pre className="text-xs text-red-700">{`{
  "success": false,
  "error": "Unauthorized"
}`}</pre>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <div className="font-medium text-green-800 text-sm mb-1">200 OK (с токеном):</div>
                              <pre className="text-xs text-green-700">{`{
  "success": true,
  "data": [...],
  "pagination": {...}
}`}</pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-6">
              {/* Quick Start */}
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Быстрый старт</CardTitle>
                  <CardDescription>Начните тестирование API библиотеки за несколько минут</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">1. Скачайте Postman коллекцию</h4>
                      <Button onClick={downloadCollection} className="gap-2">
                        <Download className="w-4 h-4" />
                        Скачать коллекцию
                      </Button>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">2. Откройте Swagger документацию</h4>
                      <Link href="/api-docs">
                        <Button variant="outline" className="gap-2 bg-transparent">
                          <ExternalLink className="w-4 h-4" />
                          Swagger UI
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Базовый URL для тестирования:</h4>
                    <code className="text-sm">http://localhost:3000/api</code>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-800">Требуется аутентификация</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Все API endpoints требуют JWT токен в заголовке Authorization. Сначала зарегистрируйтесь или
                      войдите в систему для получения токена.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📚 API Endpoints</CardTitle>
                  <CardDescription>
                    Полный список доступных endpoints для управления персональной библиотекой книг
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* GET All Books */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/books</code>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        JWT Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Получить все книги текущего пользователя с возможностью фильтрации
                    </p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Заголовки:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>

                      <h5 className="font-medium">Параметры запроса:</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>
                          • <code>status</code> (string, optional) - фильтр по статусу чтения (completed, unread,
                          reading)
                        </li>
                        <li>
                          • <code>genre</code> (string, optional) - фильтр по жанру
                        </li>
                        <li>
                          • <code>search</code> (string, optional) - поиск по названию или автору
                        </li>
                      </ul>

                      <h5 className="font-medium">Примеры:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        <div>GET /api/books</div>
                        <div>GET /api/books?status=completed</div>
                        <div>GET /api/books?genre=Фантастика</div>
                        <div>GET /api/books?search=Оруэлл</div>
                      </div>
                    </div>
                  </div>

                  {/* POST Create Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default">POST</Badge>
                      <code className="text-sm">/api/books</code>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        JWT Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Добавить новую книгу в персональную библиотеку</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Заголовки:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        Content-Type: application/json
                        <br />
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>

                      <h5 className="font-medium">Тело запроса (JSON):</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        <pre>{`{
  "title": "Мастер и Маргарита",
  "author": "Михаил Булгаков",
  "year": 1967,
  "genre": "Фантастика",
  "pages": 480,
  "rating": 5,
  "status": "unread",
  "notes": "Классика русской литературы с элементами мистики"
}`}</pre>
                      </div>

                      <h5 className="font-medium">Обязательные поля:</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>
                          • <code>title</code> (string, 1-200 символов) - название книги
                        </li>
                        <li>
                          • <code>author</code> (string, 1-100 символов) - автор книги
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* GET Single Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/books/[id]</code>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        JWT Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Получить информацию о конкретной книге пользователя по ID
                    </p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Заголовки:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>

                      <h5 className="font-medium">Пример:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">GET /api/books/1</div>
                    </div>
                  </div>

                  {/* PUT Update Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">PUT</Badge>
                      <code className="text-sm">/api/books/[id]</code>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        JWT Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Обновить информацию о существующей книге пользователя
                    </p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Заголовки:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        Content-Type: application/json
                        <br />
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>

                      <h5 className="font-medium">Примеры тела запроса:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        <pre>{`// Обновить только статус чтения
{
  "status": "completed"
}

// Обновить рейтинг
{
  "rating": 4
}

// Обновить статус и добавить заметки
{
  "status": "completed",
  "rating": 5,
  "notes": "Отличная книга, рекомендую всем!"
}`}</pre>
                      </div>
                    </div>
                  </div>

                  {/* DELETE Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="destructive">DELETE</Badge>
                      <code className="text-sm">/api/books/[id]</code>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        JWT Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Удалить книгу из персональной библиотеки по ID</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Заголовки:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>

                      <h5 className="font-medium">Пример:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">DELETE /api/books/1</div>
                    </div>
                  </div>

                  {/* GET Stats */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/books/stats</code>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        JWT Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Получить статистику персональной библиотеки пользователя
                    </p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Заголовки:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>

                      <h5 className="font-medium">Пример ответа:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        <pre>{`{
  "success": true,
  "data": {
    "total": 15,
    "completed": 8,
    "reading": 5,
    "unread": 2,
    "genres": 6
  }
}`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>⚠️ Обработка ошибок</CardTitle>
                  <CardDescription>Типичные ошибки и коды ответов при работе с библиотекой</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">401</Badge>
                          <span className="font-medium">Unauthorized</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Отсутствует заголовок Authorization</li>
                          <li>• Неверный или истекший JWT токен</li>
                          <li>• Неверный формат токена</li>
                          <li>• Пользователь не аутентифицирован</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">403</Badge>
                          <span className="font-medium">Forbidden</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Попытка доступа к чужим данным</li>
                          <li>• Недостаточно прав доступа</li>
                          <li>• Заблокированный аккаунт</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">400</Badge>
                          <span className="font-medium">Bad Request</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Отсутствует обязательное поле title или author</li>
                          <li>• Неверный формат JSON</li>
                          <li>• Неверный тип данных</li>
                          <li>• Рейтинг вне диапазона 1-5</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">404</Badge>
                          <span className="font-medium">Not Found</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Книга с указанным ID не найдена</li>
                          <li>• Книга не принадлежит пользователю</li>
                          <li>• Неверный endpoint</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Формат ошибок:</h4>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`{
  "success": false,
  "error": "Описание ошибки"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="postman" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🧪 Тестирование в Postman с JWT</CardTitle>
                  <CardDescription>
                    Пошаговое руководство по настройке и использованию Postman для библиотеки книг с аутентификацией
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Шаг 1: Импорт коллекции</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>1. Скачайте коллекцию выше</li>
                        <li>2. Откройте Postman</li>
                        <li>3. Нажмите "Import" → "Upload Files"</li>
                        <li>4. Выберите скачанный файл</li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Шаг 2: Настройка переменных окружения</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <div className="font-medium mb-2">Переменные окружения:</div>
                        <div className="space-y-1">
                          <div>
                            <code>baseUrl</code> = <code>http://localhost:3000</code>
                          </div>
                          <div>
                            <code>jwt_token</code> = <code>your_jwt_token_here</code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Шаг 3: Последовательность тестирования с аутентификацией</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>
                          1. <strong>POST /auth/register</strong> - зарегистрировать нового пользователя
                        </li>
                        <li>
                          2. <strong>POST /auth/login</strong> - войти в систему и получить JWT токен
                        </li>
                        <li>
                          3. <strong>Сохранить токен</strong> - скопировать access_token в переменную jwt_token
                        </li>
                        <li>
                          4. <strong>GET /api/books</strong> - проверить пустую библиотеку пользователя
                        </li>
                        <li>
                          5. <strong>POST /api/books</strong> - добавить новую книгу
                        </li>
                        <li>
                          6. <strong>GET /api/books/[id]</strong> - получить добавленную книгу
                        </li>
                        <li>
                          7. <strong>PUT /api/books/[id]</strong> - обновить статус на "reading"
                        </li>
                        <li>
                          8. <strong>PUT /api/books/[id]</strong> - изменить статус на "completed" и поставить рейтинг
                        </li>
                        <li>
                          9. <strong>GET /api/books/stats</strong> - проверить обновленную статистику
                        </li>
                        <li>
                          10. <strong>GET /api/books?status=completed</strong> - фильтрация прочитанных книг
                        </li>
                        <li>
                          11. <strong>DELETE /api/books/[id]</strong> - удалить книгу (опционально)
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Шаг 4: Автоматические тесты с JWT</h4>
                      <p className="text-sm text-muted-foreground mb-2">Добавьте в раздел "Tests" каждого запроса:</p>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`// Для запроса логина - сохранить токен
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.session) {
        pm.environment.set("jwt_token", jsonData.data.session.access_token);
    }
}

// Проверка аутентификации
pm.test("User is authenticated", function () {
    pm.response.to.not.have.status(401);
});

// Проверка статуса ответа
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Проверка структуры ответа
pm.test("Response has success field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.true;
});

// Проверка данных книги
pm.test("Book belongs to user", function () {
    const jsonData = pm.response.json();
    if (jsonData.data && !Array.isArray(jsonData.data)) {
        pm.expect(jsonData.data).to.have.property('user_id');
        pm.expect(jsonData.data).to.have.property('title');
        pm.expect(jsonData.data).to.have.property('author');
    }
});`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Шаг 5: Настройка Authorization в коллекции</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>1. Выберите коллекцию в Postman</li>
                        <li>2. Перейдите на вкладку "Authorization"</li>
                        <li>3. Выберите тип "Bearer Token"</li>
                        <li>4. В поле Token введите: {`{{jwt_token}}`}</li>
                        <li>5. Все запросы в коллекции будут использовать этот токен</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🛠️ Альтернативные инструменты с JWT</CardTitle>
                  <CardDescription>Другие способы тестирования API библиотеки книг с аутентификацией</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">cURL с JWT</h4>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`# Вход в систему
curl -X POST http://localhost:3000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123"}'

# Получить все книги с токеном
curl -X GET http://localhost:3000/api/books \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Добавить книгу с токеном
curl -X POST http://localhost:3000/api/books \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -d '{
    "title":"Война и мир",
    "author":"Лев Толстой",
    "year":1869,
    "genre":"Роман",
    "pages":1300,
    "status":"unread"
  }'`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">JavaScript Fetch с JWT</h4>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`// Получить токен при входе
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { data } = await loginResponse.json();
const token = data.session.access_token;

// Использовать токен для API запросов
const booksResponse = await fetch('/api/books', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

// Добавить книгу с токеном
await fetch('/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`
  },
  body: JSON.stringify({
    title: 'Чистый код',
    author: 'Роберт Мартин',
    year: 2008,
    genre: 'Программирование',
    pages: 464,
    status: 'reading'
  })
});`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
