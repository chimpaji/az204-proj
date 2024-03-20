'use client';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import { ContainerClient } from '@azure/storage-blob';
import { Item } from '../../../../config/types';

const UploadPortal = ({
  generateSasUrl,
  listItems,
  extendItem,
}: {
  generateSasUrl: () => Promise<string>;
  listItems: () => Promise<any[]>;
  extendItem: (id: string) => Promise<boolean>;
}) => {
  const [sasUrl, setSasUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const getSasUrl = async () => {
      const sasUrl = await generateSasUrl();
      setSasUrl(sasUrl);

      const items = await listItems();
      setItems(items);
    };
    getSasUrl();
  }, [generateSasUrl, listItems]);

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
    <div
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div>
        <h1>Upload file here</h1>
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
      <div>
        <div
          style={{
            display: 'grid',
            gap: 20,
          }}
        >
          <pre>
            <div>
              <h1>Download your items</h1>
            </div>
            <div
              style={{
                overflow: 'auto',
                width: '100%',
              }}
            >
              {items?.length > 0 && (
                <MyTable items={items} extendItem={extendItem} />
              )}
            </div>
          </pre>
        </div>
      </div>
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

const MyTable = ({
  items,
  extendItem,
}: {
  items: Item[];
  extendItem: (id: string) => Promise<boolean>;
}) => {
  const columnHelper = createColumnHelper<Item>();

  const columns = [
    columnHelper.accessor('file_name', {
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('link', {
      cell: (info) => {
        const currentDate = new Date();
        const expiredAt = new Date(
          info.row.original.expired_at as unknown as string
        );

        if (currentDate < expiredAt) {
          const baseDownloadFunctionUrl =
            process.env.NEXT_PUBLIC_DOC_VAULT_FUNCTION_DOWNLOAD_URL;
          if (!baseDownloadFunctionUrl) {
            throw new Error('Base download function url is not defined');
          }

          const downloadLink = baseDownloadFunctionUrl + info.getValue();
          return (
            <a
              href={downloadLink}
              download
              style={{
                backgroundColor: 'green',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              Download
            </a>
          );
        } else {
          return (
            <button
              style={{ backgroundColor: 'yellow', color: 'black' }}
              onClick={() => extendItem(info.row.original.id)}
            >
              Regenerate Link
            </button>
          );
        }
      },
    }),
    columnHelper.accessor('expired_at', {
      header: 'Expired In',
      cell: (info) => {
        const expiredAt = info.getValue();
        if (expiredAt) {
          const now = new Date();

          const diffInMinutes = Math.floor(
            (new Date(expiredAt as unknown as string).getTime() -
              now.getTime()) /
              (1000 * 60)
          );
          const hours = Math.floor(diffInMinutes / 60);
          const minutes = diffInMinutes % 60;
          if (diffInMinutes <= 0) {
            return 'Expired';
          }
          return `${hours} hr ${minutes} min`;
        }
        return '';
      },
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} style={{ padding: '0 15px' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
