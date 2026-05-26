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
          stripePriceId: "",
        },
      ],
    }
  );

  const [imageText, setImageText] = useState(
    product?.images?.join("\n") || ""
  );

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
      images: imageText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      variants: form.variants.map((variant) => ({
        ...variant,
        price: Number(variant.price || 0),
        compareAt: variant.compareAt ? Number(variant.compareAt) : null,
        qty: Number(variant.qty || 0),
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
              <option
                key={category.value}
                value={category.value}
              >
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
            Active
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
            Featured
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Image URLs, one per line
        </label>

        <textarea
          rows={4}
          value={imageText}
          onChange={(e) => setImageText(e.target.value)}
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl">
            Variants
          </h3>

          <button
            type="button"
            onClick={addVariant}
            className="rounded-xl bg-jungle-700 hover:bg-jungle-600 px-4 py-2 text-sm font-semibold"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-4">
          {form.variants.map((variant, index) => (
            <div
              key={index}
              className="rounded-2xl border border-jungle-900/60 bg-black/20 p-5"
            >
              <div className="grid lg:grid-cols-6 gap-4">
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
                  placeholder="Compare At"
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
                  onChange={(e) =>
                    updateVariant(index, "sku", e.target.value)
                  }
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />

                <input
                  placeholder="Qty"
                  type="number"
                  value={variant.qty}
                  onChange={(e) =>
                    updateVariant(index, "qty", e.target.value)
                  }
                  className="rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="rounded-xl bg-red-900/40 text-red-300 px-3 py-2"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4">
                <input
                  placeholder="Stripe Price ID, optional"
                  value={variant.stripePriceId || ""}
                  onChange={(e) =>
                    updateVariant(index, "stripePriceId", e.target.value)
                  }
                  className="w-full rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2"
                />
              </div>

              <label className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  checked={variant.inStock}
                  onChange={(e) =>
                    updateVariant(index, "inStock", e.target.checked)
                  }
                />

                <span className="text-sm text-zinc-300">
                  In Stock
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        disabled={loading}
        className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-8 py-4 font-semibold"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
