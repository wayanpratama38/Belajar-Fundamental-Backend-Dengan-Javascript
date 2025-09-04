import {Pool} from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/invariantError.js';
import AuthorizationError from '../../exceptions/authorizationError.js';

export default class PlaylistService {
    _pool;

    constructor(){
        this._pool = new Pool();
    }

    async verifyPlaylistOwner(ownerId){
        const query = {
            text : `
                SELECT * FROM playlists WHERE owner = $1
            `,
            values : [ownerId]
        }

        const result = await this._pool.query(query);
        
        if(result.rowCount===0){
            throw new InvariantError('Tidak ditemukan playlistnya');
        }

        const playlist = result.rows[0]

        if(playlist.owner !== ownerId){
            throw new AuthorizationError('Tidak memiliki akses kepada playlist ini!');
        }
    }

    // service for POST/playlists
    async addPlaylist(name,userid){
        const playlistId = `playlist-${nanoid(16)}`
        const query = {
            text : `
                INSERT INTO playlists
                VALUES($1,$2,$3) 
                RETURNING id
            `,
            values : [playlistId,name,userid]
        }
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    // service for GET/playlists
    async getPlaylist(ownerId){
        const query = {
            text : `
                SELECT * from playlists WHERE owner = $1
            `,
            values : [ownerId]
        }
        const result = await this._pool.query(query);
        return result.rows; 
    }

    // service for DELETE/playlists
    async deletePlaylist(playlistId){
        const query = {
            text : `
                DELETE FROM playlists WHERE id = $1
            `,
            values : [playlistId]
        }
        await this._pool.query(query);
    }
}