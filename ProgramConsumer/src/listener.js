import EmailService from "./emailService.js";
import PlaylistService from "./playlistService.js";


export default class Listener {
    _emailService;
    _playlistService;

    constructor(){
        this._emailService = new EmailService();
        this._playlistService = new PlaylistService();
    }

    async listen(message){
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());
            const playlistResult = await this._playlistService.getSongInPlaylist(playlistId);
            const emailResult = await this._emailService.sendMail(targetEmail,JSON.stringify(playlistResult));
            console.log(emailResult); 
        } catch (error) {
            console.log(error);
        }
    }

}