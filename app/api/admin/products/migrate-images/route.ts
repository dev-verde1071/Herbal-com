import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const utapi = new UTApi();

type MigrationStats = {
  productsScanned: number;
  variantsScanned: number;
  productsUpdated: number;
  variantsUpdated: number;
  imagesConverted: number;
  imagesUploaded: number;
  imagesReused: number;
  imagesFailed: number;
  errors: string[];
};

function isBase64Image(value?: string | null) {
  return (
    typeof value === "string" &&
    value.startsWith("data:image/") &&
    value.includes(";base64,")
  );
}

function getMimeType(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  return match?.[1] || "image/jpeg";
}

function getExtension(mimeType: string) {
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("gif")) return "gif";
  if (mimeType.includes("svg")) return "svg";
  return "jpg";
}

function dataUrlToFile(dataUrl: string, fileName: string) {
  const parts = dataUrl.split(";base64,");

  if (parts.length !== 2) {
    throw new Error("Invalid base64 image format.");
  }

  const mimeType = getMimeType(dataUrl);
  const buffer = Buffer.from(parts[1], "base64");

  return new File([buffer as unknown as BlobPart], fileName, {
    type: mimeType,
  });
}

function getUploadThingUrl(uploadResult: any) {
  return (
    uploadResult?.data?.ufsUrl ||
    uploadResult?.data?.url ||
    uploadResult?.data?.appUrl ||
    uploadResult?.ufsUrl ||
    uploadResult?.url ||
    uploadResult?.appUrl ||
    ""
  );
}

async function migrateImageArray({
  images,
  label,
  cache,
  stats,
}: {
  images?: string[] | null;
  label: string;
  cache: Map<string, string>;
  stats: MigrationStats;
}) {
  const currentImages = Array.isArray(images) ? images : [];
  const nextImages: string[] = [];
  let changed = false;

  for (let index = 0; index < currentImages.length; index++) {
    const image = currentImages[index];

    if (!isBase64Image(image)) {
      nextImages.push(image);
      continue;
    }

    try {
      let uploadedUrl = cache.get(image);

      if (!uploadedUrl) {
        const mimeType = getMimeType(image);
        const extension = getExtension(mimeType);
        const safeLabel = label.replace(/[^a-zA-Z0-9-]/g, "-");
        const fileName = `${safeLabel}-${index + 1}-${Date.now()}.${extension}`;
        const file = dataUrlToFile(image, fileName);

        const uploadResponse = await utapi.uploadFiles([file]);
        const firstResult = Array.isArray(uploadResponse)
          ? uploadResponse[0]
          : uploadResponse;

        if ((firstResult as any)?.error) {
          throw new Error(
            (firstResult as any).error?.message ||
              "UploadThing returned an upload error."
          );
        }

        uploadedUrl = getUploadThingUrl(firstResult);

        if (!uploadedUrl) {
          throw new Error("UploadThing did not return a public image URL.");
        }

        cache.set(image, uploadedUrl);
        stats.imagesUploaded++;
      } else {
        stats.imagesReused++;
      }

      nextImages.push(uploadedUrl);
      stats.imagesConverted++;
      changed = true;
    } catch (error: any) {
      stats.imagesFailed++;

      if (stats.errors.length < 10) {
        stats.errors.push(
          `${label} image ${index + 1}: ${
            error?.message || "Failed to migrate image."
          }`
        );
      }

      nextImages.push(image);
    }
  }

  return {
    changed,
    images: nextImages,
  };
}

export async function POST() {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const stats: MigrationStats = {
    productsScanned: 0,
    variantsScanned: 0,
    productsUpdated: 0,
    variantsUpdated: 0,
    imagesConverted: 0,
    imagesUploaded: 0,
    imagesReused: 0,
    imagesFailed: 0,
    errors: [],
  };

  const cache = new Map<string, string>();

  try {
    const products = await db.product.findMany({
      where: {
        type: {
          in: ["RETAIL", "BOTH"],
        },
      },
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    for (const product of products) {
      stats.productsScanned++;

      const migratedProductImages = await migrateImageArray({
        images: product.images,
        label: `product-${product.id}`,
        cache,
        stats,
      });

      if (migratedProductImages.changed) {
        await db.product.update({
          where: {
            id: product.id,
          },
          data: {
            images: migratedProductImages.images,
          },
        });

        stats.productsUpdated++;
      }

      for (const variant of product.variants) {
        stats.variantsScanned++;

        const migratedVariantImages = await migrateImageArray({
          images: variant.images,
          label: `variant-${variant.id}`,
          cache,
          stats,
        });

        if (migratedVariantImages.changed) {
          await db.productVariant.update({
            where: {
              id: variant.id,
            },
            data: {
              images: migratedVariantImages.images,
            },
          });

          stats.variantsUpdated++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Retail product image migration complete.",
      stats,
    });
  } catch (error: any) {
    console.error("Retail product image migration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to migrate retail product images.",
        stats,
      },
      { status: 500 }
    );
  }
}
