'use strict';

const { DynamoDBClient, QueryCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

module.exports.handler = async event => {
  const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  });
  const id = event.pathParameters.id;
  const sk = event.queryStringParameters.sk;
  const params = {
    TableName: process.env.PHOTO_TABLE_NAME,
    Key: {
      PK: { S: 'image#' + id }, // Assuming photo ID is passed in path parameters
      SK: { S: sk },
    },
    ReturnValues: 'ALL_OLD' // This will return the deleted item
  };
  try {
    const result = await client.send(new DeleteItemCommand(params));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Photo deleted successfully',
        deletedPhoto: result.Attributes
      })
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: 'Error deleting photo',
        error: error.message
      })
    };
  }
};
