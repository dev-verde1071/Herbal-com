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

export default function ProductForm({
  product,
}: {
  product?: ProductFormData;
}) {
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

      setUploadProgress(
        Math.round(((i + 1) / imageFiles.length) * 100)
      );
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

  async function addVariantImages(
    index: number,
    files: FileList | File[]
  ) {
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

  function removeVariantImage(
    variantIndex: number,
    imageIndex: number
  ) {
    const updated = [...form.variants];

    updated[variantIndex] = {
      ...updated[variantIndex],
      images: updated[variantIndex].images.filter(
        (_, i) => i !== imageIndex
      ),
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

    setForm({
      ...form,
      images,
    });
  }

  function moveVariantImage(
    variantIndex: number,
    from: number,
    to: number
  ) {
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

  function setVariantMainImage(
    variantIndex: number,
    imageIndex: number
  ) {
    moveVariantImage(variantIndex, imageIndex, 0);
  }

  function updateVariant(
    index: number,
    key: keyof Variant,
    value: any
  ) {
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
        compareAt: variant.compareAt
          ? Number(variant.compareAt)
          : null,
        qty: Number(variant.qty || 0),
        images: Array.isArray(variant.images)
          ? variant.images
          : [],
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
      {/* TOP SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">
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
            className="w-full rounded-2xl bg-jungle-950 text-white border border-jungle-700 px-4 py-3 outline-none focus:border-jungle-400"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option
                key={category.value}
                value={category.value}
                className="bg-jungle-950 text-white"
              >
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Subcategory
          </label>

          <input
            value={form.subcategory || ""}
            onChange={(e) =>
              setForm({
                ...form,
                subcategory: e.target.value,
              })
            }
            placeholder="Example: Roots, Oils, Honey, Sea Moss Gel"
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
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

      {/* TYPE / FEATURED / ACTIVE */}
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
            className="w-full rounded-2xl bg-jungle-950 text-white border border-jungle-700 px-4 py-3 outline-none focus:border-jungle-400"
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
            Active on product page
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
            Featured on homepage
          </span>
        </label>
      </div>

      {/* IMAGE SECTION */}
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
            Images are compressed before saving.
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
