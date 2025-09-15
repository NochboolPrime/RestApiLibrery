"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, ExternalLink, Search, Star, Edit, Trash2, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Book {
  id: number
  title: string
  author: string
  year: number
  genre: string
  pages: number
  rating: number
  status: "unread" | "reading" | "completed"
  notes: string
  created_at: string
  updated_at: string
}

interface Stats {
  total: number
  completed: number
  reading: number
  unread: number
  genres: number
}

interface UserProfile {
  id: string
  email: string
  display_name?: string
}

export default function Dashboard() {
  const [books, setBooks] = useState<Book[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, reading: 0, unread: 0, genres: 0 })
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    genre: "",
    pages: 0,
    rating: 0,
    status: "unread" as const,
    notes: "",
  })
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setUserProfile({
        id: user.id,
        email: user.email!,
        display_name: profile?.display_name,
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data.data)
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить книги",
        variant: "destructive",
      })
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/books/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch stats")
    }
  }

  const createBook = async () => {
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.genre.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      })

      if (response.ok) {
        const data = await response.json()
        setBooks([...books, data.data])
        setNewBook({
          title: "",
          author: "",
          year: new Date().getFullYear(),
          genre: "",
          pages: 0,
          rating: 0,
          status: "unread",
          notes: "",
        })
        setShowCreateDialog(false)
        fetchStats()
        toast({
          title: "Успех",
          description: "Книга добавлена",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Ошибка",
          description: errorData.error || "Не удалось добавить книгу",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить книгу",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const updateBook = async (id: number, updates: Partial<Book>) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        setBooks(books.map((book) => (book.id === id ? data.data : book)))
        setEditingBook(null)
        fetchStats()
        toast({
          title: "Успех",
          description: "Книга обновлена",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить книгу",
        variant: "destructive",
      })
    }
  }

  const deleteBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== id))
        fetchStats()
        toast({
          title: "Успех",
          description: "Книга удалена",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить книгу",
        variant: "destructive",
      })
    }
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = genreFilter === "all" || book.genre === genreFilter
    const matchesStatus = statusFilter === "all" || book.status === statusFilter
    return matchesSearch && matchesGenre && matchesStatus
  })

  const genres = [...new Set(books.map((book) => book.genre))].filter(Boolean)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Прочитано</Badge>
      case "reading":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">К прочтению</Badge>
      case "unread":
        return <Badge variant="secondary">Не прочитано</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const renderEditableStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        onClick={() => onRatingChange(i + 1)}
      />
    ))
  }

  useEffect(() => {
    fetchUser()
    fetchBooks()
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-orange-500 font-bold text-5xl">DSS</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Моя Библиотека</h1>
              <p className="text-gray-600">
                Добро пожаловать, {userProfile?.display_name || userProfile?.email?.split("@")[0] || "Пользователь"}!
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/api-docs">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                API Docs
              </Button>
            </Link>
            <Link href="/testing-guide">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                Testing Guide
              </Button>
            </Link>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4" />
                  Добавить книгу
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Добавить новую книгу</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название *</Label>
                    <Input
                      id="title"
                      placeholder="Введите название книги"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Автор *</Label>
                    <Input
                      id="author"
                      placeholder="Введите имя автора"
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Год</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newBook.year}
                        onChange={(e) =>
                          setNewBook({ ...newBook, year: Number.parseInt(e.target.value) || new Date().getFullYear() })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="pages">Страниц</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={newBook.pages}
                        onChange={(e) => setNewBook({ ...newBook, pages: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="genre">Жанр *</Label>
                    <Input
                      id="genre"
                      placeholder="Введите жанр"
                      value={newBook.genre}
                      onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={newBook.status}
                      onValueChange={(value: "unread" | "reading" | "completed") =>
                        setNewBook({ ...newBook, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Не прочитано</SelectItem>
                        <SelectItem value="reading">К прочтению</SelectItem>
                        <SelectItem value="completed">Прочитано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Рейтинг</Label>
                    <div className="flex gap-1 mt-1">
                      {renderEditableStars(newBook.rating, (rating) => setNewBook({ ...newBook, rating }))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Заметки</Label>
                    <Textarea
                      id="notes"
                      placeholder="Добавьте заметки о книге"
                      value={newBook.notes}
                      onChange={(e) => setNewBook({ ...newBook, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={createBook}
                      disabled={loading}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      {loading ? "Добавление..." : "Добавить книгу"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск по названию или автору..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Все жанры" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все жанры</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Все книги" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все книги</SelectItem>
              <SelectItem value="completed">Прочитано</SelectItem>
              <SelectItem value="reading">К прочтению</SelectItem>
              <SelectItem value="unread">Не прочитано</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Всего книг</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Прочитано</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.reading}</div>
              <p className="text-sm text-muted-foreground">К прочтению</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.genres}</div>
              <p className="text-sm text-muted-foreground">Жанров</p>
            </CardContent>
          </Card>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {book.author} • {book.year}
                    </p>
                  </div>
                  {getStatusBadge(book.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Жанр:</span>
                    <span className="text-blue-600">{book.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Страниц:</span>
                    <span>{book.pages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Рейтинг:</span>
                    <div className="flex gap-1">{renderStars(book.rating)}</div>
                  </div>
                </div>

                {book.notes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <span className="text-muted-foreground">Заметки:</span>
                    <p className="mt-1">{book.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {book.status === "unread" && (
                    <Button size="sm" variant="outline" onClick={() => updateBook(book.id, { status: "reading" })}>
                      Читаю
                    </Button>
                  )}
                  {book.status === "reading" && (
                    <Button size="sm" variant="outline" onClick={() => updateBook(book.id, { status: "completed" })}>
                      Прочитано
                    </Button>
                  )}
                  <Dialog
                    open={showEditDialog && editingBook?.id === book.id}
                    onOpenChange={(open) => {
                      setShowEditDialog(open)
                      if (!open) setEditingBook(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setEditingBook(book)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Редактировать книгу</DialogTitle>
                      </DialogHeader>
                      {editingBook && (
                        <div className="space-y-4">
                          <div>
                            <Label>Статус</Label>
                            <Select
                              value={editingBook.status}
                              onValueChange={(value: "unread" | "reading" | "completed") =>
                                setEditingBook({ ...editingBook, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unread">Не прочитано</SelectItem>
                                <SelectItem value="reading">К прочтению</SelectItem>
                                <SelectItem value="completed">Прочитано</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Рейтинг</Label>
                            <div className="flex gap-1 mt-1">
                              {renderEditableStars(editingBook.rating, (rating) =>
                                setEditingBook({ ...editingBook, rating }),
                              )}
                            </div>
                          </div>
                          <div>
                            <Label>Заметки</Label>
                            <Textarea
                              value={editingBook.notes}
                              onChange={(e) => setEditingBook({ ...editingBook, notes: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() =>
                                updateBook(editingBook.id, {
                                  status: editingBook.status,
                                  rating: editingBook.rating,
                                  notes: editingBook.notes,
                                })
                              }
                              className="flex-1"
                            >
                              Сохранить
                            </Button>
                            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                              Отмена
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" onClick={() => deleteBook(book.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                Книги не найдены. Попробуйте изменить фильтры или добавить новую книгу.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 bg-gray-900 text-white -mx-4">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-orange-500 font-bold text-xl">DSS</span>
              <span className="text-gray-300">Made by DSS</span>
            </div>
            <p className="text-gray-400 text-sm">Daniil Sergeevich Shishkin 4р2.22</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
