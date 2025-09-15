import * as nodemailer from "nodemailer";

export default class EmailService { 
    _transpoter;

    constructor (){
        this._transpoter = nodemailer.createTransport({
            host : process.env.SMTP_HOST,
            port : process.env.SMTP_POST,
            auth : {
                user : process.env.SMTP_USER,
                pass : process.env.SMTP_PASSWORD
            }
        })
    }

    async sendMail(targetEmail,content){
        const message = {
            from : 'Music App',
            to : targetEmail,
            subject : 'Ekspor Playlist',
            text : 'Terlampir hasil ekspor dari playlist',
            attachment : [
                {
                    filename : 'playlist.json',
                    content
                }
            ]
        }
        return this._transpoter.sendMail(message);
    }
}