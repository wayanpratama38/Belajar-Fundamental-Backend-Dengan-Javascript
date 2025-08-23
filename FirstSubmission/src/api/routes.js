import SongsHandler from "./songHandler.js"
import AlbumsHandler from "./albumHandler.js"
const albumHandler = new AlbumsHandler();
const songHandler = new SongsHandler();

const routes = () => [
    // Handler for albums
    {
        method : "GET",
        path : "/albums/{id}",
        handler : albumHandler.getAlbum
    },
    {
        method : "POST",
        path : "/albums",
        handler : albumHandler.addAlbum
    },
    {
        method : "PUT",
        path : "/albums/{id}",
        handler : albumHandler.updateAlbum
    },
    {
        method : "DELETE",
        path : "/albums/{id}",
        handler : albumHandler.deleteAlbum
    },
    // Handler for songs
    {
        method : "POST",
        path : "/songs",
        handler : songHandler.postNewSong
    },
    {
        method : "GET",
        path : "/songs",
        handler : songHandler.getAllSongs
    },
    {
        method : "GET",
        path : "/songs/{id}",
        handler : songHandler.getSongById
    },
    {
        method : "PUT",
        path : "/songs/{id}",
        handler : songHandler.updateSong
    },    
    {
        method : "DELETE",
        path : "/songs/{id}",
        handler : songHandler.deleteSong
    }
]
    

export default routes;