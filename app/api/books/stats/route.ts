import { NextResponse } from "next/server"
import { bookStorage } from "@/lib/book-storage"

export async function GET() {
  try {
    const stats = bookStorage.getStats()
    const genres = bookStorage.getGenres()

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        availableGenres: genres,
      },
      message: "Statistics retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve statistics" }, { status: 500 })
  }
}
