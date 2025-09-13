import 'dotenv/config';
import Hapi from '@hapi/hapi';
import SongPlugin from './src/api/plugin.js';
import ClientError from './src/exceptions/clientError.js';
import QueryString from 'qs';
import UserPlugin from './src/api/users/plugin.js';
import AuthenticationPlugin from './src/api/authentications/plugin.js';
import JWT from '@hapi/jwt';
import PlaylistPlugin from './src/api/playlists/plugin.js';
import CollaborationPlugin from './src/api/collaborations/plugin.js';

// Intialize HTTP server
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    // Using QueryString for getting request.parameter parsed version
    query: {
      parser: (query) => QueryString.parse(query),
    },
  });

  // Server extenension preResponse
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h
        .response({
          status: 'fail',
          message: response.message,
        })
        .code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.register({
    plugin: JWT,
  });

  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload,
      },
    }),
  });

  // Register custom plugin
  await server.register([
    {
      plugin: AuthenticationPlugin,
    },
    {
      plugin: PlaylistPlugin,
    },
    {
      plugin: SongPlugin,
    },
    {
      plugin: UserPlugin,
    },
    {
      plugin: CollaborationPlugin,
    },
  ]);

  // Start server
  await server.start();

  // loggig server url
  console.log(`Server running at ${server.info.uri}`);
};

// Call function
init();
