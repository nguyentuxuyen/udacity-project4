import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk';
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';
import { getUserId } from '../lambda/utils';

// Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

export async function getTodos(userId: string){
    return todosAccess.getAllTodos(userId)
}

export async function getTodo(userId: string, todoId: string) {
    return todosAccess.getTodo(userId, todoId)
}

export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const s3AttachmenUrl = attachmentUtils.getAttachmenUrl(todoId)
    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt, 
        done: false,
        attachmentUrl: s3AttachmenUrl,
        ...newTodo
    }

    return todosAccess.createTodo(newItem)
}

export async function updateTodo(userId: string, todoId: string, updateData: TodoUpdate): Promise<void>{
    return todosAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    return todosAccess.deleteTodo(userId, todoId);
}

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {
    const bucketName = process.env.IMAGES_S3_BUCKET;
    const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10);
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const signedUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    });
    await todosAccess.saveImgUrl(userId, todoId, bucketName);
    return signedUrl;
}