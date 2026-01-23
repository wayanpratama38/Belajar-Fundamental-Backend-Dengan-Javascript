import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';

export default new (class S3Service {
  constructor() {
    this._S3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.writeFile = this.writeFile.bind(this);
    this.createPreSignedUrl = this.createPreSignedUrl.bind(this);
  }

  async writeFile(file, meta) {
    const paramter = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: meta.fileName,
      Body: file.buffer,
      ContentType: meta.contentType,
    });
    await this._S3.send(paramter);

    return this.createPreSignedUrl({
      bucket: process.env.AWS_BUCKET_NAME,
      key: meta.fileName,
    });
  }

  createPreSignedUrl({ bucket, key }) {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this._S3, command, { expiresIn: 3600 });
  }
})();
