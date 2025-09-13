import { Pool } from 'pg';
import type { Register } from '../../interface/booksInterface';
import { nanoid } from 'nanoid';

export default class UsersService{
    private _pool : Pool;

    constructor(){
        this._pool = new Pool();
    };

    async verifyUserCredentials(username : string, password : string) { 
        const query = {
            text : `
            SELECT id,password FROM users WHERE username = $1
            `,
            values : [username]
        }
        const result = await this._pool.query(query);
        console.log(result.rows[0].password,result.rows[0].password.length);
        if(!result.rows.length) {
            throw new Error("Kredensial yang diberikan salah!")
        }

        const { id, password : hashedPassword } = result.rows[0]; 
        const isMatch = await Bun.password.verify(password,hashedPassword,'bcrypt');
        console.log("ISMATCH",isMatch)

        if(!isMatch){
            throw new Error("Password yang diberikan salah")
        }

        return id;
    }

    async verifyUsername(username : string) {
        const query = {
            text : `
                SELECT * FROM users WHERE username = $1
            `,
            values : [username]
        }
        const result = await this._pool.query(query);
        if(result.rowCount==0){
            return true;
        }
        return false;
    };

    async addUser(input : Register) {
        
        const {username, password, fullname} = input
        const duplicateUsername = await this.verifyUsername(username);
        if(!duplicateUsername) {
            console.log("Username already exist!");
        }

        
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await Bun.password.hash(password,'bcrypt')
        
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