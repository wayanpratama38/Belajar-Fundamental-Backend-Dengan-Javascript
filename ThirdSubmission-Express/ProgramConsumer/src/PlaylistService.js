import {Pool} from 'pg';

export default class PlaylistService{
 constructor(){
  this.pool = new Pool();
  
  this.getPlaylist = this.getPlaylist.bind(this);
 }

 // Get the playlist information
 async getPlaylist(playlistId){
  // Create the query
  const query = {
   text : `
   SELECT p.name, s.id, s.title, s.performer
   FROM playlists p
   LEFT JOIN playlist_song ps ON ps.playlist_id = p.id
   LEFT JOIN songs s ON s.id = ps.song_id
   WHERE p.id = $1
   `,
   values : [playlistId]
  }
  
  // Query data from database
  const queryResult= (await this.pool.query(query)).rows;
  
  // Mapping result to response wanted
  const result = {
   id : playlistId,
   name : queryResult[0].name,
   songs : queryResult.map((song)=>{
    return{
     id : song.id,
     title : song.title,
     performer : song.performer
    }
   })
  }

  // Returning response wanted
  return {playlist : result};
 }
}