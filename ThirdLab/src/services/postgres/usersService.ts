import { Pool } from 'pg';
import type { Register } from '../../interface/booksInterface';
import { nanoid } from 'nanoid';
import  bycrypt from 'bcrypt';

export default class UsersService{
    private _pool : Pool;

    constructor(){
        this._pool = new Pool();
    };

    async verifyUsername(username : string) {
        const query = {
            text : `
                SELECT * FROM users WHERE username = $1
            `,
            values : [username]
        }
        const result = await this._pool.query(query);
        if(result.rowCount==0){
            return false;
        }
        return true;
    };

    async addUser(input : Register) {
        // TODO : Varifikasi username apakah sudah digunakan atau tidak 
        const {username, password, fullname} = input
        const duplicateUsername = await this.verifyUsername(username);
        if(!duplicateUsername) {
            console.log("Username already exist!");
        }
        
        // TODO : Bila verifikasi lolos, maka masukkan user baru ke database
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bycrypt.hash(password,10); 
        
        const query = {
            text : `
                INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id
            `,
            values : [id,username,hashedPassword,fullname]
        };

        const result = await this._pool.query(query);
        return result.rows[0].id;
    };

    async getUserById(userId : string) { 
        const query = {
            text : `
                SELECT * FROM users WHERE id = $1 
            `,
            values : [userId]
        };
        const result = await this._pool.query(query);
        const succcess = result.rowCount===0;
        if(!succcess) {
           console.log("User not found"); 
        };
        return result.rows[0];
    };
};