import * as crypto from 'crypto';

export const blobContainerName = 'docvaultcontainer';
export const mockEmail = 'someMockEmail@mockmail.com';

export const cosmosDBdbName = 'doc-vault-db';
export const cosmosDBContainerName = 'doc-vault-container';

export const encryptSecretKey = 'someSecret';
export const encryptAlgorithm = 'aes-256-cbc';
export const encryptIv = crypto.randomBytes(16);
