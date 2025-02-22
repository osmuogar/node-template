/* PROJECT LICENSE */

import { RedisClientType, createClient } from 'redis';
import mysql from 'mysql2/promise';

/**
 * Abstracts the persistent and volatile storage.
 */
export class StorageClient {
  /**
   * Singleton instance of the storage client.
   */
  static _instance: StorageClient;

  /**
   * Pool of persistent storage connections.
   */
  persistentStorageConnection?: mysql.Pool;

  volatileStorageConnection?: RedisClientType;

  /**
   * Returns a storage client instance. Part of a singleton pattern.
   */
  static getInstance(): StorageClient {
    if (!StorageClient._instance) {
      StorageClient._instance = new StorageClient();
    }
    return StorageClient._instance;
  }

  /**
   * Constructor is private to force a singleton pattern.
   */
  private constructor() { }

  /**
   * Connects the client to the storage.
   * @param options - Connection options.
   */
  async connect(pSOptions: mysql.PoolOptions, vSOptions: {
    host: string, port: number,
  }): Promise<void> {
    try {
      this.persistentStorageConnection = await mysql.createPool(pSOptions);
    } catch (err: unknown) {
      /*
       * Connection to the MySQL server is usually lost due to either server
       * restart, or a connection idle timeout (The wait_timeout server variable
       * configures this).
       */
      if ((err as unknown as { code: string }).code === 'PROTOCOL_CONNECTION_LOST') {
        return this.connect(pSOptions, vSOptions);
      } else {
        throw err;
      }
    }
    try {
      this.volatileStorageConnection = createClient({
        url: 'redis://' + vSOptions.host + ':' + vSOptions.port,
      });
      this.volatileStorageConnection.on('error', (err) => {
        throw err;
      });
      await this.volatileStorageConnection.connect();
    } catch (err) {
      throw err;
    }
  }
  async close(): Promise<void> {
    if (this.persistentStorageConnection) {
      await this.persistentStorageConnection.end();
    }
    if (this.volatileStorageConnection) {
      await this.volatileStorageConnection.disconnect();
    }
  }
}
