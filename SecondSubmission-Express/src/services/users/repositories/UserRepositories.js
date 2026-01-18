import { nanoid } from "nanoid";
import { Pool } from "pg"
import bcrypt from 'bcrypt';


export default new (class UserRepositories{
 constructor(){
  this.pool = new Pool();
 }

 // Verify username
 async isUsernameAvailable(username){
  const query={
   text:'SELECT * FROM users WHERE username=$1',
   values:[username]
  }

  return (await this.pool.query(query)).rowCount===0;
 }

 // Get user by username
 async getUserByUsername(username){
  const query = {
   text : 'SELECT * FROM users WHERE username=$1',
   values : [username]
  }
  return (await this.pool.query(query)).rows[0];
 }

 // Create new user
 async createNewUser({username, password, fullname}){
  const id = nanoid(16);
  const hashedPassword = await bcrypt.hash(password,10);
  
  const query = {
   text: 'INSERT INTO users(id,username,password,fullname) VALUES ($1,$2,$3,$4) RETURNING id',
   values: [id,username,hashedPassword,fullname]
  }

  const result = (await this.pool.query(query)).rows[0];
  return result;
 }

 // Verify user credential
 async verifyUserCredential({username,password}) {
  const userData = await this.getUserByUsername(username);
  return (await bcrypt.compare(password,userData.password));
  }
})()