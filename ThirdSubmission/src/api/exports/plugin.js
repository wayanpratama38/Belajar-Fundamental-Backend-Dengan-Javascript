import { route } from "./route.js"


const ExportPlugin = {
    name : 'export',
    version : '1.0.0',
    register : async(server) => {
        server.route(route)
    }
}

export default ExportPlugin;