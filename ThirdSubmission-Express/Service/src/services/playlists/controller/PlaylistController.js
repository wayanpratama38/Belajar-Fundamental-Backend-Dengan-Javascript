import AuthorizationError from '../../../exceptions/AuthorizationError.js';
import InvariantError from '../../../exceptions/InvariantError.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';
import response from '../../../utils/Response.js';
import RedisService from '../../cache/RedisService.js';
import SongRepositories from '../../songs/repositories/SongRepositories.js';
import PlaylistRepositories from '../repositories/PlaylistRepositories.js';

const PlaylistController = {
  // POST /playlists
  async createNewPlaylist(req, res, next) {
  // check if the playlist name is available
    const { name } = req.validate;
    const { userId } = req.user;

    const isNameAvail = await PlaylistRepositories.isPlaylistAvailable(name, '', '');
    if (isNameAvail) {
      return next(new InvariantError('Playlist dengan username tersebut sudah digunakan'));
    }

    // Check if have cache or not
    const cache = await RedisService.get(`playlists:${userId}`);
    if(cache){
     await RedisService.delete(`playlists:${userId}`);
    }

    const result = await PlaylistRepositories.createNewPlaylist(name, userId);
    return response(res, 201, 'Berhasil membuat playlist baru', { playlistId: result.id });
  },

  // GET /playlists
  // eslint-disable-next-line no-unused-vars
  async getAllPlaylists(req, res, next) {
    const { userId } = req.user;

    const cache = await RedisService.get(`playlists:${userId}`);
    if(cache){
     const result = JSON.parse(cache).map((res)=> JSON.parse(res));
     res.set('X-Data-Source','cache');
     return response(res, 200, 'Berhasil mendapatkan semua playlist', { playlists: result });
     
    }
    
    const result = await PlaylistRepositories.getAllPlaylists(userId);
    return response(res, 200, 'Berhasil mendapatkan semua playlist', { playlists: result });
  },

  // DELETE /playlists/:id
  async deletePlaylistById(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;

    // check if the playlist exists
    const isPlaylistAvail = await PlaylistRepositories.isPlaylistAvailable('', id, userId);
    if (!isPlaylistAvail) {
      return next(new AuthorizationError('Playlist dengan Id tersebut tidak ditemukan'));
    }

    // Check if have cache or not
    const cache = await RedisService.get(`playlists:${userId}`);
    if(cache){
     await RedisService.delete(`playlists:${userId}`);
    }

    // delete the playlist
    await PlaylistRepositories.deletePlaylist(id, userId);
    
    return response(res, 200, 'Berhasil menghapus playlist');
  },

  // POST /playlists/:id/songs
  async addSongInPlaylist(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    const { songId } = req.validate;

    // Check if the playlist exists and belong to user
    const isPlaylistExists = await PlaylistRepositories.isPlaylistCollaborate(id, userId);
    if (!isPlaylistExists) {
      return next(new AuthorizationError('Tidak berhak untuk mengakses Playlist'));
    }

    // Check if the songs exists
    const isSongExist = await SongRepositories.isSongAvailable(songId);
    if (!isSongExist) {
      return next(new NotFoundError('Lagu dengan Id tersebut tidak ditemukan'));
    }

    // add into playlist_song database
    await PlaylistRepositories.addSongIntoPlaylist(id, songId);

    // add to activities
    await PlaylistRepositories.addPlaylistSongAcitivities(id, songId, userId, 'add');

    // remove cache
    const cache = await RedisService.get(`playlistActivities:${id}`);
    if(cache){
     await RedisService.delete(`playlistActivities:${id}`);
    }

    return response(res, 201, 'Berhasil menambahkan lagu kedalam playlist');
  },

  // GET /playlists/:id/songs
  async getSongInPlaylist(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;

    // Check if the playlist exist
    const isPlaylistExists = await PlaylistRepositories.isPlaylistAvailable('', id, '');
    if (!isPlaylistExists) {
      return next(new NotFoundError('Playlist dengan Id tersebut tidak ditemukan'));
    }

    // Check if the user is authorize with the playlist
    const isAuthorized = await PlaylistRepositories.isPlaylistCollaborate(id, userId);
    if (!isAuthorized) {
      return next(new AuthorizationError('Tidak berhak untuk mendapatkan'));
    }

    const result = await PlaylistRepositories.getSongsInPlaylist(id);
    return response(res, 200, 'Berhasil mendapatkan Playlist + Lagu', { playlist: result });
  },

  // DELETE /playlists/:id/songs
  async deleteSongInPlaylist(req, res, next) {
    const { id } = req.params;
    const { songId } = req.validate;
    const { userId } = req.user;

    // Check if the playlist exist
    const isPlaylistExists = await PlaylistRepositories.isPlaylistCollaborate(id, userId);
    if (!isPlaylistExists) {
      return next(new AuthorizationError('Playlist dengan Id tersebut tidak ditemukan'));
    }

    // Check if the songs exists
    const isSongExist = await SongRepositories.isSongAvailable(songId);
    if (!isSongExist) {
      return next(new InvariantError('Lagu dengan Id tersebut tidak ditemukan'));
    }

    // Delete song from playlist
    await PlaylistRepositories.deleteSongInPlaylist(id, songId);

    // add to playlist activities
    await PlaylistRepositories.addPlaylistSongAcitivities(id, songId, userId, 'delete');

    // remove cache
    const cache = await RedisService.get(`playlistActivities:${id}`);
    if(cache){
     await RedisService.delete(`playlistActivities:${id}`);
    }
 
    // send response
    return response(res, 200, 'Berhasil menghapus lagu didalam playlist');
  },

  // GET Playlist Activities
  async getPlaylistAcitivities(req, res, next) {
    const { userId } = req.user;
    const { id: playlistId } = req.params;

    // Check if the playlist exist
    const isPlaylistExists = await PlaylistRepositories.isPlaylistAvailable('', playlistId, '');
    if (!isPlaylistExists) {
      return next(new NotFoundError('Playlist dengan Id tersebut tidak ditemukan'));
    }

    // Check if the current user is authorize
    const isAuthorize = await PlaylistRepositories.isPlaylistCollaborate(playlistId, userId);
    if (!isAuthorize) {
      return next(new AuthorizationError('Tidak berhak untuk mengakses Playlist'));
    }


    // Get from cache
    const cache = await RedisService.get(`playlistActivities:${playlistId}`);
    if(cache){
     res.set('X-Data-Source','cache');
     return response(res,200,'Berhasi mendapatkan aktivitas dari playlist', JSON.parse(cache))
    }

    // Get the activities
    const result = (await PlaylistRepositories.getPlaylistActivities(playlistId));
    return response(res, 200, 'Berhasil mendapatkan aktivitas dari playlist', result);
  },
};

export default PlaylistController;
