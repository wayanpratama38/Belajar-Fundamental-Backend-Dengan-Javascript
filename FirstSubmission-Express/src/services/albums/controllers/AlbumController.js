import response from '../../../utils/Response.js';
import AlbumRepositories from '../repositories/AlbumRepositories.js';
import InvariantError from '../../../exceptions/InvariantError.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';

const AlbumController = {
  // POST /albums
  async postNewAlbum(req, res, next) {
    const { name, year } = req.validate;
    const album = await AlbumRepositories.createNewAlbum({
      name,
      year,
    });

    if (!album) {
      return next(new InvariantError('Album gagal ditambahkan'));
    }

    return response(res, 201, 'Album berhasil ditambahkan', {
      albumId: album.id,
    });
  },

  // GET /albums/:id
  async getAlbumById(req, res, next) {
    const { id } = req.params;
    const album = await AlbumRepositories.getAlbumById(id);

    if (!album) {
      return next(new NotFoundError('Album tidak ditemukan'));
    }

    return response(res, 200, 'Album berhasil didapatkan', { album });
  },

  // PUT /albums/:id

  async updateAlbumById(req, res, next) {
    const { id } = req.params;
    const { name, year } = req.validate;

    const album = await AlbumRepositories.updateAlbumById(id, { name, year });

    if (!album) {
      return next(new NotFoundError('Album tidak ditemukan'));
    }

    return response(res, 200, 'Album berhasil diperbarui', album);
  },

  // DELETE /albums/:id

  async deleteAlbumById(req, res, next) {
    const { id } = req.params;
    const album = await AlbumRepositories.deleteAlbumById(id);
    if (!album) {
      return next(new NotFoundError('Album tidak ditemukan'));
    }

    return response(res, 200, 'Album berhasil dihapuskan', album);
  },
};

export default AlbumController;
