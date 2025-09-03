"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, ExternalLink, Send, Copy, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TestingGuidePage() {
  const [method, setMethod] = useState("GET")
  const [endpoint, setEndpoint] = useState("/api/books")
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}')
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
      headers: "{}",
      body: "",
    },
    {
      name: "Добавить книгу",
      method: "POST",
      endpoint: "/api/books",
      headers: '{\n  "Content-Type": "application/json"\n}',
      body: '{\n  "title": "1984",\n  "author": "Джордж Оруэлл",\n  "year": 1949,\n  "genre": "Антиутопия",\n  "pages": 328,\n  "rating": 5,\n  "status": "unread",\n  "notes": "Классическая антиутопия о тоталитарном обществе"\n}',
    },
    {
      name: "Обновить статус книги",
      method: "PUT",
      endpoint: "/api/books/1",
      headers: '{\n  "Content-Type": "application/json"\n}',
      body: '{\n  "status": "read",\n  "rating": 5\n}',
    },
    {
      name: "Получить статистику",
      method: "GET",
      endpoint: "/api/books/stats",
      headers: "{}",
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
      name: "Book Library API Service",
      description: "Коллекция для тестирования API библиотеки книг",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [
      {
        name: "Get All Books",
        request: {
          method: "GET",
          header: [],
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
    variable: [
      {
        key: "baseUrl",
        value: "http://localhost:3000",
      },
    ],
  }

  const downloadCollection = () => {
    const dataStr = JSON.stringify(postmanCollection, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "Book-Library-API-Collection.postman_collection.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/">
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
              Полное руководство по тестированию API Библиотеки Книг с помощью Postman и других инструментов
            </p>
          </div>

          <Tabs defaultValue="interactive" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="interactive">Интерактивное тестирование</TabsTrigger>
              <TabsTrigger value="documentation">Документация API</TabsTrigger>
              <TabsTrigger value="postman">Postman & Инструменты</TabsTrigger>
            </TabsList>

            <TabsContent value="interactive" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🧪 Интерактивное тестирование API</CardTitle>
                  <CardDescription>
                    Тестируйте API библиотеки книг прямо в браузере без дополнительных инструментов
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Examples */}
                  <div>
                    <Label className="text-base font-semibold">Быстрые примеры:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                      {examples.map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => loadExample(example)}
                          className="text-left justify-start"
                        >
                          {example.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Request Configuration */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Настройка запроса</h3>

                      {/* Method and Endpoint */}
                      <div className="flex gap-2">
                        <div className="w-32">
                          <Label htmlFor="method">Метод</Label>
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
                        <div className="flex-1">
                          <Label htmlFor="endpoint">Endpoint</Label>
                          <Input
                            id="endpoint"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            placeholder="/api/books"
                          />
                        </div>
                      </div>

                      {/* Headers */}
                      <div>
                        <Label htmlFor="headers">Заголовки (JSON)</Label>
                        <Textarea
                          id="headers"
                          value={headers}
                          onChange={(e) => setHeaders(e.target.value)}
                          placeholder='{"Content-Type": "application/json"}'
                          rows={4}
                        />
                      </div>

                      {/* Body */}
                      {method !== "GET" && method !== "DELETE" && (
                        <div>
                          <Label htmlFor="body">Тело запроса (JSON)</Label>
                          <Textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder='{"title": "Название книги", "author": "Автор"}'
                            rows={8}
                          />
                        </div>
                      )}

                      {/* Send Button */}
                      <Button onClick={handleTest} disabled={loading} className="w-full gap-2">
                        <Send className="w-4 h-4" />
                        {loading ? "Отправка..." : "Отправить запрос"}
                      </Button>
                    </div>

                    {/* Response */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Ответ</h3>
                        {response && (
                          <Button variant="outline" size="sm" onClick={copyResponse} className="gap-2 bg-transparent">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Скопировано" : "Копировать"}
                          </Button>
                        )}
                      </div>

                      <div className="border rounded-lg">
                        <Textarea
                          value={response || "Ответ появится здесь после отправки запроса..."}
                          readOnly
                          rows={20}
                          className="font-mono text-sm resize-none border-0"
                        />
                      </div>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>📚 API Endpoints</CardTitle>
                  <CardDescription>Полный список доступных endpoints для управления библиотекой книг</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* GET All Books */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/books</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Получить все книги с возможностью фильтрации</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Параметры запроса:</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>
                          • <code>status</code> (string, optional) - фильтр по статусу чтения (read, unread, reading)
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
                        <div>GET /api/books?status=read</div>
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
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Добавить новую книгу в библиотеку</p>

                    <div className="space-y-2">
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

                      <h5 className="font-medium">Опциональные поля:</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>
                          • <code>year</code> (number) - год издания
                        </li>
                        <li>
                          • <code>genre</code> (string) - жанр книги
                        </li>
                        <li>
                          • <code>pages</code> (number) - количество страниц
                        </li>
                        <li>
                          • <code>rating</code> (number, 1-5) - рейтинг книги
                        </li>
                        <li>
                          • <code>status</code> (string) - статус чтения: "unread", "reading", "read"
                        </li>
                        <li>
                          • <code>notes</code> (string) - заметки о книге
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* GET Single Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/books/[id]</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Получить информацию о конкретной книге по ID</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Пример:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">GET /api/books/1</div>
                    </div>
                  </div>

                  {/* PUT Update Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">PUT</Badge>
                      <code className="text-sm">/api/books/[id]</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Обновить информацию о существующей книге</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Примеры тела запроса:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        <pre>{`// Обновить только статус чтения
{
  "status": "read"
}

// Обновить рейтинг
{
  "rating": 4
}

// Обновить статус и добавить заметки
{
  "status": "read",
  "rating": 5,
  "notes": "Отличная книга, рекомендую всем!"
}

// Полное обновление
{
  "title": "1984 (новое издание)",
  "author": "Джордж Оруэлл",
  "year": 2023,
  "genre": "Антиутопия",
  "pages": 350,
  "rating": 5,
  "status": "read",
  "notes": "Переиздание с новыми комментариями"
}`}</pre>
                      </div>
                    </div>
                  </div>

                  {/* DELETE Book */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="destructive">DELETE</Badge>
                      <code className="text-sm">/api/books/[id]</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Удалить книгу из библиотеки по ID</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Пример:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">DELETE /api/books/1</div>
                    </div>
                  </div>

                  {/* GET Stats */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">GET</Badge>
                      <code className="text-sm">/api/books/stats</code>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Получить статистику библиотеки</p>

                    <div className="space-y-2">
                      <h5 className="font-medium">Пример ответа:</h5>
                      <div className="bg-muted p-2 rounded text-sm font-mono">
                        <pre>{`{
  "success": true,
  "data": {
    "totalBooks": 15,
    "readBooks": 8,
    "toReadBooks": 5,
    "readingBooks": 2,
    "genres": 6,
    "averageRating": 4.2,
    "totalPages": 4580
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
                          <Badge variant="destructive">400</Badge>
                          <span className="font-medium">Bad Request</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Отсутствует обязательное поле title или author</li>
                          <li>• Неверный формат JSON</li>
                          <li>• Неверный тип данных (например, rating не число)</li>
                          <li>• Рейтинг вне диапазона 1-5</li>
                          <li>• Неверный статус чтения</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">404</Badge>
                          <span className="font-medium">Not Found</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Книга с указанным ID не найдена</li>
                          <li>• Неверный endpoint</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">500</Badge>
                          <span className="font-medium">Internal Server Error</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Внутренняя ошибка сервера</li>
                          <li>• Проблемы с хранилищем данных</li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default">200/201</Badge>
                          <span className="font-medium">Success</span>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 200 - успешное получение/обновление книги</li>
                          <li>• 201 - успешное добавление новой книги</li>
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
                  <CardTitle>🧪 Тестирование в Postman</CardTitle>
                  <CardDescription>
                    Пошаговое руководство по настройке и использованию Postman для библиотеки книг
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
                      <h4 className="font-semibold mb-2">Шаг 2: Настройка переменных</h4>
                      <div className="bg-muted p-3 rounded text-sm">
                        <div className="font-medium mb-1">Переменная окружения:</div>
                        <div>
                          <code>baseUrl</code> = <code>http://localhost:3000</code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Шаг 3: Последовательность тестирования библиотеки</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground ml-4">
                        <li>
                          1. <strong>GET /api/books</strong> - проверить начальное состояние библиотеки
                        </li>
                        <li>
                          2. <strong>POST /api/books</strong> - добавить новую книгу
                        </li>
                        <li>
                          3. <strong>GET /api/books/[id]</strong> - получить добавленную книгу
                        </li>
                        <li>
                          4. <strong>PUT /api/books/[id]</strong> - обновить статус на "reading"
                        </li>
                        <li>
                          5. <strong>PUT /api/books/[id]</strong> - изменить статус на "read" и поставить рейтинг
                        </li>
                        <li>
                          6. <strong>GET /api/books/stats</strong> - проверить обновленную статистику
                        </li>
                        <li>
                          7. <strong>GET /api/books?status=read</strong> - фильтрация прочитанных книг
                        </li>
                        <li>
                          8. <strong>DELETE /api/books/[id]</strong> - удалить книгу (опционально)
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Шаг 4: Автоматические тесты для библиотеки</h4>
                      <p className="text-sm text-muted-foreground mb-2">Добавьте в раздел "Tests" каждого запроса:</p>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`// Проверка статуса ответа
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
pm.test("Book has required fields", function () {
    const jsonData = pm.response.json();
    if (jsonData.data && !Array.isArray(jsonData.data)) {
        pm.expect(jsonData.data).to.have.property('title');
        pm.expect(jsonData.data).to.have.property('author');
        pm.expect(jsonData.data).to.have.property('status');
    }
});

// Проверка рейтинга
pm.test("Rating is valid", function () {
    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.rating) {
        pm.expect(jsonData.data.rating).to.be.within(1, 5);
    }
});`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🛠️ Альтернативные инструменты</CardTitle>
                  <CardDescription>Другие способы тестирования API библиотеки книг</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">cURL</h4>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`# Получить все книги
curl -X GET http://localhost:3000/api/books

# Добавить книгу
curl -X POST http://localhost:3000/api/books \\
  -H "Content-Type: application/json" \\
  -d '{
    "title":"Война и мир",
    "author":"Лев Толстой",
    "year":1869,
    "genre":"Роман",
    "pages":1300,
    "status":"unread"
  }'

# Обновить статус книги
curl -X PUT http://localhost:3000/api/books/1 \\
  -H "Content-Type: application/json" \\
  -d '{"status":"read","rating":5}'`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">JavaScript Fetch</h4>
                      <div className="bg-muted p-3 rounded text-sm font-mono">
                        <pre>{`// Добавить книгу
fetch('/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Чистый код',
    author: 'Роберт Мартин',
    year: 2008,
    genre: 'Программирование',
    pages: 464,
    status: 'reading'
  })
})

// Обновить рейтинг
fetch('/api/books/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    rating: 5,
    status: 'read'
  })
})`}</pre>
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
