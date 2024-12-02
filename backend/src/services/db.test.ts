import {expect, test} from '@jest/globals';
import * as fs from 'fs';

import { 
  createEmptyUserCache,
  createEmptyMediaCache,
  hashFile,
} from './db';

test('CRUD user cache', async() => {
  const cache = await createEmptyUserCache();

  const userName = 'foo';

  // Create empty user cache
  expect(!cache.has(userName)).toBe(true);
  expect(cache.size).toBe(0);

  // Update user cache
  cache.set(userName, await createEmptyMediaCache()); 
  expect(cache.has(userName)).toBe(true);

  const val = cache.get(userName);
  if (val) {
    expect(val.size).toBe(0);
  } else {
    expect(false).toBe(true);
  }

  // Delete user from cache
  cache.delete(userName);

  expect(!cache.has(userName)).toBe(true);
  expect(cache.size).toBe(0);

});

test('File hash exists', async() => {

  const filePath = 'README.md';
  expect(fs.existsSync(filePath)).toBe(true);

  const hash = await hashFile(filePath);
  expect(hash.length).toBe(64);

  const checkHash = await hashFile(filePath);
  expect(checkHash === hash).toBe(true);
})
