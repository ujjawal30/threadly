import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadImagetoS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
): Promise<string> => {
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    return `https://${process.env.AWS_S3_BUCKET_URL}/${fileName}`;
  } catch (error) {
    throw error;
  }
};
