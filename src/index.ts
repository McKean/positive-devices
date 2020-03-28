import { DynamoDB, SQS, SNS } from 'aws-sdk';

export const add = async (event: any) => {
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
