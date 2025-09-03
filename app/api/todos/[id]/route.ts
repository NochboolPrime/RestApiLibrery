import { type NextRequest, NextResponse } from "next/server"
import { todoStorage } from "@/lib/todo-storage"

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Получить задачу по ID
 *     description: Возвращает конкретную задачу по её идентификатору
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор задачи
 *     responses:
 *       200:
 *         description: Задача найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Задача не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID должен быть числом" }, { status: 400 })
    }

    const todo = todoStorage.getTodoById(id)

    if (!todo) {
      return NextResponse.json({ success: false, error: "Задача не найдена" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: todo,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Обновить задачу
 *     description: Обновляет существующую задачу
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор задачи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Название задачи
 *               description:
 *                 type: string
 *                 description: Описание задачи
 *               completed:
 *                 type: boolean
 *                 description: Статус выполнения
 *     responses:
 *       200:
 *         description: Задача успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Задача не найдена
 *       400:
 *         description: Неверные данные запроса
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID должен быть числом" }, { status: 400 })
    }

    const body = await request.json()

    // Валидация данных
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || body.title.trim().length === 0) {
        return NextResponse.json({ success: false, error: "Поле title должно быть непустой строкой" }, { status: 400 })
      }
      if (body.title.length > 200) {
        return NextResponse.json(
          { success: false, error: "Название задачи не должно превышать 200 символов" },
          { status: 400 },
        )
      }
    }

    if (body.description !== undefined && body.description.length > 1000) {
      return NextResponse.json(
        { success: false, error: "Описание задачи не должно превышать 1000 символов" },
        { status: 400 },
      )
    }

    if (body.completed !== undefined && typeof body.completed !== "boolean") {
      return NextResponse.json({ success: false, error: "Поле completed должно быть boolean" }, { status: 400 })
    }

    const updatedTodo = todoStorage.updateTodo(id, body)

    if (!updatedTodo) {
      return NextResponse.json({ success: false, error: "Задача не найдена" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedTodo,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Неверный формат JSON" }, { status: 400 })
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Удалить задачу
 *     description: Удаляет задачу по её идентификатору
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Идентификатор задачи
 *     responses:
 *       200:
 *         description: Задача успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Задача не найдена
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "ID должен быть числом" }, { status: 400 })
    }

    const deleted = todoStorage.deleteTodo(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Задача не найдена" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Задача успешно удалена",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
