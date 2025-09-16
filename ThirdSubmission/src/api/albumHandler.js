import AlbumsService from '../service/albumService.js';
import StorageService from '../service/S3/storageService.js';
import { Validator } from '../validator/validator.js';

export default class AlbumsHandler {
  // Private variables
  _service;
  _storageService;
  _validator;

  constructor() {
    this._service = new AlbumsService();
    this._validator = Validator;
    this._storageService = new StorageService();
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
  async addAlbum(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const result = await this._service.addAlbum(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          albumId: result,
        },
      })
      .code(201);
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
  async getAlbum(request, h) {
    const { id } = request.params;
    const result = await this._service.getAlbumById(id);

    return h
      .response({
        status: 'success',
        data: {
          album: result,
        },
      })
      .code(200);
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
  async updateAlbum(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.updateAlbumById(id, request.payload);

    return h
      .response({
        status: 'success',
        message: 'Successfully update album information',
      })
      .code(200);
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
  async deleteAlbum(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return h
      .response({
        status: 'success',
        message: 'Successfully delete album',
      })
      .code(200);
  }

  async postAlbumCover(request,h){  
    // check request payload
    const { data } = request.payload;
    const { albumId } = request.params; 
    this._validator.validateUploadAlbumCoverPayload(data.hapi.headers);

    // send to aws s3 to get url
    const coverUrl = await this._storageService.writeFile(data, data.hapi);

    // post to dabtase
    await this._service.postAlbumCover(albumId,coverUrl);
    
    return h.response({
      status : 'success',
      message : 'Sampul berhasil diunggah'
    }).code(201);
  }
}
