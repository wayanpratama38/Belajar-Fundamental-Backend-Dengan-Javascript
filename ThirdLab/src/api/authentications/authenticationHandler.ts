import AuthenticationsService from "../../services/postgres/authenticationsService";
import type UsersService from "../../services/postgres/usersService";
import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import type { Authentication } from "../../interface/authenticationsInterface";
import type { HapiJwt } from "@hapi/jwt";


interface IAuthenticationValidator{
    validatePostAuthentication : (payload : Authentication) => void,
    validatePutAuthentication : (payload : string) => void,
    validateDeleteAuthentication : (payload : string) => void
}

interface ITokenManager { 
    generateAccessToken : (payload : HapiJwt.Payload) => string,
    generateRefreshToken : (payload : HapiJwt.Payload) => string,
    verifyRefreshToken : (refreshToken : string) => any,
}

export default class AuthenticationHandler { 
    _authService : AuthenticationsService;
    _userService : UsersService;
    _validator : IAuthenticationValidator;
    _tokenManager : ITokenManager;

    constructor (authService : AuthenticationsService, userService : UsersService, validator : IAuthenticationValidator, tokenManager : ITokenManager){
        this._authService = authService;
        this._userService = userService;
        this._validator = validator;
        this._tokenManager = tokenManager;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);

    }

    async postAuthenticationHandler(request : Request, h : ResponseToolkit) : Promise<ResponseObject> { 
        this._validator.validatePostAuthentication(request.payload as Authentication);

        const { password, username } = request.payload as Authentication;
        const id = await this._userService.verifyUserCredentials(username,password);

        const accessToken = this._tokenManager.generateAccessToken({id});
        const refreshToken = this._tokenManager.generateRefreshToken({id});

        this._authService.addRefreshToken(refreshToken);
        return h.response({
            status : 'success',
            message : 'Authentication berhasil dilakukan',
            data : {
                accessToken,
                refreshToken
            }
        }).code(201);
    }
    
    async putAuthenticationHandler(request : Request, h : ResponseToolkit) : Promise<ResponseObject> {
        this._validator.validatePutAuthentication(request.payload as string)
        
        const {refreshToken} = request.payload as any;
        const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({id});
        return h.response({
            status : 'success',
            message : 'Access token berhasil diperbarui',
            data : {
                accessToken
            }
        }).code(200)
    }

    async deleteAuthenticationHandler(request : Request, h : ResponseToolkit) : Promise<ResponseObject> {
        this._validator.validateDeleteAuthentication(request.payload as string);

        const {refreshToken} = request.payload as any;
        await this._authService.verifyRefreshToken(refreshToken);
        await this._authService.deleteRefreshToken(refreshToken);
        return h.response({
            status : 'success',
            message : 'Refresh token berhasil dihapus'
        }).code(200)
    }
}