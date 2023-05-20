import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    logger.info('Create a new Todo')
    const createNewTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    const todoId = uuidv4()
    console.log('🚀 ~ file: createTodo.ts:16 ~ handler ~ todoId:', todoId)
    const userId = getUserId(event)
    console.log('🚀 ~ file: createTodo.ts:18 ~ handler ~ userId:', userId)
    const newItem = await createTodo(createNewTodoRequest, userId, todoId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }
)

handler
  .use(
    cors({
      credentials: true
    })
  )
  .use(httpErrorHandler())
