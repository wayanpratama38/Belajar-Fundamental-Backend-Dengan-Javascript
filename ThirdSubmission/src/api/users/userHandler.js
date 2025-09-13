import UserService from '../../service/userService.js';
import { UserValidator } from '../../validator/users/validator.js';

export default class UserHandler {
  _service;
  _validator;

  constructor() {
    this._service = new UserService();
    this._validator = UserValidator;
    this.addUser = this.addUser.bind(this);
  }

  async addUser(request, h) {
    // validate
    this._validator.validateRegisterPayload(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser(username, password, fullname);

    return h
      .response({
        status: 'success',
        data: {
          userId: userId,
        },
      })
      .code(201);
  }
}
