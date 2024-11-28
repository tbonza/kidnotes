import {expect, test} from '@jest/globals';

import { 
  createEmptyUserCache,
  createEmptyMediaCache,
} from './db';

test('CRUD user cache', async() => {
  const cache = createEmptyUserCache();

  const userName = 'foo';

  // Create empty user cache
  expect(!cache.has(userName)).toBe(true);
  expect(cache.size).toBe(0);

  // Update user cache
  cache.set(userName, createEmptyMediaCache()); 
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

test('CRUD media cache', async() => {
  // only difference here is expected to be that the media cache contains an
  // array of chunks from streaming. media can be written to disk as it's 
  // receieved then copied once validated.

  expect(true).toBe(true); // TODO step media cache crud with empty array 
});
