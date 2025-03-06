import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    try {
        const { fileKey } = await req.json();
       console.log(fileKey);
        if (!fileKey) {
            return NextResponse.json({ message: "File key is required" }, { status: 400 });
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
        };

        await s3.send(new DeleteObjectCommand(params));

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("S3 Delete Error:", error);
        return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
    }
}
