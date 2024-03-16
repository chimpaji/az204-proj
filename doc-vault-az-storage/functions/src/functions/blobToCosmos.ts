import { InvocationContext, app } from '@azure/functions';

export async function blobToCosmos(
  blob: Buffer,
  context: InvocationContext
): Promise<void> {
  console.log('hi');
  context.log(
    `Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`
  );
}

app.storageBlob('blobToCosmos', {
  path: 'docvaultcontainer/{name}',
  connection: 'DOC_VAULT_STORAGE_CONNECTION_STRING',
  handler: blobToCosmos,
});
