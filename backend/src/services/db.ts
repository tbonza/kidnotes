/* 
 * Master state -> state complete -> store image
 *
 * Multer with a dependency on busboy appears to be the current popular 
 * way to handle file uploads. 
 *
 * References:
 *  https://github.com/expressjs/multer
 */

export interface MediaChunk {
  chunk: Uint8Array;
  userName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  chunkIndex: number; 
  totalChunks: number,
  fileLastModified: string;
  fileHash: string;
};

type MediaCache = Map<string, MediaChunk[]>;
type UserCache = Map<string, MediaCache>;

// Store image

export async function createEmptyUserCache() {
  const cache: UserCache = new Map();
  return cache;
}

export async function createEmptyMediaCache() {
  const cache: MediaCache = new Map();
  return cache;
}

async function uploadComplete(chunks: MediaChunk[]) {
  const last = chunks.at(-1);
  if (last) {
    return (last.chunkIndex + 1 == last.totalChunks) && 
      (chunks.length == last.totalChunks);
  }
  return false;
}

async function upsertMediaCache(
  payload: MediaChunk, cache: MediaCache,
) {

  // Append or insert 
  const previousMedia = cache.get(payload.fileName);
  if (previousMedia) {

    previousMedia.push(payload);

    return cache;
  }  

  cache.set(payload.fileName, [ payload ]);

  return cache;
}

// Store media in cache until upload is complete. Validate upload, then
// write to disk. Disk storage is organized like a git repo with namespaces
// being `<username>/<filename>`. Uploaded files are first verified under the
// namespace `<username>/sandbox/<filename>`.
async function payloadHandler(
  payload: MediaChunk, cache: MediaCache
) {

  cache = await upsertMediaCache(payload, cache);
  const current = cache.get(payload.fileName);

  if (current && await uploadComplete(current)) {
    // TODO write file to sandbox location and validate file hash
    //      copy to storage once checks are complete
  }
}
