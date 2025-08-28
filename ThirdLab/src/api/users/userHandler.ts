import type { ResponseObject,Request, ResponseToolkit } from "@hapi/hapi";
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
        this._validator.validatePayload(request.payload as Register);
        const registerInput = request.payload as Register
        const userId = await this._service.addUser(registerInput);
        
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