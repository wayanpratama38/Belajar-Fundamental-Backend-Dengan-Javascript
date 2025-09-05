import PlaylistHandler from "./playlistHandler.js"


const playlistHandler = new PlaylistHandler();

const route = [
    {
        method : "POST",
        path : "/playlists",
        handler : playlistHandler.postNewPlaylist,
        options : {
            auth : 'musicapp_jwt'
        }
    },
    {
        method : 'GET',
        path : '/playlists',
        handler : playlistHandler.getPlaylists,
        options : {
            auth : 'musicapp_jwt'
        }
    },
    {
        method : "DELETE",
        path : '/playlists/{id}',
        handler : playlistHandler.deletePlaylist,
        options : {
            auth : 'musicapp_jwt'
        }
    },
    {
        method : "POST",
        path : '/playlists/{id}/songs',
        handler : playlistHandler.postSongIntoPlaylist,
        options : {
            auth : 'musicapp_jwt'
        }
    },
    {
        method : "GET",
        path : '/playlists/{id}/songs',
        handler : playlistHandler.getAllSongInPlaylist,
        options : {
            auth : 'musicapp_jwt'
        }
    },
    {
        method : "DELETE",
        path : '/playlists/{id}/songs',
        handler : playlistHandler.deleteSongInPlaylist,
        options : {
            auth : 'musicapp_jwt'
        }
    },
]

export default route;