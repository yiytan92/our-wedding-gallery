'use strict';

const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const path = require('path');

const readStream = stream =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.once('error', reject);
    stream.once('end', () => resolve(Buffer.concat(chunks)));
  });

const getCurrentDate = () => {
  const date = new Date();

  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  let month = date.getMonth() + 1;
  month = month > 9 ? month : `0${month}`;
  const year = date.getFullYear();

  return { day, month, year };
};

module.exports.handler = async event => {
  const s3 = new S3Client({
    forcePathStyle: process.env.IS_OFFLINE,
    endpoint: process.env.S3_ENDPOINT || undefined,
  });

  const { key } = event.Records[0].s3.object;
  const { name } = path.parse(key);

  // Get the caption from S3 metadata BEFORE moving the file
  const headObjectParams = {
    Bucket: event.Records[0].s3.bucket.name,  // Use the source bucket
    Key: key  // Use the original key
  };

  let caption = '';
  try {
    const headResult = await s3.send(new HeadObjectCommand(headObjectParams));
    caption = headResult.Metadata?.caption || '';
    console.log('Metadata from S3:', headResult.Metadata);
  } catch (error) {
    console.error('Error fetching S3 metadata:', error);
  }

  console.log('bucket name', event.Records[0].s3.bucket.name);
  console.log('caption', caption);

  const object = await s3.send(
    new GetObjectCommand({
      Bucket: event.Records[0].s3.bucket.name,
      Key: key,
    })
  );

  const body = await readStream(object.Body);
  const photo = sharp(body);
  const metadata = await photo.metadata();

  const { day, month, year } = getCurrentDate();

  const thumbnailKey = `${process.env.PHOTO_BUCKET_PREFIX}/thumbnail/${year}/${month}/${day}/${name}.webp`;
  const webKey = `${process.env.PHOTO_BUCKET_PREFIX}/web/${year}/${month}/${day}/${name}.webp`;
  const originalKey = `${process.env.PHOTO_BUCKET_PREFIX}/original/${year}/${month}/${day}/${key}`;

  await Promise.all([
    photo
      .rotate()
      .resize(Math.min(400, metadata.width))
      .webp()
      .toBuffer()
      .then(output =>
        s3.send(
          new PutObjectCommand({
            Key: thumbnailKey,
            Bucket: process.env.PHOTO_BUCKET_NAME,
            Body: output,
          })
        )
      ),

    photo
      .rotate()
      .resize(Math.min(1080, metadata.width))
      .webp()
      .toBuffer()
      .then(output =>
        s3.send(
          new PutObjectCommand({
            Key: webKey,
            Bucket: process.env.PHOTO_BUCKET_NAME,
            Body: output,
          })
        )
      ),

    s3.send(
      new PutObjectCommand({
        Key: originalKey,
        Bucket: process.env.PHOTO_BUCKET_NAME,
        Body: body,
      })
    ),
  ]);

  const db = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  });

  const processedAt = `${new Date().getTime()}`;

  // Store in DynamoDB with the caption
  await db.send(
    new PutItemCommand({
      TableName: process.env.PHOTO_TABLE_NAME,
      Item: {
        PK: { S: `image#${name}` },
        SK: { S: processedAt },
        GSI1PK: { S: 'list' },
        GSI1SK: { S: processedAt },
        thumbnail: { S: `s3://${process.env.PHOTO_BUCKET_NAME}/${thumbnailKey}` },
        web: { S: `s3://${process.env.PHOTO_BUCKET_NAME}/${webKey}` },
        original: { S: `s3://${process.env.PHOTO_BUCKET_NAME}/${originalKey}` },
        caption: { S: caption }
      },
    })
  );

  await s3.send(
    new DeleteObjectCommand({
      Bucket: event.Records[0].s3.bucket.name,
      Key: key,
    })
  );
};
