export interface Book {
  id: number
  title: string
  author: string
  year: number
  genre: string
  pages: number
  rating: number
  status: "unread" | "reading" | "completed"
  notes: string
  createdAt: string
  updatedAt: string
}

class BookStorage {
  private books: Book[] = [
    {
      id: 1,
      title: "1984",
      author: "Джордж Оруэлл",
      year: 1949,
      genre: "Антиутопия",
      pages: 328,
      rating: 5,
      status: "completed",
      notes: "Потрясающая книга о тоталитаризме и контроле над сознанием",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Мастер и Маргарита",
      author: "Михаил Булгаков",
      year: 1967,
      genre: "Фантастика",
      pages: 480,
      rating: 5,
      status: "completed",
      notes: "Классика русской литературы с элементами мистики",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Чистый код",
      author: "Роберт Мартин",
      year: 2008,
      genre: "Программирование",
      pages: 464,
      rating: 0,
      status: "reading",
      notes: "Нужно прочитать для улучшения навыков программирования",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
  private nextId = 4

  getAllBooks(): Book[] {
    return [...this.books]
  }

  getBookById(id: number): Book | undefined {
    return this.books.find((book) => book.id === id)
  }

  createBook(bookData: Omit<Book, "id" | "createdAt" | "updatedAt">): Book {
    const book: Book = {
      ...bookData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.books.push(book)
    return book
  }

  updateBook(id: number, updates: Partial<Omit<Book, "id" | "createdAt">>): Book | null {
    const bookIndex = this.books.findIndex((book) => book.id === id)
    if (bookIndex === -1) return null

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.books[bookIndex]
  }

  deleteBook(id: number): boolean {
    const bookIndex = this.books.findIndex((book) => book.id === id)
    if (bookIndex === -1) return false

    this.books.splice(bookIndex, 1)
    return true
  }

  getStats() {
    const total = this.books.length
    const completed = this.books.filter((book) => book.status === "completed").length
    const reading = this.books.filter((book) => book.status === "reading").length
    const unread = this.books.filter((book) => book.status === "unread").length
    const genres = [...new Set(this.books.map((book) => book.genre))].length

    return {
      total,
      completed,
      reading,
      unread,
      genres,
    }
  }

  getGenres(): string[] {
    return [...new Set(this.books.map((book) => book.genre))]
  }
}

export const bookStorage = new BookStorage()
