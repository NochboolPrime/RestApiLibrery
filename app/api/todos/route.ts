import { type NextRequest, NextResponse } from "next/server"
import { todoStorage } from "@/lib/todo-storage"

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Получить все задачи
 *     description: Возвращает список всех задач с возможностью фильтрации
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Фильтр по статусу выполнения
 *     responses:
 *       200:
 *         description: Успешный ответ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Todo'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     completed:
 *                       type: number
 *                     pending:
 *                       type: number
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const completedFilter = searchParams.get("completed")

    let todos = todoStorage.getAllTodos()

    // Фильтрация по статусу выполнения
    if (completedFilter !== null) {
      const isCompleted = completedFilter === "true"
      todos = todos.filter((todo) => todo.completed === isCompleted)
    }

    const stats = todoStorage.getStats()

    return NextResponse.json({
      success: true,
      data: todos,
      meta: stats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Создать новую задачу
 *     description: Создает новую задачу с указанными данными
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название задачи
 *                 example: "Изучить Swagger"
 *               description:
 *                 type: string
 *                 description: Описание задачи
 *                 example: "Изучить документацию Swagger для API"
 *     responses:
 *       201:
 *         description: Задача успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Неверные данные запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация данных
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Поле title обязательно и должно быть непустой строкой" },
        { status: 400 },
      )
    }

    if (body.title.length > 200) {
      return NextResponse.json(
        { success: false, error: "Название задачи не должно превышать 200 символов" },
        { status: 400 },
      )
    }

    if (body.description && body.description.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Описание задачи не должно превышать 1000 символов" },
        { status: 400 },
      )
    }

    const newTodo = todoStorage.createTodo({
      title: body.title.trim(),
      description: body.description?.trim() || "",
    })

    return NextResponse.json({ success: true, data: newTodo }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Неверный формат JSON" }, { status: 400 })
  }
}
