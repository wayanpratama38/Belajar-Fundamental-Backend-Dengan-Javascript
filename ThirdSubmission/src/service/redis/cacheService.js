import * as redis from 'redis';
import NotFoundError from '../../exceptions/notFoundError.js';


export default class CacheService {
    _client;
    
    constructor(){
        this._client = redis.createClient({
            socket : {
                host : process.env.REDIS_SERVER
            }
        })

        this._client.on('error', (error) => {
            console.log(error);
        })

        this._client.connect();
    }

    async set(key, value, expirationInSecond = 1800){
        await this._client.set(key,value,{
            EX : expirationInSecond
        })
    };

    async get(key){
        const result = await this._client.get(key);

        if(result === null) throw new NotFoundError('Cache tidak ditemukan');

        return result;
    }

    delete(key){
        return this._client.del(key);
    }
}