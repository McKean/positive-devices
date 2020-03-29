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
      queryStringParameters: { id: 'world' },
      httpMethod: 'GET',
      // @ts-ignore because createEvent will fill the blanks
      requestContext: {
        httpMethod: 'GET'
      }
    });
    return wrapped.run(event).then((response: any) => {
      console.log(response);
      const body = JSON.parse(response.body);
      expect(response.statusCode).toBe(200);
      expect(body[0].T).toBeLessThan(new Date().getTime());
      expect(body[0].L).toBeLessThan(4);
    });
  });
});
