import UserHandler from './userHandler.js';

const userHandler = new UserHandler();

export const route = () => [
  {
    method: 'POST',
    path: '/users',
    handler: userHandler.addUser,
  },
];
