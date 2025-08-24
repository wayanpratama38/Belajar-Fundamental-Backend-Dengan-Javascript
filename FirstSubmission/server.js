import "dotenv/config"
import Hapi from "@hapi/hapi";
import SongPlugin from "./src/api/plugin.js";


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

  await server.register({
    plugin : SongPlugin
  })

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
}
init();
