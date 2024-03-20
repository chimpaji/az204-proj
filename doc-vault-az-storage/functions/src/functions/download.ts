import * as crypto from 'crypto';

import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app,
} from '@azure/functions';
import {
  blobContainerName,
  cosmosDBContainerName,
  cosmosDBdbName,
} from '../config';

import { CosmosClient } from '@azure/cosmos';

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

  //connect to cosmos use the library and get the item
  const cosmosConnectionString =
    process.env['DOC_VAULT_COSMOSDB_CONNECTION_STRING'];
  if (!cosmosConnectionString) {
    return {
      status: 500,
      body: 'CosmosDB Connection string is not defined',
    };
  }
  const blobStorageConnectionString =
    process.env['DOC_VAULT_STORAGE_CONNECTION_STRING'];
  if (!blobStorageConnectionString) {
    return {
      status: 500,
      body: 'Storage Connection string is not defined',
    };
  }

  const cosmosClient = new CosmosClient(cosmosConnectionString);
  const database = cosmosClient.database(cosmosDBdbName);
  const container = database.container(cosmosDBContainerName);
  const querySpec = {
    query: 'SELECT * from c WHERE c.link = @link',
    parameters: [{ name: '@link', value: key }],
  };
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  const foundItem = items[0];
  if (!foundItem) {
    return {
      status: 404,
      body: 'Item not found',
    };
  }

  if (new Date(foundItem.expired_at) < new Date()) {
    return {
      status: 400,
      body: 'Item has expired',
    };
  }

  //generate a download link from blob storage using the item's filename
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    blobStorageConnectionString
  );
  const containerClient =
    blobServiceClient.getContainerClient(blobContainerName);
  const blobClient = containerClient.getBlobClient(foundItem.file_name);
  const sasUrl = await blobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse('r'),
    expiresOn: new Date(new Date().valueOf() + 86400),
  });
  // redirect to the sas url
  return {
    status: 302,
    headers: {
      location: sasUrl,
    },
  };
}

app.http('download', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'download/{key}',
  handler: download,
});
