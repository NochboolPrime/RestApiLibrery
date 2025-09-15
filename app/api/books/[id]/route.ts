import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    const { data: book, error } = await supabase.from("user_books").select("*").eq("id", id).single()

    if (error || !book) {
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
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const body = await request.json()

    const { data: book, error } = await supabase
      .from("user_books")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error || !book) {
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
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    const { error } = await supabase.from("user_books").delete().eq("id", id)

    if (error) {
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
