import routes from "./routes.js"

// Initiate new plugin
const SongPlugin = {
    name : 'songs',
    version : '1.0.0',
    register : async (server) => { 
        server.route(routes());
    }
}

export default SongPlugin;