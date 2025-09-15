import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { data: books, error } = await supabase.from("user_books").select("status, genre")

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to retrieve statistics" }, { status: 500 })
    }

    // Calculate stats
    const total = books.length
    const completed = books.filter((book) => book.status === "completed").length
    const reading = books.filter((book) => book.status === "reading").length
    const unread = books.filter((book) => book.status === "unread").length
    const genres = [...new Set(books.map((book) => book.genre))].filter(Boolean).length

    return NextResponse.json({
      success: true,
      data: {
        total,
        completed,
        reading,
        unread,
        genres,
      },
      message: "Statistics retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve statistics" }, { status: 500 })
  }
}
