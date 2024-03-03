import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';

import { OpenWeatherAPI } from 'openweather-api-node';

export async function getWeather(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const cityName =
    request.query.get('name') || (await request.text()) || 'London';

  let weather = new OpenWeatherAPI({
    key: process.env.WEATHER_API_KEY,
    locationName: cityName,
    units: 'imperial',
  });

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
