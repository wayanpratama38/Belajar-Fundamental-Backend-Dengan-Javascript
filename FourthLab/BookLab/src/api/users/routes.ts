import type { ServerRoute } from "@hapi/hapi";
import type { UsersHandler } from "./userHandler";

export const routes = (handler : UsersHandler) : ServerRoute[] => [
    {
        method : "POST",
        path : "/users",
        handler : handler.postUserHandler
    },
    {
        method : "GET",
        path : "/users/{id}",
        handler : handler.getUserByIdHandler
    }
]