import AWS from 'aws-sdk' ;
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getMedias, getMedia, createMedia, updateMedia, deleteMedia } from './media'
import '../config/config'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  const user_id = event.requestContext.authorizer ? event.requestContext.authorizer.claims.sub : null
  const media_id = event.pathParameters ? event.pathParameters.media_id : null
  let media = event.body ? JSON.parse(event.body) : null

  let result;
  let statusCode = 200;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        if (media_id) {
          console.log(`Getting media ${media_id} for user ${user_id}`)
          result = await getMedia(media_id)
        } else {
          console.log(`Getting medias for user ${user_id}`);
          result = await getMedias();
        }
        break;
      case 'POST':
        console.log(`Adding media for user ${user_id}`, media)
				await createMedia(user_id, media)
				media.signedURL = await getSignedURL( media.path )
        result = media
        break
      case 'PUT':
				console.log(`Updating media ${media_id} for user ${user_id}`, media)
				const head = await getHead( media.image ) 
				if ( head ) {
          media.exists = true 
				} else {
					media.exists = false 
				}
				media.signedURL = null
        await updateMedia(user_id, media)
        result = media
        break
      case 'DELETE':
        console.log(`Deleting media ${media_id} for user ${user_id}`)
        if (media_id) {
          await deleteMedia(media_id)
          result = `Delete media ${media_id} for user ${user_id}`
        }
        break
      default:
        throw new Error(`Unsupported method ${event.httpMethod}`)
    }
  } catch (error) {
    console.log(`Failed to ${event.httpMethod} media ${media_id} for user ${user_id}`, media, error)

    statusCode = 500
    result = error.message
  }

  console.log(`Result `, result)

  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(result)
  }
}

const env = process.env.environment ;

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

function getSignedURL( image : string) {
	return new Promise((resolve, reject) => {
		const request  = "putObject" ;
		const bucket   = 'public.'+env+'.sirebel.com'
		const key      = image ;
		const duration = 7200 ;
		let params = { Bucket: bucket, Key: key, Expires: duration } 
		
		s3.getSignedUrl( request, params, (error, url ) => {
			if ( error ) reject( error ) ; else resolve( url ) 
		})
	}) 
}

async function getHead( image: string ) {
	const bucket   = 'public.'+env+'.sirebel.com'
	const key      = image ;
  let params = { Bucket: bucket, Key: key } 
	
	const head = await s3.headObject(params).promise();	
	
	return head
}

