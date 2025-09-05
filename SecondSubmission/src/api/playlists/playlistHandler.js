import PlaylistService from "../../service/playlists/playlistService.js";
import { payloadToStringConverter } from "../../utils/utils.js";


export default class PlaylistHandler{
    _service;
    // _validator;

    constructor(){
        this._service = new PlaylistService();
        
        this.postNewPlaylist = this.postNewPlaylist.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.getPlaylists = this.getPlaylists.bind(this);
        this.getAllSongInPlaylist = this.getAllSongInPlaylist.bind(this);
        this.postSongIntoPlaylist = this.postSongIntoPlaylist.bind(this);
        this.deleteSongInPlaylist = this.deleteSongInPlaylist.bind(this);
    }

    // POST/playlists
    async postNewPlaylist(request,h){
        //TODO : validate

        // request payload and auth
        const {name} = request.payload;
        const {id} = request.auth.credentials;
        const ownerId = payloadToStringConverter(id)
        // console.log(typeof ownerId)
        const result = await this._service.addPlaylist(name,ownerId);

        return h.response({
            status : 'success',
            data : {
                result
            }
        }).code(201)
    }

    // GET/playlists
    async getPlaylists(request,h){
        // TODO : validate

        // request auth
        const {id} = request.auth.credentials
        const ownerId = payloadToStringConverter(id);
        const result = await this._service.getPlaylist(ownerId);
        return h.response({
            status : 'success',
            data : {
                playlists: result
            }
        }).code(200)
    }

    // DELETE/playlists/{id}
    async deletePlaylist(request,h){
        //TODO : validate
        
        // get request payload and auth
        const { id : playlistId } = request.params
        console.log(playlistId);
        const { id } = request.auth.credentials
        const ownerId = payloadToStringConverter(id);
        
        await this._service.verifyPlaylistOwner(ownerId);
        await this._service.deletePlaylist(playlistId);
        return h.response({
            status :'success',
            message : "Berhasil menghapus playlist"
        }).code(200)
    }    

    // POST/playlists/{id}/songs
    async postSongIntoPlaylist(request,h){
        //TODO : validate

        // get request payload and auth
        const {id} = request.auth.credentials
        const {id : playlistId} = request.params
        const {songId} = request.payload
        const ownerId = payloadToStringConverter(id)
        console.log(ownerId,playlistId,songId);
        await this._service.verifyPlaylistOwner(ownerId);
        await this._service.addSongIntoPlaylist(playlistId,songId);

        return h.response({
            status : 'success',
            message : 'Berhasil menambahkan musik kedalam playlist'
        }).code(201)
    }

    // GET/playlists/{id}/songs
    async getAllSongInPlaylist(request,h){
        //TODO : validate
        console.log("TEST")
        // get request payload and auth
        const {id} = request.auth.credentials
        const {id : playlistId} = request.params
        const ownerId = payloadToStringConverter(id);
        await this._service.verifyPlaylistOwner(ownerId)
        const result = await this._service.getSongInPlaylist(playlistId);

        return h.response({
            status : 'success',
            data : {
                playlist : result
            }
        }).code(200)
    }

    // DELETE/playlists/{id}/songs
    async deleteSongInPlaylist(request,h){
        //TODO : validate

        // get auth and params
        const {id} = request.auth.credentials
        const {id : playlistId} = request.params
        const {songId} = request.payload
        const ownerId = payloadToStringConverter(id)
        await this._service.verifyPlaylistOwner(ownerId);
        await this._service.deleteSongInPlaylist(songId,playlistId);

        return h.response({
            status : 'success',
            message : 'Berhasil menghapus musik'
        })
    }
}