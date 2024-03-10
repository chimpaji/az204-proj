let appInsights = require('applicationinsights');

import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

import { weather } from '../config';

export async function getWeather(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  appInsights.start();
  context.log(`Http function processed request for url "${request.url}"`);

  const cityName =
    request.query.get('name') || (await request.text()) || 'London';

  weather.setLocationByName(cityName);

  const res = await weather.getCurrent();

  return {
    body: JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

app.http('get-weather', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getWeather,
});
