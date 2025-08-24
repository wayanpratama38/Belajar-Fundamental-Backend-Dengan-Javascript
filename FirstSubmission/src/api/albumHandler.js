import AlbumsService from '../service/albumService.js';


export default class AlbumsHandler{
    // Private variables
    _service;

    constructor(){
        this._service = new AlbumsService();
        this.addAlbum = this.addAlbum.bind(this);
        this.getAlbum = this.getAlbum.bind(this);
        this.updateAlbum = this.updateAlbum.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    /**
     * Handler for adding new album into database
     * @param request request from user (including request paramter and payload)
     * @param h  response to user 
     * @returns HTTP response with status success or fail and data { id }
     * 
     * @example
     * {
     *  status : "success",
     *  data : {
     *      id : "vvnsdvjksevi-eqiebgwr"
     *  }
     * } 
     */
    async addAlbum(request,h){
        const result = await this._service.addAlbum(request.payload);
        // TODO : ADD ERROR HANDLING
        return h.response({
            status : 'success',
            data : {
                id : result
            }
        }).code(201);
            
    }

    /**
     * Handler for getting specify album from database
     * @param {*} request request from user (including request parameter and payload) 
     * @param {*} h response to user
     * @returns HTTP response with status success or fail and data { album : result }
     * 
     * @example
     * {
     *  status : succes
     *  data : {
     *      album : {
     *          id : "asbajfhbaffy-adawd",
     *          name : "album 1",
     *          year : 2019
     *      }
     *  }
     * }
     */
    async getAlbum(request,h){
        const { id } = request.params;
        const result = await this._service.getAlbumById(id);
        // TODO : ADD ERROR HANDLING
        return h.response({
            status : 'success',
            data : {
                album : result
            }
        }).code(200);
    }

    /**
     * Handler for updating specify album information from database
     * @param {*} request request from user (including request parameter and payload) 
     * @param {*} h response to user
     * @returns HTTP response with status success or fail and message
     * 
     * @example
     * {
     *  status : succes
     *  message : Successfully update album information
     * }
     */
    async updateAlbum(request,h){
        const { id } = request.params;
        const result = await this._service.updateAlbumById(id,request.payload);
        // TODO : ADD ERROR HANDLING
        return h.response({
            status : 'success',
            message : 'Successfully update album information'
        }).code(200);
    }

    /**
     * Handler for deleting specify album from database
     * @param {*} request request from user (including request parameter and payload) 
     * @param {*} h response to user
     * @returns HTTP response with status success or fail and message
     * 
     * @example
     * {
     *  status : succes
     *  message : Successfully delete album
     * }
     */
    async deleteAlbum(request,h){
        const { id } = request.params;
        const result = await this._service.deleteAlbumById(id)
        // TODO : ADD ERROR HANDLING
        return h.response({
            status : 'success',
            message : 'Successfully delete album'
        }).code(200);
    }
}