import route from './route.js';

const PlaylistPlugin = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server) => {
    server.route(route);
  },
};

export default PlaylistPlugin;