'use client';

import { useEffect, useState } from 'react';

import { ContainerClient } from '@azure/storage-blob';

const UploadPortal = ({
  generateSasUrl,
}: {
  generateSasUrl: () => Promise<string>;
}) => {
  const [sasUrl, setSasUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const getSasUrl = async () => {
      const sasUrl = await generateSasUrl();
      setSasUrl(sasUrl);
    };
    getSasUrl();
  }, [generateSasUrl]);

  const handleUpload = async () => {
    if (!sasUrl || !file) {
      console.log('sasUrl or file is not defined', { sasUrl, file });
      return;
    }
    setIsUploading(true);
    setStatusMessage('Uploading...');
    try {
      await uploadToBlobFromBrowser(sasUrl, file);
      setStatusMessage('Upload successful');
    } catch (error) {
      console.error('Error uploading to blob', error);
      setStatusMessage('Error uploading');
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <div>
      <input
        type='file'
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      {isUploading && <div>Uploading...</div>}
      {statusMessage && <div>{statusMessage}</div>}
    </div>
  );
};

export default UploadPortal;

async function uploadToBlobFromBrowser(sasUrl: string, file: File) {
  try {
    const blobName = file.name;

    if (!blobName) {
      throw new Error('Blob name is not defined');
    }

    if (!file) {
      throw new Error('File is not defined');
    }

    const containerClient = new ContainerClient(sasUrl);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.uploadData(file);
    console.log(
      `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
  } catch (error) {
    console.error('There is an error connecting or uploading the blob', error);
  }
}
