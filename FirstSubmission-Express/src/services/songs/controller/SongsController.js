import InvariantError from "../../../exceptions/InvariantError.js";
import NotFoundError from "../../../exceptions/NotFoundError.js";
import response from "../../../utils/Response.js";
import SongRepositories from "../repositories/SongRepositories.js";

const SongController = {
  // POST
  async postNewSong(req, res, next) {
    const { title, year, performer, genre, duration, albumId } = req.validate;
    const song = await SongRepositories.createNewSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    if (!song) {
      return next(new InvariantError("Lagu gagal ditambahkan"));
    }

    return response(res, 201, "Lagu berhasil ditambahkan", { songId: song.id });
  },

  // GET ALL
  async getAllSongs(req, res, next) {
    const songs = await SongRepositories.getAllSong();
    if (!songs) {
      return next(new NotFoundError("Tidak ada lagu yang ditemukan"));
    }

    return response(res, 200, "Lagu berhasil didapatkan", { songs: songs });
  },

  // GET BY ID
  async getSongById(req, res, next) {
    const { id } = req.params;

    const song = await SongRepositories.getSongById(id);

    if (!song) {
      return next(new NotFoundError("Tidak ada lagu yang ditemukan"));
    }

    return response(res, 200, "Lagu berhasil didapatkan", { song: song });
  },

  // PUT
  async updateSongById(req, res, next) {
    const { id } = req.params;
    const { title, year, performer, genre, duration, albumId } = req.validate;
    const song = await SongRepositories.updateSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });
    if (!song) {
      return next(new NotFoundError("Tidak ada lagu yang ditemukan"));
    }

    return response(res, 200, "Lagu berhasil diperbarui", null);
  },

  // DELETE

  async deleteSongById(req, res, next) {
    const { id } = req.params;
    const song = await SongRepositories.deleteSongById(id);
    if (!song) {
      return next(new NotFoundError("Tidak ada lagu yang ditemukan"));
    }

    return response(res, 200, "Lagu berhasil dihapus", null);
  },
};

export default SongController;
