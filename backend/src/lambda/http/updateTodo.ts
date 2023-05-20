import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    console.log('🚀 ~ file: updateTodo.ts:13 ~ handler ~ todoId:', todoId)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    console.log(
      '🚀 ~ file: updateTodo.ts:15 ~ handler ~ updatedTodo:',
      updatedTodo
    )
    const userId = getUserId(event)
    console.log('🚀 ~ file: updateTodo.ts:17 ~ handler ~ userId:', userId)
    await updateTodo(todoId, userId, updatedTodo)

    return {
      statusCode: 204,
      body: JSON.stringify(true)
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
