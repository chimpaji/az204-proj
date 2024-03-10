import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

import { mailgun } from '../config';

export async function sentEmail(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get('name') || (await request.text()) || 'world';

  const data = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'test@test.com',
    subject: 'Hello',
    text: `Hello, ${name}!`,
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });

  return { body: `Hello, ${name}!` };
}

app.http('sent-email', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: sentEmail,
});
