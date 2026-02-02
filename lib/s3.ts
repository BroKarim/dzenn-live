import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  ...(process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT }),
});

export async function uploadToS3(file: Buffer, fileName: string, contentType: string): Promise<string> {
  const bucket = process.env.S3_BUCKET!;
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${process.env.S3_PUBLIC_URL}/${key}`;
}

export async function deleteFromS3(url: string | null | undefined): Promise<void> {
  if (!url) return;

  try {
    const publicUrl = process.env.S3_PUBLIC_URL!;
    if (!url.startsWith(publicUrl)) return;

    const key = url.replace(`${publicUrl}/`, "");
    const bucket = process.env.S3_BUCKET!;

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Failed to delete from S3:", error);
  }
}

export async function uploadBase64ToS3(base64: string, fileName: string): Promise<string> {
  const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const contentType = matches[1];
  const data = matches[2];
  const buffer = Buffer.from(data, "base64");

  return uploadToS3(buffer, fileName, contentType);
}
