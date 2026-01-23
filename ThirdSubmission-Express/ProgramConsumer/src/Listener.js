export default class Listener{
 constructor(PlaylistService, MailService){
  this._playlistService = PlaylistService;
  this._mailService = MailService
  
  this.listen = this.listen.bind(this);
 }

 async listen(message){
  try {
   const {playlistId, targetEmail} = JSON.parse(message.content.toString());

   const playlist = await this._playlistService.getPlaylist(playlistId);
   const result = await this._mailService.sendEmail(targetEmail,playlist);
   console.log(result)
  } catch (err) {
   console.error(err)
  }
 }
 
}