import type { Lifecycle } from "@hapi/hapi";

export interface BookHandler { 
    postBookHandler : Lifecycle.Method;
    getBooksHandler: Lifecycle.Method;
    getBookByIdHandler: Lifecycle.Method;
    putBookByIdHandler: Lifecycle.Method;
    deleteBookByIdHandler: Lifecycle.Method;
}

export interface UserHandler {
    postUserHandler : Lifecycle.Method;
    getUserByIdHandler : Lifecycle.Method;
}