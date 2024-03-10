import * as Mailgun from 'mailgun-js';

import { CosmosClient } from '@azure/cosmos';
import { OpenWeatherAPI } from 'openweather-api-node';

export const mailgun = Mailgun({
  apiKey: process.env.ML_SECRET_KEY,
  domain: process.env.ML_DOMAIN,
});

export const weather = new OpenWeatherAPI({
  key: process.env.WEATHER_API_KEY,
  locationName: 'London',
  units: 'imperial',
});

export const cosmosClient = new CosmosClient({
  endpoint: process.env.DB_ENDPOINT,
  key: process.env.DB_KEY,
});

export const databaseName = 'my-database';
export const containerName = 'my-container';

export const subscriberContainerDB = cosmosClient
  .database(databaseName)
  .container(containerName);
