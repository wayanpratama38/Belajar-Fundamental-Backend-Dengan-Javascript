import route from './route.js';

const AuthenticationPlugin = {
  name: 'authentication',
  version: '1.0.0',
  register: async (server) => {
    server.route(route);
  },
};

export default AuthenticationPlugin;
