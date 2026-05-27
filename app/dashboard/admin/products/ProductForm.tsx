"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

type Variant = {
  id?: string;
  label: string;
  price: number | string;
  compareAt?: number | string | null;
  sku?: string;
  qty: number | string;
  inStock: boolean;
  images: string[];
  stripePriceId?: string;
};

type ProductFormData = {
  id?: string;
  name: string;
  description?: string | null;
  category: string;
  subcategory?: string | null;
  type: "RETAIL" | "WHOLESALE" | "BOTH";
  images: string[];
  active: boolean;
  featured: boolean;
  variants: Variant[];
};

export default function ProductForm({ product }: { product?: ProductFormData }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [draggingMain, setDraggingMain] = useState(false);
  const [draggingVariant, setDraggingVariant] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState<ProductFormData>(
    product || {
      name: "",
      description: "",
      category: "herbs",
      subcategory: "",
      type: "RETAIL",
      images: [],
      active: true,
      featured: false,
      variants: [
        {
          label: "4oz",
          price: "",
          compareAt: "",
          sku: "",
          qty: 0,
          inStock: true,
          images: [],
          stripePriceId: "",
        },
      ],
    }
  );

  function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const maxWidth = 1200;
          const scale = Math.min(1, maxWidth / img.width);

          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Image compression failed."));
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL("image/jpeg", 0.78);

          resolve(compressed);
        };

        img.onerror = reject;
        img.src = String(reader.result);
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function processFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) return [];

    const results: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const compressed = await compressImage(imageFiles[i]);
      results.push(compressed);
      setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
    }

    setTimeout(() => setUploadProgress(0), 800);

    return results;
  }

  async function addMainImages(files: FileList | File[]) {
    const uploaded = await processFiles(files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));
  }

  async function addVariantImages(index: number, files: FileList | File[]) {
    const uploaded = await processFiles(files);
    const updated = [...form.variants];

    updated[index] = {
      ...updated[index],
      images: [...(updated[index].images || []), ...uploaded],
    };

    setForm({
      ...form,
      variants: updated,
    });
  }

  function removeMainImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function removeVariantImage(variantIndex: number, imageIndex: number) {
    const updated = [...form.variants];

    updated[variantIndex] = {
      ...updated[variantIndex],
      images: updated[variantIndex].images.filter((_, i) => i !== imageIndex),
    };

    setForm({
      ...form,
      variants: updated,
    });
  }

  function moveMainImage(from: number, to: number) {
    if (to < 0 || to >= form.images.length) return;

    const images = [...form.images];
    const [moved] = images.splice(from, 1);
    images.splice(to, 0, moved);

    setForm({ ...form, images });
  }

  function moveVariantImage(variantIndex: number, from: number, to: number) {
    const updated = [...form.variants];
    const images = [...updated[variantIndex].images];

    if (to < 0 || to >= images.length) return;

    const [moved] = images.splice(from, 1);
    images.splice(to, 0, moved);

    updated[variantIndex] = {
      ...updated[variantIndex],
      images,
    };

    setForm({
      ...form,
      variants: updated,
    });
  }

  function setMainImage(index: number) {
    moveMainImage(index, 0);
  }

  function setVariantMainImage(variantIndex: number, imageIndex: number) {
    moveVariantImage(variantIndex, imageIndex, 0);
  }

  function updateVariant(index: number, key: keyof Variant, value: any) {
    const updated = [...form.variants];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    setForm({
      ...form,
      variants: updated,
    });
  }

  function addVariant() {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        {
          label: "",
          price: "",
          compareAt: "",
          sku: "",
          qty: 0,
          inStock: true,
          images: [],
          stripePriceId: "",
        },
      ],
    });
  }

  function removeVariant(index: number) {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const payload = {
      ...form,
      variants: form.variants.map((variant) => ({
        ...variant,
        price: Number(variant.price || 0),
        compareAt: variant.compareAt ? Number(variant.compareAt) : null,
        qty: Number(variant.qty || 0),
        images: Array.isArray(variant.images) ? variant.images : [],
      })),
    };

    const url = product?.id
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";

    const method = product?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/admin/products");
      router.refresh();
    } else {
      alert("Failed to save product.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass rounded-3xl p-8 border border-jungle-900/60 space-y-8"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Product Name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Category
          </label>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Description
        </label>

        <textarea
          rows={5}
          value={form.description || ""}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Product Type
          </label>

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as ProductFormData["type"],
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          >
            <option value="RETAIL">Retail</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="BOTH">Both</option>
          </select>
        </div>

        <label className="flex items-center gap-3 mt-8">
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
            Active / visible on website
          </span>
        </label>

        <label className="flex items-center gap-3 mt-8">
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
            Featured product
          </span>
        </label>
      </div>

      <section>
        <label className="block text-sm text-zinc-300 mb-2">
          Product Images
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDraggingMain(true);
          }}
          onDragLeave={() => setDraggingMain(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDraggingMain(false);
            addMainImages(e.dataTransfer.files);
          }}
          className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${
            draggingMain
              ? "border-jungle-300 bg-jungle-900/50"
              : "border-jungle-900/70 bg-black/20"
          }`}
        >
          <p className="text-4xl mb-3">📸</p>

          <p className="font-semibold text-white mb-2">
            Drag and drop product images here
          </p>

          <p className="text-sm text-zinc-400 mb-5">
            Images are compressed before saving. First image is the main product
            image.
          </p>

          <label className="inline-flex cursor-pointer rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition">
            Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) addMainImages(e.target.files);
              }}
            />
          </label>

          {uploadProgress > 0 && (
            <div className="mt-5">
              <div className="h-3 rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-jungle-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Processing images... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {form.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {form.images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("main-image-index", String(index))
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(
                    e.dataTransfer.getData("main-image-index")
                  );

                  if (!Number.isNaN(from)) {
                    moveMainImage(from, index);
                  }
                }}
                className="relative rounded-2xl overflow-hidden border border-jungle-900/60 bg-black/30 cursor-grab"
              >
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-36 object-cover"
                />

                <div className="absolute top-2 left-2 rounded-lg bg-black/70 text-xs px-2 py-1 text-white">
                  #{index + 1}
                </div>

                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-lg bg-jungle-800/90 text-xs px-2 py-1 text-jungle-200">
                    Main Image
                  </span>
                )}

                {index !== 0 && (
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
                  onClick={() => moveMainImage(index, index - 1)}
                  className="absolute top-2 right-16 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() => moveMainImage(index, index + 1)}
                  className="absolute top-2 right-9 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                >
                  →
                </button>

                <button
                  type="button"
                  onClick={() => removeMainImage(index)}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl">Variants</h3>

          <button
            type="button"
            onClick={addVariant}
            className="rounded-xl bg-jungle-700 hover:bg-jungle-600 px-4 py-2 text-sm font-semibold"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-5">
          {form.variants.map((variant, index) => (
            <div
              key={index}
              className="rounded-2xl border border-jungle-900/60 bg-black/20 p-5 space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-jungle-300 font-semibold">
                  Variant #{index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="rounded-xl bg-red-900/40 hover:bg-red-900/70 text-red-300 px-3 py-2 text-sm"
                >
                  Delete Variant
                </button>
              </div>

              <div className="grid lg:grid-cols-5 gap-4">
                <input
                  placeholder="Label"
                  value={variant.label}
                  onChange={(e) =>
                    updateVariant(index, "label", e.target.value)
                  }
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />

                <input
                  placeholder="Price"
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />

                <input
                  placeholder="Compare At / old price"
                  type="number"
                  step="0.01"
                  value={variant.compareAt || ""}
                  onChange={(e) =>
                    updateVariant(index, "compareAt", e.target.value)
                  }
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />

                <input
                  placeholder="SKU"
                  value={variant.sku || ""}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />

                <input
                  placeholder="Qty Available"
                  type="number"
                  value={variant.qty}
                  onChange={(e) => updateVariant(index, "qty", e.target.value)}
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={variant.inStock}
                  onChange={(e) =>
                    updateVariant(index, "inStock", e.target.checked)
                  }
                />

                <span className="text-sm text-zinc-300">
                  In Stock / available for purchase
                </span>
              </label>

              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Variant Images
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggingVariant(index);
                  }}
                  onDragLeave={() => setDraggingVariant(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggingVariant(null);
                    addVariantImages(index, e.dataTransfer.files);
                  }}
                  className={`rounded-2xl border-2 border-dashed p-5 text-center transition ${
                    draggingVariant === index
                      ? "border-jungle-300 bg-jungle-900/50"
                      : "border-jungle-900/70 bg-black/20"
                  }`}
                >
                  <p className="text-2xl mb-2">🖼️</p>

                  <p className="text-sm text-zinc-300 mb-3">
                    Drag variant images here or choose files.
                  </p>

                  <label className="inline-flex cursor-pointer rounded-xl bg-jungle-700 hover:bg-jungle-600 px-4 py-2 text-sm font-semibold transition">
                    Choose Variant Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={(e) => {
                        if (e.target.files) addVariantImages(index, e.target.files);
                      }}
                    />
                  </label>
                </div>

                {variant.images?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {variant.images.map((image, imageIndex) => (
                      <div
                        key={`${image}-${imageIndex}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            `variant-image-index-${index}`,
                            String(imageIndex)
                          );
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const from = Number(
                            e.dataTransfer.getData(
                              `variant-image-index-${index}`
                            )
                          );

                          if (!Number.isNaN(from)) {
                            moveVariantImage(index, from, imageIndex);
                          }
                        }}
                        className="relative rounded-2xl overflow-hidden border border-jungle-900/60 bg-black/30 cursor-grab"
                      >
                        <img
                          src={image}
                          alt={`${variant.label} image ${imageIndex + 1}`}
                          className="w-full h-32 object-cover"
                        />

                        <div className="absolute top-2 left-2 rounded-lg bg-black/70 text-xs px-2 py-1 text-white">
                          #{imageIndex + 1}
                        </div>

                        {imageIndex === 0 ? (
                          <span className="absolute bottom-2 left-2 rounded-lg bg-jungle-800/90 text-xs px-2 py-1 text-jungle-200">
                            Main
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setVariantMainImage(index, imageIndex)
                            }
                            className="absolute bottom-2 left-2 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                          >
                            Set Main
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            moveVariantImage(index, imageIndex, imageIndex - 1)
                          }
                          className="absolute top-2 right-16 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveVariantImage(index, imageIndex, imageIndex + 1)
                          }
                          className="absolute top-2 right-9 rounded-lg bg-black/80 hover:bg-jungle-800 text-xs px-2 py-1 text-white"
                        >
                          →
                        </button>

                        <button
                          type="button"
                          onClick={() => removeVariantImage(index, imageIndex)}
                          className="absolute top-2 right-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white text-xs px-2 py-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        disabled={loading}
        className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-8 py-4 font-semibold"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
