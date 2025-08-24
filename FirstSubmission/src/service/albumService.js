import {Pool} from 'pg';
import {nanoid} from "nanoid";
import {mapAlbumDBToModel} from "../utils/utils.js";

export default class AlbumsService {
    _pool;
    
    constructor(){
        this._pool = new Pool();
    }

    async addAlbum(request) {
        const id = nanoid(16);
        const {name, year} = request;
        
        const query = {
            text : `
               INSERT INTO albums
               VALUES($1,$2,$3)
               RETURNING album_id 
            `,
            values : [id,name,year]
        }
        const result = await this._pool.query(query);
        if(!result.rows[0].album_id) {
            throw new InvariantError('Albums gagal ditambahkan');
        }

        return result.rows[0].album_id;
    }

    async getAlbumById(album_id){
        const query = {
            text : `
                SELECT * FROM albums WHERE album_id = $1
            `,
            values : [album_id]
        };
        const result = await this._pool.query(query);
        const pars = result.rows.map(mapAlbumDBToModel)
        
        return pars[0];
    }

    async updateAlbumById(album_id,request){
        const {name, year} = request
        const query = {
            text : `
                UPDATE albums
                SET name=$1, year=$2
                WHERE album_id=$3
            `,
            values : [name,year,album_id]
        }
        await this._pool.query(query);
    }

    async deleteAlbumById(album_id) {
        const query = {
            text : `
                DELETE * FROM albums WHERE album_id = $1
            `,
            values : [album_id]
        }
        await this._pool.query(query)
    }
}