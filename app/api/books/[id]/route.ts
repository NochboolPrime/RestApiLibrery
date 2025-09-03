import { type NextRequest, NextResponse } from "next/server"
import { bookStorage } from "@/lib/book-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const book = bookStorage.getBookById(id)

    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: book,
      message: "Book retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve book" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const book = bookStorage.updateBook(id, body)

    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: book,
      message: "Book updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update book" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = bookStorage.deleteBook(id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete book" }, { status: 500 })
  }
}
