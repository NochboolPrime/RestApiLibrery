// In-memory storage for todos (в реальном проекте используйте базу данных)
export interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

class TodoStorage {
  private todos: Todo[] = []
  private nextId = 1

  constructor() {
    // Добавляем несколько примеров задач для демонстрации
    this.todos = [
      {
        id: 1,
        title: "Изучить REST API",
        description: "Понять принципы работы RESTful веб-сервисов",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Протестировать API в Postman",
        description: "Создать коллекцию тестов для всех endpoints",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    this.nextId = 3
  }

  getAllTodos(): Todo[] {
    return this.todos
  }

  getTodoById(id: number): Todo | undefined {
    return this.todos.find((todo) => todo.id === id)
  }

  createTodo(data: { title: string; description?: string }): Todo {
    const newTodo: Todo = {
      id: this.nextId++,
      title: data.title,
      description: data.description || "",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.todos.push(newTodo)
    return newTodo
  }

  updateTodo(id: number, updates: Partial<Omit<Todo, "id" | "createdAt">>): Todo | null {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id)
    if (todoIndex === -1) return null

    const updatedTodo = {
      ...this.todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.todos[todoIndex] = updatedTodo
    return updatedTodo
  }

  deleteTodo(id: number): boolean {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id)
    if (todoIndex === -1) return false

    this.todos.splice(todoIndex, 1)
    return true
  }

  getStats() {
    const total = this.todos.length
    const completed = this.todos.filter((todo) => todo.completed).length
    const pending = total - completed

    return { total, completed, pending }
  }
}

// Singleton instance
export const todoStorage = new TodoStorage()
