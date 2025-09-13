import type { Request ,ResponseObject, ResponseToolkit } from "@hapi/hapi";

export default class ExportHandler {
   _validator : any;
   _service : any;

    constructor(validator : any,service : any) {
        this._validator = validator;
        this._service = service;

        this.postExportHandler = this.postExportHandler.bind(this);
    }

    async postExportHandler(request : Request, h : ResponseToolkit) : Promise<ResponseObject> {
        this._validator.validateExportBookPayload(request.payload)

        const message = {
            userId : request.auth.credentials.id,
            targetEmail : request.payload
        }

        await this._service.sendMessage('export:book',JSON.stringify(message));

        return h.response({
            status : 'success',
            message : 'Permintaan sedang diproses'
        }).code(201)
    };

}