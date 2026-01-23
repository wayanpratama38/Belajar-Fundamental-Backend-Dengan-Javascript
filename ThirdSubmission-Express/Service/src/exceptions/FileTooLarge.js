import ClientError from './ClientError.js';

export default class FileTooLarge extends ClientError {
  constructor(message) {
    super(message);
    this.statusCode = 413;
    this.name = 'FILETOOLARGE';
  }
}
