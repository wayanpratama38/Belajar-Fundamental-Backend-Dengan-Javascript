import "dotenv/config"
import Hapi from "@hapi/hapi";
import SongPlugin from "./src/api/plugin.js";

// Intialize HTTP server
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    }
  });

  // Register custom plugin
  await server.register({
    plugin : SongPlugin
  })

  // Start server
  await server.start();

  // loggig server url
  console.log(`Server running at ${server.info.uri}`);
}

// Call function
init();
