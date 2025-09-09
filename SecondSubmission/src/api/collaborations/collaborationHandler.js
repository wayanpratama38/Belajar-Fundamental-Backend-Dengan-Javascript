import CollaborationService from '../../service/collaborations/collaborationService.js';
import PlaylistService from '../../service/playlists/playlistService.js';
import UserService from '../../service/userService.js';
import { payloadToStringConverter } from '../../utils/utils.js';

export default class CollaborationHandler {
  _service;
  _userService;
  _playlistService;

  constructor() {
    this._service = new CollaborationService();
    this._userService = new UserService();
    this._playlistService = new PlaylistService();
    this.deleteCollaboration = this.deleteCollaboration.bind(this);
    this.postCollaboration = this.postCollaboration.bind(this);
  }

  // POST /collaborations
  async postCollaboration(request, h) {
    const { userId, playlistId } = request.payload;
    const { id } = request.auth.credentials;
    const ownerId = payloadToStringConverter(id);
    await this._userService.verifyUserId(userId);
    await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
    const result = await this._service.postCollaborationService(
      playlistId,
      userId,
    );
    return h
      .response({
        status: `success`,
        data: {
          collaborationId: result,
        },
      })
      .code(201);
  }

  // DELETE /collaborations
  async deleteCollaboration(request, h) {
    const { playlistId, userId } = request.payload;
    const { id } = request.auth.credentials;
    const userCredential = payloadToStringConverter(id);
    await this._service.deleteCollaborationService(
      playlistId,
      userId,
      userCredential,
    );
    return h
      .response({
        status: `success`,
        message: `Menghapus akses kolaborasi`,
      })
      .code(200);
  }
}
