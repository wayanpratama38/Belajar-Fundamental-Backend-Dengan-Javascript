import routes from "./routes.js"

const SongPlugin = {
    name : 'songs',
    version : '1.0.0',
    register : async (server) => { 
        server.route(routes());
    }
}

export default SongPlugin;