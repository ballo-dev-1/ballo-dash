import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/app/lib/aws";

// Update db
import { companies } from "@/db/schema"; // your drizzle schema
import { eq } from "drizzle-orm";
import { db } from "@/db/db";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const REGION = process.env.AWS_REGION!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileName, fileType, folder, companyId } = req.query;
  console.log("Received query params:", req.query);

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!companyId) {
    return res.status(400).json({ error: "Missing company ID" });
  }

  const key = `${folder ?? "uploads/cover-photos"}/${companyId}`;
  const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType as string,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  // Optional: Update the company's logoUrl if companyId is passed
  if (companyId && typeof companyId === "string") {
    try {
      await db
        .update(companies)
        .set({ logoUrl: fileUrl, updatedAt: new Date() })
        .where(eq(companies.id, companyId));
    } catch (error) {
      console.error("Failed to update company logo URL:", error);
      return res.status(500).json({ error: "Failed to update company record" });
    }
  }

  return res.status(200).json({
    url: signedUrl,
    key,
    fileUrl,
  });
}
