import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils'
import {
  persistAttachmentUrl,
  getGeneratedUploadURL
} from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    console.log('🚀 ~ file: generateUploadUrl.ts:16 ~ todoId:', todoId)
    const userId = getUserId(event)
    console.log(
      '🚀 ~ file: generateUploadUrl.ts:15 ~ handler ~ userId:',
      userId
    )
    const imageId = uuidv4()
    console.log(
      '🚀 ~ file: generateUploadUrl.ts:17 ~ handler ~ imageId:',
      imageId
    )

    const signedUrl = await getGeneratedUploadURL(todoId)
    // await persistAttachmentUrl(todoId, userId, `${imageId}`)
    await persistAttachmentUrl(todoId, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({ uploadUrl: signedUrl })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
