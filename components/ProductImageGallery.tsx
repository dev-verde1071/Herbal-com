"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

type Props = {
  images: string[];
  name: string;
  fallbackIcon?: string;
};

export default function ProductImageGallery({
  images,
  name,
  fallbackIcon = "🌿",
}: Props) {
  const cleanImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const selectedImage = cleanImages[selectedIndex];

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => selectedImage && setZoomOpen(true)}
          onDoubleClick={() => selectedImage && setZoomOpen(true)}
          className="relative aspect-square w-full rounded-3xl overflow-hidden bg-bark-800 border border-jungle-900/60 group"
        >
          {selectedImage ? (
            <>
              <Image
                src={selectedImage}
                alt={name}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition rounded-full bg-black/70 p-4">
                  <ZoomIn className="w-7 h-7 text-white" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-jungle-700">
              <span className="text-7xl">{fallbackIcon}</span>
              <p className="text-sm">Image coming soon</p>
            </div>
          )}
        </button>

        {cleanImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {cleanImages.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square rounded-2xl overflow-hidden border transition ${
                  selectedIndex === index
                    ? "border-jungle-400 ring-2 ring-jungle-500/40"
                    : "border-jungle-900/60 hover:border-jungle-500"
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoomOpen && selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-5 right-5 rounded-full bg-white/10 hover:bg-white/20 p-3"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={selectedImage}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
