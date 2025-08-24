import {Pool} from 'pg';
import {nanoid} from "nanoid";
import {mapAlbumDBToModel} from "../utils/utils.js";

export default class AlbumsService {
    // Private variable
    _pool;
    
    constructor(){
        this._pool = new Pool();
    }

    /**
     * Service function for adding new album into database
     * @param request request payload (body) 
     * @returns album_id 
     */
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
        // TODO : ADD ERROR HANDLING

        return result.rows[0].album_id;
    }

    /**
     * Service function to get specify album information
     * @param album_id request paramater  
     * @returns album detail information
     */
    async getAlbumById(album_id){
        const query = {
            text : `
                SELECT * FROM albums WHERE album_id = $1
            `,
            values : [album_id]
        };
        const result = await this._pool.query(query);
        const album = result.rows.map(mapAlbumDBToModel)
        // TODO : ADD ERROR HANDLING
        return album[0];
    }

    /**
     * Service function for updating album information using album_id and request payload as a function parameter
     * @param album_id request paramater  
     * @param request request payload (body)
     */
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
        // TODO : ADD ERROR HANDLING
        await this._pool.query(query);
    }

    /**
     * Service function for deleting specify album using album_id as a function parameter
     * @param album_id request parameter 
     */
    async deleteAlbumById(album_id) {
        const query = {
            text : `
                DELETE * FROM albums WHERE album_id = $1
            `,
            values : [album_id]
        }
        // TODO : ADD ERROR HANDLING
        await this._pool.query(query)
    }
}