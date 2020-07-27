import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getArticle, getArticles, createArticle, updateArticle, deleteArticle } from './articles'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2))

  const user_id = event.requestContext.authorizer ? event.requestContext.authorizer.claims.sub : null
  const article_id = event.pathParameters ? event.pathParameters.article_id : null
  let article = event.body ? JSON.parse(event.body) : null

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
        if (article_id) {
          console.log(`Getting article ${article_id} for user ${user_id}`)
          result = await getArticle(article_id)
        } else {
          console.log(`Getting articles for user ${user_id}`);
          result = await getArticles();
        }
        break;
      case 'POST':
        console.log(`Adding article ${article_id} for user ${user_id}`, article)
        await createArticle(user_id, article)
        result = article
        break
      case 'PUT':
        console.log(`Updating article ${article_id} for user ${user_id}`, article)
        await updateArticle(user_id, article)
        result = article
        break
      case 'DELETE':
        console.log(`Deleting article ${article_id} for user ${user_id}`)
        if (article_id) {
          await deleteArticle(article_id)
          result = `Delete article ${article_id} for user ${user_id}`
        }
        break
      default:
        throw new Error(`Unsupported method ${event.httpMethod}`)
    }
  } catch (error) {
    console.log(`Failed to ${event.httpMethod} article ${article_id} for user ${user_id}`, article, error)

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