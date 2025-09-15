import { type NextRequest, NextResponse } from "next/server"
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

    const { data: books, error } = await supabase
      .from("user_books")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to retrieve books" }, { status: 500 })
    }

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
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const { title, author, year, genre, pages, status } = body
    if (!title || !author || !year || !genre || pages === undefined || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { data: book, error } = await supabase
      .from("user_books")
      .insert({
        user_id: user.id,
        title,
        author,
        year: Number.parseInt(year),
        genre,
        pages: Number.parseInt(pages),
        rating: body.rating || 0,
        status,
        notes: body.notes || "",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to create book" }, { status: 500 })
    }

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
