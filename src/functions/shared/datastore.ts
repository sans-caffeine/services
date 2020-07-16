import { v4 as uuid } from 'uuid'
import {DynamoDB} from 'aws-sdk'
const dynamoDb = new DynamoDB.DocumentClient({apiVersion: '2012-08-10'})

const env = process.env.environment 

export async function getElement( element: string, key: any ) : Promise<any> {
  const DYNAMODB_TABLE = env+"-"+element 
	
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: DYNAMODB_TABLE,
    Key: key
  }
	
  const result = await dynamoDb.get(params).promise()
  return result.Item
}

export async function getElements( element: string ) : Promise<any> {
  const DYNAMODB_TABLE = env+"-"+element

  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: DYNAMODB_TABLE
  }

  const result = await dynamoDb.scan(params).promise()
  return result.Items
}

export async function queryElements( user: string, element: string ) : Promise<any> {
  const DYNAMODB_TABLE = env+"-"+element

  const expression = "owner = :owner" 
  const values     = { ":owner": user } 
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: DYNAMODB_TABLE,
    KeyConditionExpression: expression,
    ExpressionAttributeValues: values
  }

  const result = await dynamoDb.query(params).promise() 	
  return result.Items 
}

export async function createElement( user: string, element: string, item: any ) {
  const DYNAMODB_TABLE = env+"-"+element ;
	
  item.id      = uuid() 
  item.owner   = user 
  item.updated = { at: new Date().toISOString(), by: user } 

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: DYNAMODB_TABLE,
    Item: item
  }
	
  await dynamoDb.put(params).promise()
}

export async function updateElement( user: string, element: string, item: any ) {
  const DYNAMODB_TABLE = env+"-"+element 
	
  item.updated = { at: new Date().toISOString(), by: user } 

  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: DYNAMODB_TABLE,
    Item: item
  }
	
  await dynamoDb.put(params).promise()
}

export async function deleteElement( element: string, key: any ) {
  const DYNAMODB_TABLE = env+"-"+element
	
  const params: DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: DYNAMODB_TABLE,
    Key: key
  }

  await dynamoDb.delete(params).promise();
}