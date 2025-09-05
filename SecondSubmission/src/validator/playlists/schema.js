import Joi from 'joi';

export const postPlaylistSchema = Joi.object({
    name : Joi.string().required()
})

export const postSongIntoPlaylist = Joi.object({
    songId : Joi.string().required()
})