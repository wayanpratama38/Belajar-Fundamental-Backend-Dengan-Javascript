import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import type { UsersValidatorInterface } from "../../interface/interface";
import type UsersService from "../../services/postgres/usersService";
import type { Register } from "../../interface/booksInterface";


export class UsersHandler { 
    _service : UsersService;
    _validator : UsersValidatorInterface;

    constructor(service : UsersService, validator : UsersValidatorInterface ) {
        this._service  = service;
        this._validator = validator;

        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    }

    async postUserHandler(request : Request, h : ResponseToolkit) : Promise<ResponseObject>  {
        console.log("TEST POST /users HANDLER")
        const payload = request.payload as Register;
        // const {username,password,fullname} = payload;
        // this._validator.validatePayload(payload);
        console.log(payload);
        const userId = await this._service.addUser(payload);
        
        return h.response({
            status : 'success',
            message : 'User berhasil ditambahkan',
            data : {
                userId 
            }                
        }).code(201);
    }

    async getUserByIdHandler(request : Request, h : ResponseToolkit) : Promise<ResponseObject> {
        const { id } = request.params;
        const user = await this._service.getUserById(id);
        return h.response({
            status : 'success',
            message : 'Berhasil mendapatkan user',
            data : {
                user
            }
        }).code(200);
    }
}