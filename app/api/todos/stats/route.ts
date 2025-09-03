import { NextResponse } from "next/server"
import { todoStorage } from "@/lib/todo-storage"

/**
 * @swagger
 * /api/todos/stats:
 *   get:
 *     summary: Получить статистику задач
 *     description: Возвращает общую статистику по задачам
 *     responses:
 *       200:
 *         description: Статистика получена успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       description: Общее количество задач
 *                     completed:
 *                       type: number
 *                       description: Количество выполненных задач
 *                     pending:
 *                       type: number
 *                       description: Количество невыполненных задач
 *                     completionRate:
 *                       type: number
 *                       description: Процент выполнения (0-100)
 */
export async function GET() {
  try {
    const stats = todoStorage.getStats()
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        completionRate,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
