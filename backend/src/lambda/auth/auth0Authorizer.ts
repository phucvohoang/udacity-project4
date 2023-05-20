import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'dev-ly87bjff.us.auth0.com'
const jwksUrl =
  'https://dev-4ehhvjm7y0iis1w4.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user: 4', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  console.log('🚀 ~ file: auth0Authorizer.ts:129 ~ verifyToken ~ token:', token)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const jwt_ = jwt.header.kid
  console.log('🚀 ~ file: auth0Authorizer.ts:136 ~ verifyToken ~ jwt_:', jwt_)
  const jwks = await Axios.get(jwksUrl)
  console.log(`This is jwks: ${jwks?.data?.keys}`)
  const signingKey = jwks.data.keys.filter((k) => k.kid === jwt_)[0]
  console.log(
    '🚀 ~ file: auth0Authorizer.ts:140 ~ verifyToken ~ signingKey:',
    signingKey
  )
  if (!signingKey) {
    throw new Error('invalid token:${jwt_}')
  }

  const x5c = signingKey.x5c[0]
  console.log('🚀 ~ file: auth0Authorizer.ts:145 ~ verifyToken ~ x5c:', x5c)
  const cert = `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----`
  console.log('🚀 ~ file: auth0Authorizer.ts:149 ~ verifyToken ~ cert:', cert)
  if (!jwt) {
    throw new Error('invalid token')
  }
  console.log('==== preparing to call verify ===')
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
