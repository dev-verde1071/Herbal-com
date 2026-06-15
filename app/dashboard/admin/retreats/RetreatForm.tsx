"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFiles } from "@/lib/uploadthing";

type RetreatFormData = {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  location?: string | null;
  country?: string | null;
  duration?: string | null;
  price: number | string;
  compareAt?: number | string | null;
  clearanceActive: boolean;
  clearancePercent?: number | string | null;
  clearancePrice?: number | string | null;
  spots: number | string;
  spotsLeft: number | string;
  inStock: boolean;
  images: string[];
  videos: string[];
  featured: boolean;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  includes: string[];
  active: boolean;
};

function getUploadedUrl(file: any) {
  return file?.ufsUrl || file?.url || file?.appUrl || "";
}

export default function RetreatForm({
  retreat,
}: {
  retreat?: RetreatFormData;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [draggingImages, setDraggingImages] = useState(false);
  const [draggingVideos, setDraggingVideos] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState<RetreatFormData>({
    id: retreat?.id,
    name: retreat?.name || "",
    slug: retreat?.slug || "",
    description: retreat?.description || "",
    location: retreat?.location || "",
    country: retreat?.country || "",
    duration: retreat?.duration || "",
    price: retreat?.price ?? "",
    compareAt: retreat?.compareAt ?? "",
    clearanceActive: retreat?.clearanceActive ?? false,
    clearancePercent: retreat?.clearancePercent ?? "",
    clearancePrice: retreat?.clearancePrice ?? "",
    spots: retreat?.spots ?? 0,
    spotsLeft: retreat?.spotsLeft ?? 0,
    inStock: retreat?.inStock ?? true,
    images: Array.isArray(retreat?.images) ? retreat.images : [],
    videos: Array.isArray(retreat?.videos) ? retreat.videos : [],
    featured: retreat?.featured ?? false,
    startDate: retreat?.startDate
      ? new Date(retreat.startDate).toISOString().slice(0, 10)
      : "",
    endDate: retreat?.endDate
      ? new Date(retreat.endDate).toISOString().slice(0, 10)
      : "",
    includes: Array.isArray(retreat?.includes) ? retreat.includes : [],
    active: retreat?.active ?? true,
  });

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function processImageFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) return [];

    setUploadProgress(15);

    const uploaded = await uploadFiles("imageUploader", {
      files: imageFiles,
    });

    setUploadProgress(100);

    setTimeout(() => setUploadProgress(0), 800);

    return uploaded.map(getUploadedUrl).filter(Boolean);
  }

  async function processVideoFiles(files: FileList | File[]) {
    const videoFiles = Array.from(files).filter((file) =>
      file.type.startsWith("video/")
    );

    if (videoFiles.length === 0) return [];

    setUploadProgress(15);

    const uploaded = await uploadFiles("videoUploader", {
      files: videoFiles,
    });

    setUploadProgress(100);

    setTimeout(() => setUploadProgress(0), 800);

    return uploaded.map(getUploadedUrl).filter(Boolean);
  }

  async function addImages(files: FileList | File[]) {
    try {
      const uploaded = await processImageFiles(files);

      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploaded],
      }));
    } catch (error) {
      console.error("Retreat image upload error:", error);
      alert("Failed to upload retreat image.");
      setUploadProgress(0);
    }
  }

  async function addVideos(files: FileList | File[]) {
    try {
      const uploaded = await processVideoFiles(files);

      setForm((prev) => ({
        ...prev,
        videos: [...(prev.videos || []), ...uploaded],
      }));
    } catch (error) {
      console.error("Retreat video upload error:", error);
      alert("Failed to upload retreat video.");
      setUploadProgress(0);
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function removeVideo(index: number) {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  }

  function moveImage(from: number, to: number) {
    const images = [...form.images];

    if (to < 0 || to >= images.length) return;

    const [moved] = images.splice(from, 1);
    images.splice(to, 0, moved);

    setForm({
      ...form,
      images,
    });
  }

  function moveVideo(from: number, to: number) {
    const videos = [...form.videos];

    if (to < 0 || to >= videos.length) return;

    const [moved] = videos.splice(from, 1);
    videos.splice(to, 0, moved);

    setForm({
      ...form,
      videos,
    });
  }

  function setMainImage(index: number) {
    moveImage(index, 0);
  }

  function updateIncludes(value: string) {
    setForm({
      ...form,
      includes: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  function calculateClearancePreview() {
    const price = Number(form.price || 0);

    if (!form.clearanceActive) return price;

    const directPrice = Number(form.clearancePrice || 0);
    const percent = Number(form.clearancePercent || 0);

    if (directPrice > 0) return directPrice;

    if (percent > 0) {
      return Math.max(0, price - price * (percent / 100));
    }

    return price;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Number(form.price || 0),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      clearancePercent: form.clearancePercent
        ? Number(form.clearancePercent)
        : null,
      clearancePrice: form.clearancePrice ? Number(form.clearancePrice) : null,
      spots: Number(form.spots || 0),
      spotsLeft: Number(form.spotsLeft || 0),
      startDate: form.startDate ? new Date(String(form.startDate)) : null,
      endDate: form.endDate ? new Date(String(form.endDate)) : null,
      images: Array.isArray(form.images) ? form.images : [],
      videos: Array.isArray(form.videos) ? form.videos : [],
      includes: Array.isArray(form.includes) ? form.includes : [],
    };

    const url = retreat?.id
      ? `/api/admin/retreats/${retreat.id}`
      : "/api/admin/retreats";

    const method = retreat?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.error || "Failed to save retreat.");
      return;
    }

    router.push("/dashboard/admin/retreats");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="glass rounded-3xl p-8 border border-jungle-900/60 space-y-8"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Retreat Name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
                slug: form.slug || slugify(e.target.value),
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Slug
          </label>

          <input
            value={form.slug || ""}
            onChange={(e) =>
              setForm({
                ...form,
                slug: slugify(e.target.value),
              })
            }
            placeholder="auto-generated-from-name"
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Retreat Description / Itinerary
        </label>

        <textarea
          rows={8}
          value={form.description || ""}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          placeholder="Use this area to outline the retreat details, daily itinerary, expectations, travel notes, lodging details, healing schedule, ceremonies, activities, and any important guest information."
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Location
          </label>

          <input
            value={form.location || ""}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Country
          </label>

          <input
            value={form.country || ""}
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Duration
          </label>

          <input
            value={form.duration || ""}
            onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value,
              })
            }
            placeholder="Example: 7 days / 6 nights"
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Regular Price
          </label>

          <input
            required
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Compare At / Old Price
          </label>

          <input
            type="number"
            step="0.01"
            value={form.compareAt || ""}
            onChange={(e) =>
              setForm({
                ...form,
                compareAt: e.target.value,
              })
            }
            placeholder="Optional"
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Spots Total
          </label>

          <input
            type="number"
            value={form.spots}
            onChange={(e) =>
              setForm({
                ...form,
                spots: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Spots Available
          </label>

          <input
            type="number"
            value={form.spotsLeft}
            onChange={(e) =>
              setForm({
                ...form,
                spotsLeft: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-black/20 border border-jungle-900/60 p-6">
        <div className="flex items-center gap-3 mb-5">
          <input
            type="checkbox"
            checked={form.clearanceActive}
            onChange={(e) =>
              setForm({
                ...form,
                clearanceActive: e.target.checked,
              })
            }
          />

          <div>
            <h3 className="font-semibold text-jungle-300">
              Clearance / Discount Pricing
            </h3>

            <p className="text-sm text-zinc-500">
              Use this when you want to discount a retreat to fill empty spots.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Percent Off
            </label>

            <input
              type="number"
              value={form.clearancePercent || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  clearancePercent: e.target.value,
                })
              }
              placeholder="Example: 20"
              className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Final Clearance Price
            </label>

            <input
              type="number"
              step="0.01"
              value={form.clearancePrice || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  clearancePrice: e.target.value,
                })
              }
              placeholder="Optional override, example: 800"
              className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
            />
          </div>

          <div className="rounded-2xl bg-black/30 border border-jungle-900/60 p-4">
            <p className="text-sm text-zinc-500 mb-1">
              Checkout Price Preview
            </p>

            <p
              className="text-2xl font-bold"
              style={{ color: "#c89f4f" }}
            >
              ${calculateClearancePreview().toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Start Date
          </label>

          <input
            type="date"
            value={String(form.startDate || "")}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            End Date
          </label>

          <input
            type="date"
            value={String(form.endDate || "")}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <label className="flex items-center gap-3 rounded-2xl bg-black/20 border border-jungle-900/60 px-5 py-4">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />

          <span className="text-sm text-zinc-300">
            Active on retreats page
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black/20 border border-jungle-900/60 px-5 py-4">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) =>
              setForm({
                ...form,
                inStock: e.target.checked,
              })
            }
          />

          <span className="text-sm text-zinc-300">
            Available for booking
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-black/20 border border-jungle-900/60 px-5 py-4">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({
                ...form,
                featured: e.target.checked,
              })
            }
          />

          <span className="text-sm text-zinc-300">
            Featured retreat
          </span>
        </label>
      </div>

      <section>
        <label className="block text-sm text-zinc-300 mb-2">
          Retreat Images
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingImages(true);
          }}
          onDragLeave={() => setDraggingImages(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDraggingImages(false);
            addImages(e.dataTransfer.files);
          }}
          className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
            draggingImages
              ? "border-jungle-300 bg-jungle-900/50"
              : "border-jungle-900/70 bg-black/20"
          }`}
        >
          <p className="text-4xl mb-3">📸</p>

          <p className="font-semibold text-white mb-2">
            Drag and drop retreat images here
          </p>

          <p className="text-sm text-zinc-400 mb-5">
            Images upload to UploadThing and save as public URLs for Stripe
            checkout.
          </p>

          <label className="inline-flex cursor-pointer rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition">
            Choose Images
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) addImages(e.target.files);
              }}
            />
          </label>
        </div>

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {form.images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("retreat-image-index", String(index))
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(
                    e.dataTransfer.getData("retreat-image-index")
                  );

                  if (!Number.isNaN(from)) {
                    moveImage(from, index);
                  }
                }}
                className="relative rounded-2xl overflow-hidden border border-jungle-900/60 bg-black/30 cursor-grab"
              >
                <img
                  src={image}
                  alt={`Retreat image ${index + 1}`}
                  className="w-full h-36 object-cover"
                />

                {index === 0 ? (
                  <span className="absolute bottom-2 left-2 rounded-lg bg-jungle-800/90 text-xs px-2 py-1 text-jungle-200">
                    Main Image
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMainImage(index)}
                    className="absolute bottom-2 left-2 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                  >
                    Set Main
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="absolute top-2 right-16 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="absolute top-2 right-9 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                >
                  →
                </button>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white text-xs px-2 py-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <label className="block text-sm text-zinc-300 mb-2">
          Retreat Videos
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingVideos(true);
          }}
          onDragLeave={() => setDraggingVideos(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDraggingVideos(false);
            addVideos(e.dataTransfer.files);
          }}
          className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
            draggingVideos
              ? "border-jungle-300 bg-jungle-900/50"
              : "border-jungle-900/70 bg-black/20"
          }`}
        >
          <p className="text-4xl mb-3">🎥</p>

          <p className="font-semibold text-white mb-2">
            Drag and drop retreat videos here
          </p>

          <p className="text-sm text-zinc-400 mb-5">
            Videos upload to UploadThing and save as public URLs.
          </p>

          <label className="inline-flex cursor-pointer rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition">
            Choose Videos
            <input
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) addVideos(e.target.files);
              }}
            />
          </label>
        </div>

        {form.videos.length > 0 && (
          <div className="space-y-4 mt-5">
            {form.videos.map((video, index) => (
              <div
                key={`${video}-${index}`}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("retreat-video-index", String(index))
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(
                    e.dataTransfer.getData("retreat-video-index")
                  );

                  if (!Number.isNaN(from)) {
                    moveVideo(from, index);
                  }
                }}
                className="rounded-2xl border border-jungle-900/60 bg-black/30 p-4"
              >
                <video
                  src={video}
                  controls
                  className="w-full rounded-2xl border border-jungle-900/60"
                />

                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => moveVideo(index, index - 1)}
                    className="rounded-xl bg-black/40 hover:bg-jungle-900/60 px-4 py-2 text-sm"
                  >
                    Move Up
                  </button>

                  <button
                    type="button"
                    onClick={() => moveVideo(index, index + 1)}
                    className="rounded-xl bg-black/40 hover:bg-jungle-900/60 px-4 py-2 text-sm"
                  >
                    Move Down
                  </button>

                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="rounded-xl bg-red-900/60 hover:bg-red-800 px-4 py-2 text-sm text-red-100"
                  >
                    Remove Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {uploadProgress > 0 && (
        <div>
          <div className="h-3 rounded-full bg-black/40 overflow-hidden">
            <div
              className="h-full bg-jungle-500 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <p className="text-xs text-zinc-400 mt-2">
            Uploading media... {uploadProgress}%
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          What’s Included
        </label>

        <textarea
          rows={6}
          value={form.includes.join("\n")}
          onChange={(e) => updateIncludes(e.target.value)}
          placeholder={`Airport pickup\nDaily meals\nLodging included\nGuided plant walk\nCeremony preparation`}
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />

        <p className="text-xs text-zinc-500 mt-2">
          Each line becomes one bullet point on the retreat page.
        </p>
      </div>

      <button
        disabled={loading}
        className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-8 py-4 font-semibold"
      >
        {loading ? "Saving Retreat..." : "Save Retreat"}
      </button>
    </form>
  );
}
