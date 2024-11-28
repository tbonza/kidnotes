/* 
 * Master state -> state complete -> store image
 */

interface MediaChunk {
  chunk: Uint8Array;
  userName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  chunkIndex: number; 
  fileLastModified: string;
};

type MediaCache = Map<string, MediaChunk[]>;
type UserCache = Map<string, MediaCache>;

// Store image

export function createEmptyUserCache() {
  const cache: UserCache = new Map();
  return cache;
}

export function createEmptyMediaCache() {
  const cache: MediaCache = new Map();
  return cache;
}
