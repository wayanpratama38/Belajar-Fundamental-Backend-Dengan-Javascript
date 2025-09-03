import  { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

export default class UserService {
    _pool;

    constructor(){
        this._pool = new Pool();
    }

    async verifyUserCredential(username,password){
        // VERIFY USERNAME
        const verifyQuery = {
            text :`
                SELECT id,password FROM users WHERE username = $1
            `,
            values : [username]
        }
        const verifyResult = await this._pool.query(verifyQuery);
        
        if(verifyResult.rowCount==0){
            // TODO : handle if username not found
            console.log("USERNAME GAADA")
        }

        // VERIFY PASSWORD
        const {id,password : hashedPassword} = verifyResult.rows[0]; 
        const verifyPassword = bcrypt.compare(password,hashedPassword);
        if(!verifyPassword) {
            // TODO : handle if password wrong
            console.log("KREDENSIAL SALAH!")
        }

        return id;
    }

    async verifyUsername(username){
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
    }

    async addUser(username,password,fullname){
        const duplicateUsername = await this.verifyUsername(username);
        
        if(!duplicateUsername) {
            console.log("Duplicated Username");
            return;
        }
        const id = `user-${nanoid(16)}`
        const hashedPassword = await bcrypt.hash(password,10);
        
        const query = {
            text : `
                INSERT INTO users(id,username,password,fullname) 
                VALUES($1,$2,$3,$4)
                RETURNING id
            `,
            values : [id,username,hashedPassword,fullname]
        }
        const result = await this._pool.query(query);    
        return result.rows[0].id;
    }
}