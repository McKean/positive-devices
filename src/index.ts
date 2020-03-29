import { DynamoDB, SQS, SNS, APIGateway } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';

const dynamoDb = new DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY', // needed if you don't have aws credentials at all in env
  secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
});
const millisecperday = 24 * 3600 * 1000;

interface AddPost {
  id: string;
  seen: string;
}

export const add = async (event: APIGatewayProxyEvent) => {
  const body: string = event.body || '';
  const { id, seen } = JSON.parse(body) as AddPost;
  const timestamp = new Date().getTime();

  const params = {
    TableName: 'Entry',
    Item: {
      EntryType: 'Rel',
      Id: id,
      Seen: seen,
      T: timestamp
    }
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(result);
    return;
  });
  classify_1(ida, idb);
};

function classify_1(id1: string, id2: string) {
  const timestamp = new Date().getTime();
  const params = {
    TableName: 'Entry',
    KeyConditionExpression:
      '(NOT (EntryType=:rel || EntryType=:lvl3)) AND id1=:y AND Timestamp>:num',
    ExpressionAttributeValues: {
      ':rel': 'rel',
      ':lvl3': 'l-3',
      ':y': id1,
      ':num': timestamp - 20 * millisecperday
    }
  };
  dynamoDb.query(params, function(err, data) {
    //if (err) console.log(err);
    //else console.log(data);
    return;
  });
}
export const report = async (event: any) => {
  const { id } = event.queryStringParameters;

  const body = '';

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body
  };
};

export const check = async (event: any) => {
  const { id } = event.queryStringParameters;

  const body = '';

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body
  };
};

export const classify = async (event: any) => {
  const { ida, idb } = event.queryStringParameters;

  const body = '';

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body
  };
};
