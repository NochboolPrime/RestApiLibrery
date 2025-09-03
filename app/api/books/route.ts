import { type NextRequest, NextResponse } from "next/server"
import { bookStorage } from "@/lib/book-storage"

export async function GET() {
  try {
    const books = bookStorage.getAllBooks()
    return NextResponse.json({
      success: true,
      data: books,
      message: "Books retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { title, author, year, genre, pages, status } = body
    if (!title || !author || !year || !genre || !pages || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const book = bookStorage.createBook({
      title,
      author,
      year: Number.parseInt(year),
      genre,
      pages: Number.parseInt(pages),
      rating: body.rating || 0,
      status,
      notes: body.notes || "",
    })

    return NextResponse.json(
      {
        success: true,
        data: book,
        message: "Book created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create book" }, { status: 500 })
  }
}
