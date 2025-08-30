import type { ServerRoute } from "@hapi/hapi";
import type { AuthenticationHandler } from "../../interface/handlerInterface";

const routes = (handler : AuthenticationHandler ) : ServerRoute[] => [
    {
        method : "POST",
        path : "/authentications",
        handler : handler.postAuthenticationHandler
    },
    {
        method : "PUT",
        path : "/authentications",
        handler : handler.putAuthenticationHandler
    },
    {
        method : "DELETE",
        path : "/authentications",
        handler : handler.deleteAuthenticationHandler
    },

]