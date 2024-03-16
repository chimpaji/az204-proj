'use server';

import {
  BlobServiceClient,
  ContainerClient,
  ContainerSASPermissions,
} from '@azure/storage-blob';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import UploadPortal from './component/UploadPortal';
import { containerName } from '@/config';
import { unstable_noStore as noStore } from 'next/cache';
import { v4 as uuid } from 'uuid';

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

  return <UploadPortal generateSasUrl={generateSasUrl} />;
}
