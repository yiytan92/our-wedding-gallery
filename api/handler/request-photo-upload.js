'use strict';

const { S3Client } = require('@aws-sdk/client-s3');
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');

module.exports.handler = async event => {
  const body = JSON.parse(event.body);
  const photos = JSON.parse(body?.photos) || [];
  const caption = body?.caption || '';
  console.log('>>> caption', caption);

  if (photos.length < 1 && photos.length > process.env.MAX_PHOTOS_PER_REQUEST) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        { error: `Expected between 1 and ${process.env.MAX_PHOTOS_PER_REQUEST} photos` },
        null,
        2
      ),
    };
  }

  const s3 = new S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
  });

  const urls = await Promise.all(
    photos.map(name => {
      const fileKey = `${Math.random().toString(36).substring(2)}.${name.split('.').pop()}`;

      return createPresignedPost(s3, {
        Bucket: process.env.UPLOAD_BUCKET_NAME,
        Key: fileKey,
        Expires: photos.length * 300,
        Conditions: [
          ['starts-with', '$x-amz-meta-caption', ''],
        ],
        Fields: {
          'x-amz-meta-caption': caption,
        },
      });
    })
  );

  console.log('Generated presigned URLs:', JSON.stringify(urls, null, 2));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/hal+json',
      'Access-Control-Allow-Origin': '*', // Be more specific in production
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(
      {
        _links: {
          self: { href: `${process.env.HOST}/api/request` },
          list: { href: `${process.env.HOST}/api/list` },
          bootstrap: { href: `${process.env.HOST}/api` },
        },
        urls,
        caption,
      },
      null,
      2
    ),
  };
};
