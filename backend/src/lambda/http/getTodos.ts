import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { getTodos } from '../../businessLogic/todos';
import { TodoItem } from '../../models/TodoItem';

const logger = createLogger('getTodos');

// Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing GetTodos event...');
    // Write your code here
    const userId = getUserId(event);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const todoList: TodoItem[] = await getTodos(userId);
      logger.info('Successfully retrieved todolist');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ todoList })
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
