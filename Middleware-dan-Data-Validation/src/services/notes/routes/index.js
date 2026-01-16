import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  editNoteById,
  deleteNoteById
} from '../controller/note-controller.js';
import validate from '../../../middlewares/validate.js';
import { notePayloadSchema, noteUpdatePayload } from '../validator/schema.js';

const notes = Router();

notes.post('/notes', validate(notePayloadSchema), createNote);
notes.get('/notes', getNotes);
notes.get('/notes/:id', getNoteById);
notes.put('/notes/:id', validate(noteUpdatePayload), editNoteById);
notes.delete('/notes/:id', deleteNoteById);

export default notes;
