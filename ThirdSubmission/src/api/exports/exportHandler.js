import  { ExportService }  from "../../service/exports/exportService.js";
import PlaylistService from "../../service/playlists/playlistService.js";
import { payloadToStringConverter } from "../../utils/utils.js";
import { ExportValidator } from "../../validator/exports/validator.js";


export default class ExportHandler { 
    _service;
    _playlistService;
    _validator;

    constructor(){
        this._service =  ExportService;
        this._playlistService = new PlaylistService();
        this._validator = ExportValidator;

        this.postExportHandler = this.postExportHandler.bind(this);
    }

    // POST /exports/playlist/{id}
    async postExportHandler(request,h){
        this._validator.validatePostExportPayload(request.payload);

        // Check if this user own this playlist or not
        const { id  } = request.auth.credentials;
        const userId = payloadToStringConverter(id);
        const  {id : playlistId }  = request.params;
        await this._playlistService.verifyPlaylistAccess(playlistId,userId);
        // create message and send mail
        const message = {
            playlistId : playlistId,
            targetEmail : request.payload.targetEmail
        };
        await this._service.sendMessage('export:playlist',JSON.stringify(message));

        return h.response({
            status : 'success',
            message : 'Permintaan Anda sedang kami proses'
        }).code(201)
    }
}
