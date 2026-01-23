import multer from 'multer';
import InvariantError from '../../exceptions/InvariantError.js';

const Upload = multer({
  limits: {
    fileSize: 512000,
  },
  // eslint-disable-next-line consistent-return
  fileFilter(req, file, cb) {
    if (!file.mimetype.match(/^image\//)) {
      return cb(new InvariantError('File harus berupa gambar'), false);
    }
    cb(null, true);
  },
});

export default Upload;
