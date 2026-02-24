import { z } from "zod";
import { baseProcedure } from "~/server/trpc/main";
import { minioClient } from "~/server/minio";

const presignedUploadUrlInput = z.object({
  filename: z.string().min(1, "Filename is required"),
  contentType: z.string().min(1, "Content type is required"),
});

export const getPresignedUploadUrl = baseProcedure
  .input(presignedUploadUrlInput)
  .mutation(async ({ input }) => {
    const bucketName = "creator-uploads";
    
    // Generate unique object name with timestamp to prevent collisions
    const timestamp = Date.now();
    const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const objectName = `${timestamp}-${sanitizedFilename}`;
    
    // Generate presigned PUT URL (expires in 10 minutes)
    const presignedUrl = await minioClient.presignedPutObject(
      bucketName,
      objectName,
      10 * 60 // 10 minutes in seconds
    );
    
    return {
      presignedUrl,
      objectName,
      bucketName,
    };
  });
