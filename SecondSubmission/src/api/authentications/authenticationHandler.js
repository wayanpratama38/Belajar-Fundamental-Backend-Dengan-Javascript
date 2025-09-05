import AuthenticationService from "../../service/authentications/authenticationService.js";
import UserService from "../../service/userService.js";
import { tokenManager } from "../../tokenize/tokenManager.js";
import { AuthenticationValidator } from "../../validator/authentications/validator.js";


export default class AuthenticationHandler {
    _authService;
    _userService;
    _tokenManager;
    _validator;

    constructor(){
        this._authService = new AuthenticationService();
        this._userService = new UserService();
        this._tokenManager = tokenManager;
        this._validator = AuthenticationValidator;

        this.postAuthentication = this.postAuthentication.bind(this);
        this.putAuthentication = this.putAuthentication.bind(this);
        this.deleteAuthentication = this.deleteAuthentication.bind(this);
        
    }

    // post
    async postAuthentication(request,h){
        // validate
        this._validator.validatePostAuthentication(request.payload);

        //verify user
        const {username,password} = request.payload;
        const id = await this._userService.verifyUserCredential(username,password);
        
        // generate token
        const accessToken = this._tokenManager.generateToken(id);
        const refreshToken = this._tokenManager.generateRefreshToken(id);
        
        // add refresh token into database
        await this._authService.addToken(refreshToken);

        return h.response({
            status : 'success',
            data : {
                accessToken,
                refreshToken
            }
        }).code(201)
    }

    // put 
    async putAuthentication(request,h){
        // validate
        this._validator.validatePutAuthentication(request.payload);

        const {refreshToken} = request.payload;
        await this._authService.verifyToken(refreshToken);

        // verify using token manager, if signature verified 
        // then generate access token again
        const id = this._tokenManager.verifyRefreshToken(refreshToken);
        const accessToken = this._tokenManager.generateToken(id);

        return h.response({
            status : 'success',
            data : {
                accessToken
            }
        }).code(200)
    }
    
    //delete
    async deleteAuthentication(request,h){
        // validate
        this._validator.validateDeleteAuthentication(request.payload);

        const {refreshToken} = request.payload;
        await this._authService.verifyToken(refreshToken);
        await this._authService.deleteToken(refreshToken);
        
        return h.response({
            status : 'success',
            message : 'berhasil hapus token authentikasi'
        }).code(200)
    }
}