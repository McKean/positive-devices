import createEvent from '@serverless/event-mocks';
import * as mod from './../src/index';
const jestPlugin = require('serverless-jest-plugin');

jest.setTimeout(500000);

const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, {
  handler: 'check'
});

describe('check', () => {
  beforeEach(() => {});

  // @ts-ignore because createEvent will fill the blanks

  it('should provide result for check', async () => {
    const event = createEvent('aws:apiGateway', {
      queryStringParameters: { id: 'hello' },
      httpMethod: 'GET',
      // @ts-ignore because createEvent will fill the blanks
      requestContext: {
        httpMethod: 'GET'
      }
    });
    return wrapped.run(event).then((response: any) => {
      expect(response.statusCode).toBe(200);
    });
  });
});
