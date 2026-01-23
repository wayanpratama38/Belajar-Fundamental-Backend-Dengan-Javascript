import { createClient } from 'redis';

export default new (class RedisService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();

    this.set = this.set.bind(this);
    this.delete = this.delete.bind(this);
    this.get = this.get.bind(this);
  }

  async set(key, value) {
    await this._client.set(key, value, {
      EX: 18000,
    });
  }

  async delete(key) {
    await this._client.del(key);
  }

  async get(key) {
    // eslint-disable-next-line no-return-await
    return (await this._client.get(key));
  }
})();
