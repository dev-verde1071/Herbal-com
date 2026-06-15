import { createUploadthing, type FileRouter } from "uploadthing/next";
import { isAdmin } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 20,
    },
  })
    .middleware(async () => {
      const admin = await isAdmin();

      if (!admin) {
        throw new Error("Unauthorized");
      }

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
        name: file.name,
        key: file.key,
      };
    }),

  videoUploader: f({
    video: {
      maxFileSize: "64MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const admin = await isAdmin();

      if (!admin) {
        throw new Error("Unauthorized");
      }

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
        name: file.name,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
