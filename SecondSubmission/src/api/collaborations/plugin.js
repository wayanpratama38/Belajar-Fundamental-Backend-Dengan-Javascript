import route from './route.js';

const CollaborationPlugin = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (server) => {
    server.route(route);
  },
};

export default CollaborationPlugin;
