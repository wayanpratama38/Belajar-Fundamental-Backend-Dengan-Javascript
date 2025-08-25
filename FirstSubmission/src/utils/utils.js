// Function for mapping album table to model (album service)
/**
 * Function for mapping albums table (database) to model (album service)
 * @param {*} param {album_id,name,year} - from database
 * @returns return {id : album_id, name, year} - to object, for model usage
 */
export const mapAlbumDBToModel = ({ album_id, name, year }) => ({
  id: album_id,
  name,
  year,
});

/**
 * Function for mapping songs table (database) to model (songs service)
 * @param {*} param {song_id, title, year, genre, performer, duration, albumId} - from database
 * @returns return {id : song_id, title, year, genre, performer, duration, albumId} - to object, for model usage
 */
export const mapSongDBToModel = ({
  song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id: song_id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});
