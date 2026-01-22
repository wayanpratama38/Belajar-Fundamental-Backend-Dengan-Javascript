import NotFoundError from '../../../exceptions/NotFoundError.js';
import response from '../../../utils/Response.js';
import CollaborationRepositories from '../repositories/CollaborationRepositories.js';
import UserRepositories from '../../users/repositories/UserRepositories.js';
import PlaylistRepositories from '../../playlists/repositories/PlaylistRepositories.js';
import AuthorizationError from '../../../exceptions/AuthorizationError.js';

const CollaborationController = {

  // POST
  async createNewCollaborator(req, res, next) {
    const { userId: ownerId } = req.user;
    const { playlistId, userId } = req.validate;

    // verify is this playlist exist
    const isPlaylistExist = await PlaylistRepositories.isPlaylistAvailable('', playlistId, '');
    if (!isPlaylistExist) {
      return next(new NotFoundError('Playlist dengan Id tersebut tidakk ditemukan'));
    }

    // verify is this playlist owned by owner id
    const isAuthorize = await PlaylistRepositories.isPlaylistAvailable('', playlistId, ownerId);
    if (!isAuthorize) {
      return next(new AuthorizationError('Tidak berhak untuk mengubah playlist ini'));
    }

    // check if the targeted collaborator exist
    const isUserExist = await UserRepositories.getUserById(userId);
    if (!isUserExist) {
      return next(new NotFoundError('User dengan Id tersebut tidak ditemukan'));
    }

    // add to collaborations table
    const result = await CollaborationRepositories.createNewCollaboration(playlistId, userId);
    return response(res, 201, 'Berhasil menambahkan sebagai collaborator', { collaborationId: result.id });
  },

  // DELETE
  async deleteCollaborator(req, res, next) {
    const { userId: ownerId } = req.user;
    const { playlistId, userId } = req.validate;

    // verify is this playlist exist
    const isPlaylistExist = await PlaylistRepositories.isPlaylistAvailable('', playlistId, '');
    if (!isPlaylistExist) {
      return next(new NotFoundError('Playlist dengan Id tersebut tidakk ditemukan'));
    }

    // verify is this playlist owned by owner id
    const isAuthorize = await PlaylistRepositories.isPlaylistAvailable('', playlistId, ownerId);
    if (!isAuthorize) {
      return next(new AuthorizationError('Tidak berhak untuk mengubah playlist ini'));
    }

    // check if the targeted collaborator exist
    const isUserExist = await UserRepositories.getUserById(userId);
    if (!isUserExist) {
      return next(new NotFoundError('User dengan Id tersebut tidak ditemukan'));
    }

    // check if the targeted collaborator exist in collaboration table
    const isCollaborator = await CollaborationRepositories.verifyCollaborator(playlistId, userId);
    if (!isCollaborator) {
      return next(new NotFoundError('Collaborator tidak ditemukan pada playlist ini'));
    }

    // remove the collaborator from playlist
    await CollaborationRepositories.deleteNewCollaboration(playlistId, userId);
    return response(res, 200, 'Berhasil menghapus collaborator');
  },

};

export default CollaborationController;
