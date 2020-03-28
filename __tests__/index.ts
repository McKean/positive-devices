import createEvent from '@serverless/event-mocks';
import * as mod from './../src/index';
const jestPlugin = require('serverless-jest-plugin');

jest.setTimeout(500000);

const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, {
  handler: 'handler'
});

describe('add', () => {
  beforeEach(() => {});

  it('should be able to provide relationship data', async () => {
    return wrapped.run(event).then((response: any) => {
      expect(response.statusCode).toBe(200);
    });
  });
});
