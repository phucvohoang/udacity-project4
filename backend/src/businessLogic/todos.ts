import {TodosAccess} from "../data_access_layer/todosAccess";
import {TodoItem} from "../models/TodoItem";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";

const todoAccess = new TodosAccess()
export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return await todoAccess.getAllTodos(userId)
}

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string,
    todoId: string
): Promise<CreateTodoRequest> {
    return await todoAccess.createTodo({
        todoId: todoId,
        userId: userId,
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false,
        attachmentUrl: '',
        createdAt: new Date().toISOString()
    })
}

export async function deleteTodo(
    todoId: string,
    userId: string
): Promise<void> {
    return await todoAccess.deleteTodoItem(todoId, userId)
}

export async function getGeneratedUploadURL(
    todoId: string,
): Promise<string> {
    return await todoAccess.generateUploadUrl(todoId)
}

export async function persistAttachmentUrl(
    todoId: string,
    userId: string,
    imageId: string
): Promise<void> {
    return await todoAccess.persistAttachmentUrl(todoId, userId, imageId)
}

export async function getTodosForUser(
    userId: string
): Promise<TodoItem[]> {
    return await todoAccess.getTodosForUser(userId)
}

export async function updateTodo(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
): Promise<TodoUpdate> {
    return await todoAccess.updateTodo(todoId, userId, todoUpdate)
}

