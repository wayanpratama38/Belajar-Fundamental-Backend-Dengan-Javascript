import type { ServerRoute } from "@hapi/hapi";
import type { UserHandler } from "../../interface/handlerInterface";

export const routes = (handler : UserHandler) : ServerRoute[] => [
    {
        method : "POST",
        path : "/users",
        handler : handler.postUserHandler
    },
    {
        method : "GET",
        path : "/users/{id}",
        handler : handler.getUserById
    }
]