import { nanoid } from "nanoid";
import { Pool } from "pg"
import UserRepositories from "../../users/repositories/UserRepositories.js";
import SongRepositories from "../../songs/repositories/SongRepositories.js";

export default new (class PlaylistRepositories{
 constructor(){
  this.pool = new Pool();
 }


 async isPlaylistAvailable(playlistName='',playlistId='',userId=''){
  let query = {
   text :'',
   values :[]
  };
  
  if(playlistName.length>0){
   query = {
    text : "SELECT * FROM playlists WHERE name = $1",
    values : [playlistName]
   }
  }

  if(playlistId.length>0){
   query = {
    text : "SELECT * FROM playlists WHERE id = $1",
    values : [playlistId]
   }
  }

  if(playlistId.length>0 && userId.length>0){
   query = {
    text : "SELECT * FROM playlists WHERE id = $1 AND owner = $2",
    values : [playlistId,userId]
   }
  }

  return (await this.pool.query(query)).rowCount>0;

 }


 // Create new playlists
 async createNewPlaylist(playlistName,userId){
  
  const id = nanoid(16);
  const query = {
   text : 'INSERT INTO playlists(id,name,owner) VALUES ($1,$2,$3) RETURNING id',
   values : [id,playlistName,userId]
  }

  const result = (await this.pool.query(query)).rows[0];
  return result;
 }

 // Get all playlists 
 async getAllPlaylists(userId){
  const query = {
   text : "SELECT * FROM playlists WHERE owner=$1",
   values : [userId]
  }
  const userData = await UserRepositories.getUserById(userId);
  
  const result = (await this.pool.query(query)).rows.map((playlist)=>{
   return {
    id : playlist.id,
    name : playlist.name,
    username : userData.username
   }
  });

  return result;
 }

 // Get playlist by Id
 async getPlaylistById(playlistId){
  const query = {
   text : 'SELECT * FROM playlists WHERE id = $1',
   values : [playlistId]
  }

  return (await this.pool.query(query)).rows[0];
 }

 // Delete playlist
 async deletePlaylist(playlistId,userId){
  // Check if the playlist with this id exist

  const query = {
   text : "DELETE FROM playlists WHERE id = $1 AND owner = $2",
   values : [playlistId,userId]
  }

  await this.pool.query(query);
 }


 // Add songs into playlists
 async addSongIntoPlaylist(playlistId,songId){
  const id = nanoid(16);
  const query = {
   text : "INSERT INTO playlist_song(id,playlist_id,song_id) VALUES ($1,$2,$3) RETURNING ID",
   values : [id,playlistId,songId]
  } 

  await this.pool.query(query);
  
 }



 // Get song in playlist
 async getSongsInPlaylist(playlistId){

  const query = {
   text : "SELECT * FROM playlist_song WHERE playlist_id = $1",
   values : [playlistId]
  }

  // query to database and mapping the result to be response wanted
  const result = await Promise.all((await this.pool.query(query)).rows.map(async (song)=> {
   const songData = await SongRepositories.getSongById(song.song_id);
   return {
    id : song.id,
    title : songData.title,
    performer : songData.performer
   }
  }))

  // get the playlist information
  const playlistData = await this.getPlaylistById(playlistId);

  // Get the username by id 
  const userData = await UserRepositories.getUserById(playlistData.owner);


  return {
   id : playlistData.id,
   name : playlistData.name,
   username : userData.username , 
   songs : result
  }
 } 


 // Delete song in playlists
 async deleteSongInPlaylist(playlistId,songId){
  // Check if the playlist id exist
  
  // Check if the song id exist

  const query = {
   text : "DELETE FROM playlist_song WHERE playlist_id = $1 AND song_id = $2",
   values : [playlistId,songId]
  }

  await this.pool.query(query);
 }


})()