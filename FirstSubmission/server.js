import "dotenv/config"
import Hapi from "@hapi/hapi";
import SongPlugin from "./src/api/plugin.js";
import ClientError from "./src/exceptions/clientError.js";
import QueryString from "qs";

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
    query : {
      parser : (query) => QueryString.parse(query)
    }
  });
  
  // Server extenension preResponse
  server.ext('onPreResponse',(request,h)=>{
    const {response} = request;

    if(response instanceof ClientError){
      const newResponse = h.response({
        status : 'fail',
        message : response.message,
      }).code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  })

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
