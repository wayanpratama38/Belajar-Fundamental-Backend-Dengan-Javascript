import {Pool} from 'pg';

export default class PlaylistService {
    _pool;

    constructor(){
        this._pool = new Pool();

        this.getSongInPlaylist = this.getSongInPlaylist.bind(this);
    }

    // service for GET/playlists/{id}/songs
    async getSongInPlaylist(playlistId) {
        
        const query = {
        text: `
            SELECT
            p.id AS playlist_id,
            p.name AS playlist_name,
            p.owner AS playlist_owner,
            u.username,
            s.song_id,
            s.title,
            s.performer
            FROM playlists p
            LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
            LEFT JOIN songs s ON ps.song_id = s.song_id
            LEFT JOIN users u ON p.owner = u.id
            WHERE p.id = $1
                `,
        values: [playlistId],
        };

        const result = await this._pool.query(query);
        const playlist = {
        playlist : {
            id: result.rows[0].playlist_id,
            name: result.rows[0].playlist_name,
            songs: result.rows
                .filter((r) => r.song_id !== null)
                .map((r) => ({
                id: r.song_id,
                title: r.title,
                performer: r.performer,
                })),
            }
        };
        return playlist;
    }
}