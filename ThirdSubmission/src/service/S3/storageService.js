import * as client from '@aws-sdk/client-s3';
import * as url from '@aws-sdk/s3-request-presigner';

export default class StorageService { 
    _s3;

    constructor(){
        this._s3 = new client.S3Client({
            region : process.env.AWS_REGION,
            credentials : {
                secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
                accessKeyId : process.env.AWS_ACCESS_KEY_ID
            }
        });
    }


    async writeFile(file,meta){
        const parameter = new client.PutObjectCommand({
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : meta.filename,
            Body : file._data,
            ContentType : meta.headers['content-type']
        });


        await this._s3.send(parameter);
    
        return this.createSignedUrl({
            bucket : process.env.AWS_BUCKET_NAME,
            key : meta.filename
        });
    }

    createSignedUrl({bucket,key}){
        const command = new client.GetObjectCommand({ Bucket : bucket, Key : key});
        return url.getSignedUrl(this._s3, command, { expiresIn : 3600 });
    }
}