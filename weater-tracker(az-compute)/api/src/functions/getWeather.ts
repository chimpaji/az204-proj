import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

export async function getWeather(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get('name') || (await request.text()) || 'world';

  return { body: `Helslo, ${name}!` };
}

app.http('get-weather', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getWeather,
});
