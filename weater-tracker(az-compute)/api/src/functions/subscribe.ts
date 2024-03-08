import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
  output,
} from '@azure/functions';

import { MongoClient } from 'mongodb';

interface MyCosmosItem {
  id: string;
  email: string;
  city: string;
}

export async function subscribe(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body: any = await request.json();
  if (!body.email || !body.city) {
    throw new Error('Please pass email and city in the request body');
  }
  const email = body.email;
  const city = body.city;

  if (!email || !city) {
    return {
      status: 400,
      body: 'Please pass email and city in the request body',
    };
  }

  const mongoClient = await MongoClient.connect(
    process.env.CosmosDbConnectionSetting
  );
  const cluster = await mongoClient.connect();
  const db = cluster.db('my-database');
  const collection = db.collection('my-container');

  const item: MyCosmosItem = {
    id: email,
    email: email,
    city: city,
  };
  await collection.insertOne(item);

  return {
    status: 200,
    body: JSON.stringify({ item }),
  };
}

app.http('subscribe', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: subscribe,
});
