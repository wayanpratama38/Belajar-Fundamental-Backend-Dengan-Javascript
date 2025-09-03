import {Pool} from 'pg'

export default class AuthenticationService {
    _pool;

    constructor(){
        this._pool = new Pool();
    }

    // addToken
    async addToken(token){
        const query = {
            text : `
                INSERT INTO authentications(token) VALUES($1)
            `,
            values : [token]
        }
        await this._pool.query(query);
    }

    // verifyToken
    async verifyToken(token){
        const query = {
            text :`
                SELECT * FROM authentications WHERE token = $1
            `,
            values : [token]
        }
        const result = await this._pool.query(query);
        if(result.rowCount==0){
            console.log("TOKEN TIDAK DITEMUKAN")
        }
    }

    // deleteToken
    async deleteToken(token){
        const query = {
            text : `
                DELETE FROM authentications WHERE token = $1
            `,
            values : [token]
        }
        await this._pool.query(query);
    }
}