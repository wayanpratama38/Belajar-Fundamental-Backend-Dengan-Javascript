// Function for mapping album table to model (album service)
export const mapAlbumDBToModel = ({
    album_id,
    name,
    year
}) => ({
    id : album_id,
    name,
    year
})

// Function for mapping song table to model (song service)
export const mapSongDBToModel = ({
    song_id,
    title,
    year,
    genre,
    perfomer,
    duration,
    albumId
}) => ({
    id : song_id,
    title,
    year,
    genre,
    perfomer,
    duration,
    albumId
})