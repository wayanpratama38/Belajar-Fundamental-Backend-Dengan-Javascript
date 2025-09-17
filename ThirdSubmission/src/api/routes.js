import SongsHandler from './songHandler.js';
import AlbumsHandler from './albumHandler.js';

// Create instance / classes
const albumHandler = new AlbumsHandler();
const songHandler = new SongsHandler();

// Routes function returning all the corresponding method, path and handler
const routes = () => [
  // Albums routes
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: albumHandler.getAlbum,
  },
  {
    method: 'POST',
    path: '/albums',
    handler: albumHandler.addAlbum,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: albumHandler.updateAlbum,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: albumHandler.deleteAlbum,
  },
  {
    method : 'POST',
    path : '/albums/{id}/covers',
    handler : albumHandler.postAlbumCover,
    options : {
      payload : {
        allow : 'multipart/form-data',
        multipart : true,
        output : 'stream',
        maxBytes : 512000
      }
    }
  },
  {
    method : 'POST',
    path : '/albums/{id}/likes',
    handler : albumHandler.postUserLikeAlbumHandler,
    options : {
      auth : 'musicapp_jwt'
    }
  },
  {
    method : 'DELETE',
    path : '/albums/{id}/likes',
    handler : albumHandler.deleteUserLikeAlbumHandler,
    options : {
      auth : 'musicapp_jwt'
    }
  },
  {
    method : 'GET',
    path : '/albums/{id}/likes',
    handler : albumHandler.getUserLikeAlbumHandler,
  },
  // Song routes
  {
    method: 'POST',
    path: '/songs',
    handler: songHandler.postNewSong,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: songHandler.getAllSongs,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: songHandler.getSongById,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: songHandler.updateSong,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: songHandler.deleteSong,
  },
];

export default routes;
