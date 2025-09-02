import SongsService from '../service/songService.js';
import { Validator } from '../validator/validator.js';

export default class SongsHandler {
  // Private variable
  _service; // for songsService
  _validator; // for songValidator

  constructor() {
    this._service = new SongsService();
    this._validator = Validator;

    this.postNewSong = this.postNewSong.bind(this);
    this.getAllSongs = this.getAllSongs.bind(this);
    this.getSongById = this.getSongById.bind(this);
    this.updateSong = this.updateSong.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
  }

  /**
   * Handler for adding new song
   * @param request request from user (including request paramter and payload)
   * @param h  response to user
   * @returns HTTP response with status success or fail and data : { songId }
   *
   * @example
   * {
   *  status : success
   *  data : {
   *      songId : "afjnakfjanf-efsejfse"
   *  }
   * }
   */
  async postNewSong(request, h) {
    this._validator.validateSongPayload(request.payload);
    const result = await this._service.addSong(request.payload);

    return h
      .response({
        status: 'success',
        data: {
          songId: result,
        },
      })
      .code(201);
  }

  /**
   * Handler for getting all songs from database
   * @param request request from user (including request paramter and payload)
   * @param h  response to user
   * @returns HTTP response with status success or fail and data : { songs : song }
   *
   * @example
   * {
   *  status : success
   *  data : {
   *      songs : [
   *      {
   *          id : "mnw9GkVlivj0-hOy",
   *          title : "Song title" ,
   *          year : 1234,
   *          genre : "rock",
   *          duration :1235,
   *          albumId:"2kdjfjefb-21afef",
   *      },
   *      {
   *          id : "mnw9GkVlivj0-hOy",
   *          title : "Song title" ,
   *          year : 1234,
   *          genre : "rock",
   *          duration :1235,
   *          albumId:"2kdjfjefb-21afef",
   *      }
   *    ]
   *  }
   * }
   */
  async getAllSongs(request, h) {
    const { title, performer } = request.query;
    const result = await this._service.getAllSongs(title, performer);

    return h
      .response({
        status: 'success',
        data: {
          songs: result,
        },
      })
      .code(200);
  }

  /**
   * Handler for getting specify song from database
   * @param request request from user (including request paramter and payload)
   * @param h  response to user
   * @returns HTTP response with status success or fail and data : { song : result }
   *
   * @example
   * {
   *  status : success
   *  data : {
   *      song : {
   *          id : "mnw9GkVlivj0-hOy",
   *          title : "Song title" ,
   *          year : 1234,
   *          genre : "rock",
   *          duration :1235,
   *          albumId:"2kdjfjefb-21afef",
   *      }
   *  }
   * }
   */
  async getSongById(request, h) {
    const { id } = request.params;
    const result = await this._service.getSongById(id);

    return h
      .response({
        status: 'success',
        data: {
          song: result,
        },
      })
      .code(200);
  }

  async getSongByQuery(request, h) {
    const { title, performer } = request.query;
    const result = await this._service.getSongsByQuery(title, performer);
    return h.response({
      status: 'success',
      data: {
        result,
      },
    });
  }

  /**
   * Handler for updating specify song information from database
   * @param request request from user (including request paramter and payload)
   * @param h  response to user
   * @returns HTTP response with status success or fail and message
   *
   * @example
   * {
   *  status : success
   *  message : Sucessfully updating song information
   * }
   */
  async updateSong(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.updateSongById(id, request.payload);

    return h
      .response({
        status: 'success',
        message: 'Successfully updating song information',
      })
      .code(200);
  }

  /**
   * Handler for deleting specify song from database
   * @param request request from user (including request paramter and payload)
   * @param h  response to user
   * @returns HTTP response with status success or fail and message
   *
   * @example
   * {
   *  status : success
   *  message : Sucessfully delete song
   * }
   */
  async deleteSong(request, h) {
    const { id } = request.params;
    await this._service.deleteSong(id);

    return h
      .response({
        status: 'success',
        message: 'Successfully delete song',
      })
      .code(200);
  }
}
