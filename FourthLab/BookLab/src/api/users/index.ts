import type { UsersValidatorInterface } from "../../interface/interface"
import type UsersService from "../../services/postgres/usersService"
import { Server, type Plugin } from "@hapi/hapi"
import { UsersHandler } from "./userHandler"
import { routes } from "./routes"

interface UserPluginOptions {
    service : UsersService,
    validator : UsersValidatorInterface
}

const userPlugin : Plugin<UserPluginOptions> = {
    name : 'users',
    version : '1.0.0',
    register : async (server : Server, { service, validator }: UserPluginOptions) => {
        const userHandler = new UsersHandler(service,validator);
        server.route(routes(userHandler));
    }
}

export { userPlugin };