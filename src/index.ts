import { DynamoDB, SQS, SNS, APIGateway } from 'aws-sdk';
import { APIGatewayProxyEvent, DynamoDBRecord } from 'aws-lambda';

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

//
//
// async functions for dynamo operations

const batchWrite = async (params: any) => {
  return new Promise((resolve, reject) => {
    dynamoDb.batchWrite(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const put = async (params: any) => {
  return new Promise((resolve, reject) => {
    dynamoDb.put(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const query = async (params: any) => {
  return new Promise((resolve, reject) => {
    dynamoDb.query(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

//
// endpoints
//

export const add = async (event: APIGatewayProxyEvent) => {
  const body: string = event.body || '';
  const { id, seen } = JSON.parse(body) as AddPost;
  const timestamp = new Date().getTime();

  // using batch write to add two entries (reverse))
  const params = {
    RequestItems: {
      Entry: [
        {
          PutRequest: {
            Item: {
              Id: `${id}:REL`,
              Seen: seen,
              T: timestamp
            }
          }
        },
        {
          PutRequest: {
            Item: {
              Id: `${seen}:REL`,
              Seen: id,
              T: timestamp
            }
          }
        }
      ]
    }
  };

  try {
    await batchWrite(params);
  } catch (e) {
    console.error(e);
  }
  // todo: respond with OK and dispatch next as job (sns/sqs)
  // classify what's been seen (reverse)
  await classifySeen(id, seen, timestamp);
  await classifySeen(seen, id, timestamp);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    }
  };
};

const classifySeen = async (id: string, seen: string, timestamp: number) => {
  const params = {
    TableName: 'Entry',
    // AttributesToGet: ['Level', 'Id'],
    KeyConditionExpression: 'Id=:seen AND T>:num',
    ExpressionAttributeValues: {
      ':seen': seen,
      ':num': timestamp - 20 * millisecperday
    },
    ScanIndexForward: true,
    Limit: 1 // should eventually be adjusted
    // Select: 'SPECIFIC_ATTRIBUTES'
  };
  // todo: limit 1 and just getting the most recent might not be valid
  // perhaps getting the highest level would be the proper thing to do
  const data: any = await query(params);

  // once getting results use the level and increase by one -> store
  if (data.Items.length) {
    const level: number = data.Items[0].Level;
    await classify(id, level + 1, timestamp);
    // now here we would need to check the other relationships
    /*

    ID       T     seen level
    | A:REL | -1 | C | <- no need to report on this
    | B     | 0  | 0 | <- positive
    | A:REL | 1  | B |
    | A     | 1  | 1 |
    | C     | 1  | 2 | (would be incorrect)

    I guess I answered my own question, it's simple when just adding relationships...
    it will be tricky when adding report
     */
  }
  return;
};

const listRelationship = async (id: string, timestamp: number) => {
  const params = {
    TableName: 'Entry',
    KeyConditionExpression: 'Id=:seen AND T>:num',
    ExpressionAttributeValues: {
      ':seen': `${id}:REL`,
      ':num': timestamp - 20 * millisecperday
    },
    // AttributesToGet: ['Id', 'timestamp'],
    ScanIndexForward: true
    // Select: 'SPECIFIC_ATTRIBUTES'
  };

  return await query(params);
};

export const report = async (event: any) => {
  const body: string = event.body || '';
  const { id } = JSON.parse(body);
  const timestamp = new Date().getTime();

  await classify(id, 0, timestamp);

  const data: any = await listRelationship(id, timestamp);
  if (data.Items) {
    for (let idSeen in data.Items) {
      await classify(idSeen, 1, timestamp);
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    }
  };
};

export const check = async (event: any) => {
  const { id } = event.queryStringParameters;
  const timestamp = new Date().getTime();

  const params = {
    TableName: 'Entry',
    KeyConditionExpression: 'Id=:id AND T>:num',
    ExpressionAttributeValues: {
      ':id': `${id}`,
      ':num': timestamp - 20 * millisecperday
    },
    ScanIndexForward: true
  };

  const result = await query(params);
  console.log(result);
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

export const classify = async (
  id: string,
  level: number,
  timestamp: number
) => {
  const params = {
    TableName: 'Entry',
    Item: {
      Id: id,
      Level: level,
      T: timestamp
    }
  };

  return await put(params);
};
