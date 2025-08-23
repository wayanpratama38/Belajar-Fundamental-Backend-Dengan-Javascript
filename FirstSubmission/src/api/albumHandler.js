import AlbumsService from '../service/albumService.js';


export default class AlbumsHandler{
    _service;

    constructor(){
        this._service = new AlbumsService();
        this.addAlbum = this.addAlbum.bind(this);
        this.getAlbum = this.getAlbum.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    async addAlbum(request,h){
        const result = await this._service.addAlbum(request.payload);

        return h.response({
            status : 'success',
            data : {
                id : result
            }
        }).code(201);
            
    }

    async getAlbum(request,h){
        const { id } = request.params;
        const result = await this._service.getAlbumById(id);

        return h.response({
            status : 'success',
            data : {
                album : result
            }
        }).code(200);
    }

    async updateAlbum(request,h){
        const { id } = request.params;
        const result = await this._service.updateAlbumById(id,request.payload);

        return h.response({
            status : 'success',
            message : 'Successfully update album information'
        }).code(200);
    }

    async deleteAlbum(request,h){
        const { id } = request.params;
        const result = await this._service.deleteAlbumById(id)

        return h.response({
            status : 'success',
            message : 'Successfully delete album'
        }).code(200);
    }
}