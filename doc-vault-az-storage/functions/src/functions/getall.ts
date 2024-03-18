import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

export async function getall(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  //this function will fetch all the items from the cosmos db and return them(strinify them)

  return { body: `Hello,!` };
}

app.http('getall', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getall,
});
