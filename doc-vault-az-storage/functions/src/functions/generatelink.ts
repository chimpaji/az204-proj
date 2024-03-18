import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

export async function generatelink(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  //this function will take the id and expiration date and hash them to generate a link
  //then save the link in the cosmos db
  //then return 200 with the link

  return { body: `Hello, !` };
}

app.http('generatelink', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: generatelink,
});
