import type { Plugin } from "@hapi/hapi";
import type AuthenticationsService from "../../services/postgres/authenticationsService";
import type { IAuthenticationValidator, ITokenManager } from "./authenticationHandler";
import type UsersService from "../../services/postgres/usersService";
import AuthenticationHandler from "./authenticationHandler";
import { routes } from "./routes";

interface AuthencticationOption {
    authService : AuthenticationsService,
    validator : IAuthenticationValidator,
    tokenManager : ITokenManager,
    userService : UsersService
}

export const authenticationPlugin : Plugin<AuthencticationOption> = {
    name : 'authentication',
    version : '1.0.0',
    register : async(server,{authService, validator, tokenManager, userService} : AuthencticationOption) => {
        const authenticationHandler = new AuthenticationHandler(authService,userService,validator,tokenManager)
        server.route(routes(authenticationHandler))
    }
}