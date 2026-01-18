import AuthorizationError from "../../../exceptions/AuthorizationError.js";
import InvariantError from "../../../exceptions/InvariantError.js";
import NotFoundError from "../../../exceptions/NotFoundError.js";
import response from "../../../utils/Response.js";
import SongRepositories from "../../songs/repositories/SongRepositories.js";
import PlaylistRepositories from "../repositories/PlaylistRepositories.js";


const PlaylistController = {
 // POST /playlists
 async createNewPlaylist(req,res,next){
  // check if the playlist name is available
  const {name} = req.validate;
  const {userId} = req.user;

  const isNameAvail = await PlaylistRepositories.isPlaylistAvailable(name,'');
  if(isNameAvail){
   return next(new InvariantError('Playlist dengan username tersebut sudah digunakan'))
  }

  const result = await PlaylistRepositories.createNewPlaylist(name,userId)
  return response(res,201,'Berhasil membuat playlist baru',{playlistId : result.id})
 },


 // GET /playlists
 async getAllPlaylists(req,res,next){
  const {userId} = req.user;

  const result = await PlaylistRepositories.getAllPlaylists(userId);
  return response(res,200,'Berhasil mendapatkan semua playlist',{playlists: result})
 },

 // DELETE /playlists/:id
 async deletePlaylistById(req,res,next){
  const {id} = req.params;
  const {userId} = req.user;

  // check if the playlist exists
  const isPlaylistAvail = await PlaylistRepositories.isPlaylistAvailable('',id,userId);
  if(!isPlaylistAvail){
   return next(new AuthorizationError('Playlist dengan Id tersebut tidak ditemukan'))
  }

  // delete the playlist
  await PlaylistRepositories.deletePlaylist(id,userId);

  return response(res,200,'Berhasil menghapus playlist')  
 },

 // POST /playlists/:id/songs
 async addSongInPlaylist(req,res,next){
  const {id} = req.params;
  const {userId} = req.user;
  const {songId} = req.validate;



  // Check if the playlist exists and belong to user
  const isPlaylistExists = await PlaylistRepositories.isPlaylistAvailable('',id,userId);
  if(!isPlaylistExists){
   return next(new AuthorizationError('Playlist dengan Id tersebut tidak ditemukan'));
  }

  // Check if the songs exists
  const isSongExist = await SongRepositories.isSongAvailable(songId);
  if(!isSongExist){
   return next(new NotFoundError("Lagu dengan Id tersebut tidak ditemukan"))
  }

  // add add into playlist_song database
  await PlaylistRepositories.addSongIntoPlaylist(id,songId);

  return response(res,201,'Berhasil menambahkan lagu kedalam playlist')
 },

 // GET /playlists/:id/songs
 async getSongInPlaylist(req,res,next){
  const {id} = req.params;
  const {userId} = req.user;

  
  
  // Check if the playlist authorized
  const isPlaylistExists = await PlaylistRepositories.isPlaylistAvailable('',id,'');
  if(!isPlaylistExists){
   return next(new NotFoundError("Playlist dengan Id tersebut tidak ditemukan"))
  }

  const isAuthorized = await PlaylistRepositories.isPlaylistAvailable('',id,userId);
  if(!isAuthorized) {
   return next(new AuthorizationError("Tidak berhak untuk mendapatkan"))
  }

  const result = await PlaylistRepositories.getSongsInPlaylist(id);
  return response(res,200,'Berhasil mendapatkan Playlist + Lagu',{playlist : result})
 },

 // DELETE /playlists/:id/songs
 async deleteSongInPlaylist(req,res,next){
  const {id} = req.params;
  const {songId} = req.validate;
  const {userId} = req.user;

  // Check if the playlist exist
  const isPlaylistExists = await PlaylistRepositories.isPlaylistAvailable('',id,userId);
  if(!isPlaylistExists){
   return next(new AuthorizationError("Playlist dengan Id tersebut tidak ditemukan"))
  }

  // Check if the songs exists
  const isSongExist = await SongRepositories.isSongAvailable(songId);
  if(!isSongExist){
   return next(new InvariantError("Lagu dengan Id tersebut tidak ditemukan"))
  }

  await PlaylistRepositories.deleteSongInPlaylist(id,songId)
  return response(res,200,"Berhasil menghapus lagu didalam playlist")
 }
}

export default PlaylistController;