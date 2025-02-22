/* PROJECT LICENSE */

import { Server as HTTPServer, createServer as createHTTPServer } from 'http';
import { APIService } from './interafaces/routes';
import { Config } from './Config';
import { EventLogger } from './services/EventLogger';
import { StorageClient } from './infrastructure/storage/storageclient';

export class Server {
  /**
   * Server configuration.
   */
  protected config: Config;

  /**
   * Storage abstraction.
   */
  protected storageClient: StorageClient;

  /**
   * HTTP server used to listen for incoming requests.
   */
  protected httpServer: HTTPServer;

  /**
   * @param config - Application server configuration.
   */
  constructor(config: Config) {
    if (!config) { // Check configuration
      throw new Error('Configuration is required');
    }
    this.config = config;

    // Add api service
    this.httpServer = createHTTPServer(APIService);
    // Create storage client
    this.storageClient = StorageClient.getInstance();
  }
  /**
   * The server starts listening for http requests at specified port.
   */
  async listen(): Promise<void> {
    EventLogger.log('Connecting to storage service..');
    const storage = StorageClient.getInstance();
    await storage.connect({
      connectionLimit: this.config.mysql.poolConnectionLimit,
      database: this.config.mysql.databaseName,
      host: this.config.mysql.host,
      idleTimeout: this.config.mysql.poolMaxIdleTime,
      maxIdle: this.config.mysql.poolMaxIdleConnections,
      password: this.config.mysql.password,
      port: this.config.mysql.port,
      queueLimit: this.config.mysql.poolQueueLimit,
      user: this.config.mysql.user,
      waitForConnections: this.config.mysql.waitForConnections,
    }, {
      host: this.config.redis.host,
      port: this.config.redis.port,
    });
    EventLogger.log('done\n');

    return new Promise<void>((resolve) => {
      // Server start
      this.httpServer.listen(this.config.http.port, () => {
        EventLogger.info('Listening on port ' + this.config.http.port);
        resolve();
      });
    });
  }
  /**
   * Closes the server.
   */
  async close(): Promise<void> {
    await this.storageClient.close();
    await new Promise<void>((resolve, reject) => {
      this.httpServer.close(function (err: unknown) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}
