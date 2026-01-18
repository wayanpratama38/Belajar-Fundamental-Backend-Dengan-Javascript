import Joi from 'joi';

const PlaylistSchema = {
 createNewPlaylistPayloadSchema : Joi.object({
  name :Joi.string().required()
 }),

 addSongInPlaylistPayloadSchema : Joi.object({
  songId : Joi.string().required()
 }),

 deleteSongInPlaylistPayloadSchema : Joi.object({
  songId : Joi.string().required()
 })
}

export default PlaylistSchema;