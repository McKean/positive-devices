import createEvent from '@serverless/event-mocks';
import * as mod from './../src/index';
const jestPlugin = require('serverless-jest-plugin');

jest.setTimeout(500000);

const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, {
  handler: 'report'
});

describe('report', () => {
  beforeEach(() => {});

  // @ts-ignore because createEvent will fill the blanks

  it('should be able to report positive', async () => {
    const event = createEvent('aws:apiGateway', {
      body: '{ "id": "hello" }',
      httpMethod: 'POST',
      // @ts-ignore because createEvent will fill the blanks
      requestContext: {
        httpMethod: 'POST'
      }
    });
    return wrapped.run(event).then((response: any) => {
      expect(response.statusCode).toBe(200);
    });
  });
});
