import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';
import { containerName, cosmosClient, databaseName } from '../config';

interface MyCosmosItem {
  id: string;
  email: string;
  city: string;
}

export async function subscribe1(
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
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(email)) {
    return {
      status: 400,
      body: 'Invalid email format',
    };
  }

  const item: MyCosmosItem = {
    id: email,
    email: email,
    city: city,
  };

  const database = cosmosClient.database(databaseName);
  const container = database.container(containerName);
  const { resource: createdItem } = await container.items.create(item);

  return {
    status: 200,
    body: JSON.stringify({ createdItem }),
  };
}

app.http('subscribe1', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: subscribe1,
});
