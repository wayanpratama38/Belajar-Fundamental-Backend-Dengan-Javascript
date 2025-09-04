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
}