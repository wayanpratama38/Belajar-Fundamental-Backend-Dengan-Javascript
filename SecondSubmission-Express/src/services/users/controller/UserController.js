import InvariantError from '../../../exceptions/InvariantError.js';
import response from '../../../utils/Response.js';
import UserRepositories from '../repositories/UserRepositories.js';

const UserController = {
  // POST
  async postNewUser(req, res, next) {
    const { username, password, fullname } = req.validate;

    const isUsernameAvailable = await UserRepositories.isUsernameAvailable(username);
    if (!isUsernameAvailable) {
      return next(new InvariantError('Gagal menambahkan user, karena username sudah ada'));
    }

    const result = await UserRepositories.createNewUser({ username, password, fullname });
    if (!result) {
      return next(new InvariantError('User gagal ditambahkan'));
    }

    return response(res, 201, 'Berhasil menambahkan user baru', { userId: result.id });
  },
};

export default UserController;
