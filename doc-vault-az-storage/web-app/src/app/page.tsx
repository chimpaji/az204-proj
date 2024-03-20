import {
  BlobServiceClient,
  ContainerSASPermissions,
} from '@azure/storage-blob';
import { cosmosDBContainerName, cosmosDBdbName } from '../../../config';

import { CosmosClient } from '@azure/cosmos';
import UploadPortal from './component/UploadPortal';
import { containerName } from '@/config';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Home() {
  noStore();

  async function generateSasUrl() {
    'use server';
    try {
      const connectionString = process.env.DOC_VAULT_STORAGE_CONNECTION_STRING;
      // const connectionString = 'asdf';

      if (!connectionString) {
        throw new Error('Connection string is not defined');
      }

      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const sasUrl = await containerClient.generateSasUrl({
        permissions: ContainerSASPermissions.parse('racwd'),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 86400),
      });
      console.log('Sas Url', sasUrl);
      return sasUrl;
    } catch (error) {
      console.error('Theres error generating sas url', error);
      return '';
    }
  }

  //a function that list all item from cosmos db
  async function listItems() {
    'use server';
    const connectionString = process.env.DOC_VAULT_COSMOS_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('Connection string is not defined');
    }

    const client = new CosmosClient(connectionString);
    const database = client.database(cosmosDBdbName);
    const container = database.container(cosmosDBContainerName);
    const querySpec = {
      query: 'SELECT * from c',
    };
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    console.log('Items', items);

    return items;
  }

  // a function that will take item's id and regenerate item's link and extend the expired_at for another 2hrs
  // then save it back to cosmos db. then trigger re-render(nextjs server action)
  async function extendItem(id: string): Promise<boolean> {
    'use server';
    const connectionString = process.env.DOC_VAULT_COSMOS_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('Connection string is not defined');
    }

    const client = new CosmosClient(connectionString);
    const database = client.database(cosmosDBdbName);
    const container = database.container(cosmosDBContainerName);
    const querySpec = {
      query: 'SELECT * from c WHERE c.id = @id',
      parameters: [{ name: '@id', value: id }],
    };
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    console.log('SearchItem', items);

    const item = items[0];
    if (item) {
      const twoHrInMs = 2 * 60 * 60 * 1000;
      const newExpiredAt = new Date(
        new Date().valueOf() + twoHrInMs
      ).toISOString();
      item.expired_at = newExpiredAt;
      await container.items.upsert(item);
      console.log('Item has been extended', item);
      return true;
    }
    throw new Error('Item not found');
  }

  return (
    <UploadPortal
      generateSasUrl={generateSasUrl}
      listItems={listItems}
      extendItem={extendItem}
    />
  );
}
