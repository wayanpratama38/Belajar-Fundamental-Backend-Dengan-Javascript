import AuthorizationError from '../../../exceptions/AuthorizationError.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';
import response from '../../../utils/Response.js';
import PlaylistRepositories from '../../playlists/repositories/PlaylistRepositories.js';
import ExportRepositories from '../repositories/ExportRepositories.js';

const ExportController = {
  // POST export playlist to targeted email
  async exportPlaylist(req, res, next) {
    const { id: playlistId } = req.params;
    const { targetEmail } = req.validate;
    const { userId } = req.user;

    // Check if the playlist avail
    const isPlaylistExists = await PlaylistRepositories.isPlaylistAvailable('', playlistId, '');
    if (!isPlaylistExists) {
      return next(new NotFoundError('Playlist dengan Id tersebut tidak ditemukan'));
    }

    // Check if the playlist exist
    const isPlaylistOwned = await PlaylistRepositories.isPlaylistAvailable('', playlistId, userId);
    if (!isPlaylistOwned) {
      return next(new AuthorizationError('Tidak terauthentikasi'));
    }

    // Send the queue
    await ExportRepositories.exportPlaylist(playlistId, targetEmail);

    return response(res, 201, 'Permintaan Anda sedang kami proses');
  },
};

export default ExportController;
