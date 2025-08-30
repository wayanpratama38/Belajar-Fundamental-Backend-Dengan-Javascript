import {Pool} from 'pg';


export default class AuthenticationsService{
    _pool : Pool;

    constructor(){
        this._pool = new Pool();
    }

    async addRefreshToken(token: string) {
        const query = {
            text :` 
                INSERT INTO authentications VALUES($1)
            `,
            values : [token]
        };

        await this._pool.query(query);
    }

    async verifyRefreshToken(token : string) { 
        const query = {
            text : `
                SELECT * FROM authentications WHERE token = $1
            `,
            values : [token]
        }
        const result = await this._pool.query(query);
        if(!result.rows.length){
            throw new Error("Refresh token tidak valid!")
        }   
    }

    async deleteRefreshToken(token : string) { 
        const query = {
            text : `
                DELETE FROM authentications WHERE token = $1
            `,
            values : [token]
        }
        
        await this._pool.query(query);
    }
}