import * as crypto from 'crypto';

import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

export async function download(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  //   const name = request.query.get('name') || (await request.text()) || 'world';
  const key = request.params.key;
  if (!key) {
    return {
      status: 400,
      body: 'Please pass a key on the query string or in the request body',
    };
  }

  //the key is in this format   const link = `${hashedId}+;expirationDate=${expirationDate}`;
  const dehashedLink = crypto.createHash('md5').update(key).digest('hex');

  //this key will container the hashed id(container id+email if decrypted) plus the expiration date
  // first unhased the key to get the id and the expiration date
  //if expiration date is less than current date then return 405
  //if not then we can use the id to look up for the item and return it's data

  return { body: `Hello, ${key}!` };
}

app.http('download', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'download/{key}',
  handler: download,
});
