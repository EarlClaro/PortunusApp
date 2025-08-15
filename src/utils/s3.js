import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

export async function putBuffer({ Bucket, Key, Body, ContentType }) {
  const bodyStream = Body instanceof Buffer ? Readable.from(Body) : Body; // accepts Buffer or stream
  await s3.send(new PutObjectCommand({ Bucket, Key, Body: bodyStream, ContentType }));
  return { bucket: Bucket, key: Key };
}

export function s3PublicUrl(key) {
  // For MinIO dev or public-read buckets; otherwise, sign URLs
  const base = process.env.S3_ENDPOINT?.replace(/\/+$/, '');
  const bucket = process.env.S3_BUCKET;
  const forcePath = process.env.S3_FORCE_PATH_STYLE === 'true';
  return forcePath ? `${base}/${bucket}/${key}` : `https://${bucket}.${process.env.S3_REGION}.amazonaws.com/${key}`;
}
