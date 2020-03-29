import { DynamoDB, SQS, SNS } from 'aws-sdk';
const dynamoDb = new DynamoDB.DocumentClient();
const millisecperday=24*3600*1000;
export const add = async (event: any) => {

  const { ida, idb } = event.queryStringParameters;
  const timestamp = new Date().getTime();
  const params = {
      TableName: "Entry",
      Item: {
        EntryType:"Rel",
        id1:ida,
        id2:idb,
        Timestamp:timestamp,
      },
  };
  console.log("yolo");
  dynamoDb.put(params, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      return
    });
    console.log("yolo");
  classify_1(ida,idb);
};
function classify_1(id1:string, id2:string) {
      const timestamp = new Date().getTime()
      const params= {
      TableName : "Entry",
      KeyConditionExpression: "(NOT (EntryType=:rel || EntryType=:lvl3)) AND id1=:y AND Timestamp>:num",
      ExpressionAttributeValues: {
           ":rel": "rel",
           ":lvl3": "l-3",
           ":y":id1,
           ":num": timestamp-20*millisecperday,
      },
    }
  console.log("aits");
    dynamoDb.query(params, function(err, data) {

        //if (err) console.log(err);
        //else console.log(data);
        return
      })
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
