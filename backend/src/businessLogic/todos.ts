import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

export async function createTodo(
newTodo: CreateTodoRequest,
userId: string): Promise<TodoItem> {
    logger.info('Call create todo function')

    const todoId = uuid.v4()
    const createAt = new Date().toISOString()
    const newItem = {
        userId,
        todoId,
        createAt,
        done: false,
        ...newTodo
    }

    return await todosAccess.createTodoItem(newItem)
}