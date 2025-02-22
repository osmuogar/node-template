/* PROJECT LICENSE */

export class Config {
  mysql: {
    host: string,
    port: number,
    databaseName: string,
    user: string,
    password: string,
    waitForConnections: boolean,
    poolConnectionLimit: number,
    poolQueueLimit: number,
    poolMaxIdleTime: number,
    poolMaxIdleConnections: number
    poolMaxConnectionLifeTime: number,
  };
  redis: {
    host: string,
    port: number
  };
  http: {
    port: number,
  };

  constructor(config: Partial<Config>) {
    if (!config.mysql) {
      throw new Error('mysql configuration is required');
    }
    this.mysql = config.mysql;
    if (!config.redis) {
      throw new Error('redis configuration is required');
    }
    this.redis = config.redis;
    if (!config.http) {
      throw new Error('http configuration is required');
    }
    this.http = config.http;
  }
}
