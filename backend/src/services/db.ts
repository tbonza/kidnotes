/* Master state -> state complete -> store image
 *
 * Multer with a dependency on busboy appears to be the current popular 
 * way to handle file uploads. 
 *
 * References:
 *  https://github.com/expressjs/multer
 */
import * as crypto from 'crypto';
import * as fs from 'fs';
import path from 'path';


export async function hashFile(
  filePath: string, algorithm: string = 'sha256'): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}



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

interface MediaStorage {
  userName: string;
  fileName: string;
  fileType: string;
  fileLastModified: string;
  fileHash: string;
  fileStoragePath: string;
}

type MediaCache = Map<string, MediaChunk[]>;
type UserCache = Map<string, MediaCache>;

// Store image

export async function createEmptyUserCache(): Promise<UserCache> {
  const cache: UserCache = new Map();
  return cache;
}

export async function createEmptyMediaCache(): Promise<MediaCache> {
  const cache: MediaCache = new Map();
  return cache;
}

async function uploadComplete(chunks: MediaChunk[]): Promise<boolean> {
  const last = chunks.at(-1);
  if (last) {
    return (last.chunkIndex + 1 == last.totalChunks) && 
      (chunks.length == last.totalChunks);
  }
  return false;
}

async function upsertMediaCache(
  payload: MediaChunk, cache: MediaCache,
): Promise<MediaCache> {

  // Append or insert 
  const previousMedia = cache.get(payload.fileName);
  if (previousMedia) {

    previousMedia.push(payload);

    return cache;
  }  

  cache.set(payload.fileName, [ payload ]);

  return cache;
}

async function writeMediaFile(filePath: string, buffer: MediaChunk[]){
  const stream = fs.createWriteStream(filePath);
  for (const item of buffer) {

    // Check if stream is ready to accept more data
    if (!stream.write(item.chunk)) {
      // Wait for the drain event before writing more data
      await new Promise(resolve => stream.once('drain', resolve));
    }
  }

  // Close the stream when finished
  stream.end();

  // Wait for the finish event to ensure all the data is written
  await new Promise(resolve => stream.once('finish', resolve));
}

// Store media in cache until upload is complete. Validate upload, then
// write to disk. Disk storage is organized like a git repo with namespaces
// being `<username>/<filename>`. Uploaded files are first verified under the
// namespace `<username>/sandbox/<filename>`. Metadata is stored as a single
// file `<username>/metadata.jsonl` where each line is a `MediaStorage` object.
async function payloadStreamHandler(
  payload: MediaChunk, cache: MediaCache, 
  storageDirPath: string, sandboxDirName: string,
  metadataFilePath: string,
) {

  cache = await upsertMediaCache(payload, cache);
  const current = cache.get(payload.fileName);

  if (current && await uploadComplete(current)) {

    const tempFilePath = path.join(
      storageDirPath, sandboxDirName, payload.fileName
    );
    const storageFilePath = path.join(
      storageDirPath, payload.fileName
    );

    try {
      await writeMediaFile(tempFilePath, current);
      const hash = await hashFile(tempFilePath)
      if (hash === payload.fileHash) {

        // copy binary file to storage location
        const record: MediaStorage = {
          userName: payload.userName,
          fileName: payload.fileName,
          fileType: payload.fileType,
          fileLastModified: payload.fileLastModified,
          fileHash: payload.fileHash,
          fileStoragePath: storageFilePath,
        }

        fs.copyFile(tempFilePath, storageFilePath, (err) => {
          if (err) throw err;
          // log file write
        })

        // append metadata file
        const jsonLine = `${JSON.stringify(record)}\n`
        fs.appendFile(metadataFilePath, jsonLine, (err) => {
          if (err) {
            // keep binary file, log error
          }
          // log file write
        })
      } else { throw new Error(`Invalid file hash.`); }
    } catch {
      // log error
    }
  }
}
