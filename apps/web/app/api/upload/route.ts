import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION as string ,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string ,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});



export async function POST (req: NextRequest) {
 try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
        return Response.json({ error: "Filename and filetype are required" }, { status: 400 });
    }

    const key = `uploads/${Date.now()}-${fileName}`;
    const params: any = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    }

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 })
    return Response.json({ uploadUrl })
 } catch (e) {
    console.log(e);
    return Response.json({ message: "error while getting the s3 upload url" })
 }
}