import SongsHandler from "./handler.js"
const handlerInstance = new SongsHandler()
const routes = (handler = handlerInstance ) => [
    {
        method : "POST",
        path : "/songs",
        handler : handler.postNewSong
    },
    {
        method : "GET",
        path : "/songs",
        handler : handler.getAllSongs
    },
    {
        method : "GET",
        path : "/songs/{id}",
        handler : handler.getSongById
    },
    {
        method : "PUT",
        path : "/songs/{id}",
        handler : handler.updateSong
    },    
    {
        method : "DELETE",
        path : "/songs/{id}",
        handler : handler.deleteSong
    }
]
    

export default routes;