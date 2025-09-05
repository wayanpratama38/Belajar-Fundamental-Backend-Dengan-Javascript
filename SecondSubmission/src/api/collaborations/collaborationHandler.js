import CollaborationService from "../../service/collaborations/collaborationService.js";



export default class CollaborationHandler{
    _service;
    // validator;

    constructor(){
        this._service = new CollaborationService();
        this.deleteCollaboration = this.deleteCollaboration.bind(this);
        this.postCollaboration = this.postCollaboration.bind(this);
    }

    // POST /collaborations
    async postCollaboration(request,h){
        const {userId,playlistId} = request.payload
        const result = this._service.postCollaborationService(playlistId,userId);
        return h,response({
            status : `success`,
            data : {
                collaborationId: result
            }
        }).code(201)
    }

    // DELETE /collaborations
    async deleteCollaboration(request,h){
        const {playlistId,userId} = request.payload
        await this._service.deleteCollaborationService(playlistId,userId);
        return h.response({
            status : `success`,
            message : `Menghapus akses kolaborasi`
        }).code(200)
    }
}
