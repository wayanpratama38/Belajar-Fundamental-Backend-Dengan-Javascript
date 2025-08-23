import SongsHandler from "./songHandler.js"
import AlbumsHandler from "./albumHandler.js"

const routes = () => [
    // Handler for albums
    {
        method : "GET",
        path : "/albums/{id}",
        handler : AlbumsHandler.getAlbum()
    },
    {
        method : "POST",
        path : "/albums",
        handler : AlbumsHandler.addAlbum()
    },
    {
        method : "PUT",
        path : "/albums/{id}",
        handler : AlbumsHandler.updateAlbum()
    },
    {
        method : "DELETE",
        path : "/albums/{id}",
        handler : AlbumsHandler.deleteAlbum()
    },
    // Handler for songs
    {
        method : "POST",
        path : "/songs",
        handler : SongsHandler.postNewSong
    },
    {
        method : "GET",
        path : "/songs",
        handler : SongsHandler.getAllSongs
    },
    {
        method : "GET",
        path : "/songs/{id}",
        handler : SongsHandler.getSongById
    },
    {
        method : "PUT",
        path : "/songs/{id}",
        handler : SongsHandler.updateSong
    },    
    {
        method : "DELETE",
        path : "/songs/{id}",
        handler : SongsHandler.deleteSong
    }
]
    

export default routes;