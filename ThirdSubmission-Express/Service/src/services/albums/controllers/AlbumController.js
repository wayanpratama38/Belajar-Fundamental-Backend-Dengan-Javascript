import response from '../../../utils/Response.js';
import AlbumRepositories from '../repositories/AlbumRepositories.js';
import InvariantError from '../../../exceptions/InvariantError.js';
import NotFoundError from '../../../exceptions/NotFoundError.js';
import FileTooLarge from '../../../exceptions/FileTooLarge.js';
import RedisService from '../../cache/RedisService.js';

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

  // POST /albums/:id/covers
  async addAlbumCover(req, res, next) {
    const { id: albumId } = req.params;

    // Check if the album exist
    const isAlbumExist = await AlbumRepositories.verifyAlbumExistence(albumId);
    if (!isAlbumExist) {
      return next(new NotFoundError('Tidak ditemukan album dengan id tersebut'));
    }

    if (!req.file) {
      return next(new InvariantError('No File uploaded'));
    }

    await AlbumRepositories.addAlbumCover(req.file, albumId);

    return response(res, 201, 'Sampul berhasil diunggah');
  },

  // POST /albums/:id/likes
  async likeAlbum(req, res, next) {
    const { id: albumId } = req.params;
    const { userId } = req.user;

    // Check if the album exist
    const isAlbumExist = await AlbumRepositories.verifyAlbumExistence(albumId);
    if (!isAlbumExist) {
      return next(new NotFoundError('Tidak ditemukan album dengan id tersebut'));
    }

    // Verify if already like album or not
    const isAlbumLiked = await AlbumRepositories.verifyAlreadyLike(albumId, userId);
    if (isAlbumLiked) {
      return next(new InvariantError('Like hanya bisa dilakukan satu kali'));
    }

    await AlbumRepositories.addLikeToAlbum(albumId, userId);
    return response(res, 201, 'Berhasil like album');
  },

  // DELETE /albums/:id/likes
  async deleteLike(req, res, next) {
    const { id: albumId } = req.params;
    const { userId } = req.user;

    // Check if the album exist
    const isAlbumExist = await AlbumRepositories.verifyAlbumExistence(albumId);
    if (!isAlbumExist) {
      return next(new NotFoundError('Tidak ditemukan album dengan id tersebut'));
    }

    // Verify if already like album or not
    const isAlbumLiked = await AlbumRepositories.verifyAlreadyLike(albumId, userId);
    if (!isAlbumLiked) {
      return next(new InvariantError('Delete like hanya bisa dilakukan ketika sudah like satu kali'));
    }

    await AlbumRepositories.deleteLikeToAlbum(albumId, userId);
    return response(res, 200, 'Berhasil delete like album');
  },

  // GET /albums/:id/likes
  async getLike(req, res, next) {
    const { id: albumId } = req.params;

    // Check if the album exist
    const isAlbumExist = await AlbumRepositories.verifyAlbumExistence(albumId);
    if (!isAlbumExist) {
      return next(new NotFoundError('Tidak ditemukan album dengan id tersebut'));
    }

    // validate if cache already have or not
    const cache = await RedisService.get(`albumLikes:${albumId}`);
    if (cache) {
      res.set('X-Data-Source', 'cache');
      return response(res, 200, 'Berhasil mednapatkan like album dari cache', { likes: Number(cache) });
    }

    const result = await AlbumRepositories.getAlbumLikeNumber(albumId);
    res.set('X-Data-Source', 'Database');
    // Save to Cache
    RedisService.set(`albumLikes:${albumId}`, JSON.stringify(result));
    return response(res, 200, 'Berhasil mendapatkan like album', { likes: result });
  },

};

export default AlbumController;
