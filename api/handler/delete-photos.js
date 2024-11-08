'use strict';

const { DynamoDBClient, QueryCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

module.exports.handler = async event => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { pk, sk } = JSON.parse(event.body);

  if (!pk || !sk) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://16november2024.com',
      },
      body: JSON.stringify({ message: 'Missing required parameters pk or sk' })
    };
  }

  const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  });
  const params = {
    TableName: process.env.PHOTO_TABLE_NAME,
    Key: {
      PK: { S: 'image#' + pk }, // Assuming photo ID is passed in path parameters
      SK: { S: sk },
    },
    ReturnValues: 'ALL_OLD' // This will return the deleted item
  };
  try {
    const result = await client.send(new DeleteItemCommand(params));
    console.error('result:', result);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://16november2024.com',
      },
      body: JSON.stringify({ message: 'Photo deleted successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://16november2024.com',
      },
      body: JSON.stringify({
        message: 'Failed to delete photo',
        error: error.message
      })
    };
  }

  // const client = new DynamoDBClient({
  //   endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  // });
  // const id = event.pathParameters.id;
  // const sk = event.queryStringParameters.sk;
  // const params = {
  //   TableName: process.env.PHOTO_TABLE_NAME,
  //   Key: {
  //     PK: { S: 'image#' + id }, // Assuming photo ID is passed in path parameters
  //     SK: { S: sk },
  //   },
  //   ReturnValues: 'ALL_OLD' // This will return the deleted item
  // };
  // try {
  //   const result = await client.send(new DeleteItemCommand(params));

  //   return {
  //     statusCode: 200,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       message: 'Photo deleted successfully',
  //       deletedPhoto: result.Attributes
  //     })
  //   };
  // } catch (error) {
  //   console.log('error', error);
  //   return {
  //     statusCode: error.statusCode || 500,
  //     body: JSON.stringify({
  //       message: 'Error deleting photo',
  //       error: error.message
  //     })
  //   };
  // }
};
