import * as crypto from 'crypto';

import { encryptAlgorithm, encryptSecretKey } from '.';

import Cryptr = require('cryptr');

// The encrypt function
export function encrypt(text: string) {
  const cryptr = new Cryptr(encryptSecretKey);
  return cryptr.encrypt(text);
}

// The decrypt function
export function decrypt(encryptedString: string) {
  const cryptr = new Cryptr(encryptSecretKey);
  return cryptr.decrypt(encryptedString);
}
