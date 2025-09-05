import PlaylistService from '../../service/playlists/playlistService.js';
import { payloadToStringConverter } from '../../utils/utils.js';
import { PlaylistValidator } from '../../validator/playlists/validator.js';

export default class PlaylistHandler {
  _service;
  _validator;

  constructor() {
    this._service = new PlaylistService();
    this._validator = PlaylistValidator;
    this.postNewPlaylist = this.postNewPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.getAllSongInPlaylist = this.getAllSongInPlaylist.bind(this);
    this.postSongIntoPlaylist = this.postSongIntoPlaylist.bind(this);
    this.deleteSongInPlaylist = this.deleteSongInPlaylist.bind(this);
    this.getPlayistActivities = this.getPlayistActivities.bind(this);
  }

  // POST/playlists
  async postNewPlaylist(request, h) {
    // validate
    this._validator.validatePostPlaylist(request.payload);
    // request payload and auth
    const { name } = request.payload;
    const { id } = request.auth.credentials;
    const ownerId = payloadToStringConverter(id);
    const result = await this._service.addPlaylist(name, ownerId);

    return h
      .response({
        status: 'success',
        data: {
          result,
        },
      })
      .code(201);
  }

  // GET/playlists
  async getPlaylists(request, h) {
    // request auth
    const { id } = request.auth.credentials;
    const ownerId = payloadToStringConverter(id);
    const result = await this._service.getPlaylist(ownerId);
    return h
      .response({
        status: 'success',
        data: {
          playlists: result,
        },
      })
      .code(200);
  }

  // DELETE/playlists/{id}
  async deletePlaylist(request, h) {
    // get request payload and auth
    const { id: playlistId } = request.params;
    const { id } = request.auth.credentials;
    const ownerId = payloadToStringConverter(id);
    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    await this._service.deletePlaylist(playlistId);
    return h
      .response({
        status: 'success',
        message: 'Berhasil menghapus playlist',
      })
      .code(200);
  }

  // POST/playlists/{id}/songs
  async postSongIntoPlaylist(request, h) {
    // validate
    this._validator.validatePostSongIntoPlaylist(request.payload);
    // get request payload and auth
    const { id } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const ownerId = payloadToStringConverter(id);
    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    await this._service.addSongIntoPlaylist(playlistId, songId);
    await this._service.addPlaylistActivities(
      playlistId,
      songId,
      ownerId,
      'add',
    );

    return h
      .response({
        status: 'success',
        message: 'Berhasil menambahkan musik kedalam playlist',
      })
      .code(201);
  }

  // GET/playlists/{id}/songs
  async getAllSongInPlaylist(request, h) {
    // get request payload and auth
    const { id } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const ownerId = payloadToStringConverter(id);
    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    const result = await this._service.getSongInPlaylist(playlistId);

    return h
      .response({
        status: 'success',
        data: {
          playlist: result,
        },
      })
      .code(200);
  }

  // DELETE/playlists/{id}/songs
  async deleteSongInPlaylist(request, h) {
    // get auth and params
    const { id } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const ownerId = payloadToStringConverter(id);
    await this._service.verifyPlaylistAccess(playlistId, ownerId);
    await this._service.deleteSongInPlaylist(songId, playlistId);
    await this._service.addPlaylistActivities(
      playlistId,
      songId,
      ownerId,
      'delete',
    );

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus musik',
    });
  }

  //GET /playlist/{id}/activities
    async getPlayistActivities(request,h){
        const {id : playlistId} = request.params
        const result = await this._service.getPlaylistActivities(playlistId)
        
        return h.response({
            status : 'success',
            data : {
                result
            }
        }).code(200);
    }
}
