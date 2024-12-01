import {expect, test} from '@jest/globals';

import { 
  createEmptyUserCache,
  createEmptyMediaCache,
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

test('Validate upload before writing to disk', async() => {

})
