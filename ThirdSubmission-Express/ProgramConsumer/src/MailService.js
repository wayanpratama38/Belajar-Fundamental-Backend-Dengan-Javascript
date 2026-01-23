import nodemailer from 'nodemailer';

export default class MailService{
 constructor(){
  this._transporter = nodemailer.createTransport({
   host : process.env.SMTP_HOST,
   port : process.env.SMTP_PORT,
   auth : {
    user : process.env.SMTP_USER,
    pass : process.env.SMTP_PASSWORD,
   }
  })

  this.sendEmail = this.sendEmail.bind(this);
 }

 sendEmail(targetEmail,content){
  const message = {
    from: 'Music Apps',
    to: targetEmail,
    subject: 'Export Playlist',
    text: 'Terlampir hasil dari ekspor playlist',
    attachments: [
      {
        filename: 'playlist.json',
        content : JSON.stringify(content,null,2),
      },
    ],
  }

  return this._transporter.sendMail(message);
 }
}