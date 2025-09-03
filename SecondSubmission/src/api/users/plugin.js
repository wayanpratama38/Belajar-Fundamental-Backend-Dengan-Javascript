import { route } from "./route.js"

const UserPlugin = {
    name : 'users',
    version : '1.0.0',
    register : async(server) => {
        server.route(route())
    },
}

export default UserPlugin;