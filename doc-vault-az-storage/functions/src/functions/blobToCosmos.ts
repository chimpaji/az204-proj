import { InvocationContext, app, output } from '@azure/functions';
import {
  blobContainerName,
  cosmosDBContainerName,
  cosmosDBdbName,
  mockEmail,
} from '../config';

import { Item } from '../config/types';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';

export async function blobToCosmos(blob: Buffer, context: InvocationContext) {
  console.log('hi');
  context.log(
    `Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`
  );

  console.log({ meta: context.triggerMetadata });
  const fileName = context.triggerMetadata.name as string;
  if (!fileName) {
    throw new Error('File name is required');
  }

  // expiredate is 2hrs from now
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 2);

  const id = `${mockEmail}_${fileName}`;
  const hashedId = createHash('sha256').update(id).digest('hex');
  const item: Item = {
    id: hashedId,
    file_name: context.triggerMetadata.name as string,
    email: mockEmail,
    created_at: new Date(),
    link: uuid(),
    expired_at: expirationDate,
  };

  console.log({ item });

  return item;
}

app.storageBlob('blobToCosmos', {
  path: `${blobContainerName}/{name}`,
  connection: 'DOC_VAULT_STORAGE_CONNECTION_STRING',
  handler: blobToCosmos,
  return: output.cosmosDB({
    databaseName: cosmosDBdbName,
    containerName: cosmosDBContainerName,
    connection: 'DOC_VAULT_COSMOSDB_CONNECTION_STRING',
  }),
});
