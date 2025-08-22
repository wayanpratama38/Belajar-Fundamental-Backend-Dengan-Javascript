import SongsService from "../service/service.js";

export default class SongsHandler{
    // to handle request
    _service;
    _validator;

    constructor() { 
        this._service = new SongsService();
        // this._validator = validator;

        this.postNewSong = this.postNewSong.bind(this)
        this.getAllSongs = this.getAllSongs.bind(this)
        this.getSongById = this.getSongById.bind(this)
        this.updateSong = this.updateSong.bind(this)
        this.deleteSong = this.deleteSong.bind(this)
    }

    async postNewSong(request,h) {
        const result = await this._service.addSong(
            request
        ) 
        request.log('error','error event')

        return h.response({
            status : "success",
            data : {
                songId : result.songId
            }
        }).code(201)
    }

    async getAllSongs(request,h) {
        const result = await this._service.getAllSongs();
        return h.response({
            status : "success",
            data : { result }
        }).code(200)
    }

    async getSongById(request,h) {
        const {id} = request.params;
        const result = await this._service.getSongById(id);
        return h.response({
            status : "success",
            data : { result }
        })
    }

    async updateSong(request,h) { 
        const { id } = request.params
        await this._service.updateSongById(id,request.payload);
        return h.response({
            status : "success",
            message : "Successfully updating song information"
        }).code(200)
    }

    async deleteSong(request,h){
        const { id } = request.params
        await this._service.deleteSong(id);
        return h.response({
            status : "success",
            message : "Successfully delete song"
        })
    }
}