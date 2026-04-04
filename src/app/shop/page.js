"use client";

import { useState } from "react";

const products = [
  // SAMPLE STRUCTURE — ALL YOUR PRODUCTS ARE INCLUDED BELOW

  {
    name: "Cuachalate Bark (4oz)",
    price: 18,
    category: "retail"
  },
  {
    name: "Cuachalate Bark (8oz)",
    price: 35,
    category: "retail"
  },
  {
    name: "Cuachalate Bark (1 LB)",
    price: 55,
    category: "retail"
  },

  {
    name: "Dry Honduran Seamoss (5LB Bulk)",
    price: 200,
    category: "wholesale"
  },

  {
    name: "Young Jelly Coconut (1)",
    price: 8,
    category: "retail"
  },
  {
    name: "Young Jelly Coconut Box (9 count)",
    price: 70,
    category: "wholesale"
  },

  {
    name: "Batana Oil (1 Gallon)",
    price: 200,
    category: "wholesale"
  },

  {
    name: "Batana Oil (4oz)",
    price: 30,
    category: "retail"
  },

  {
    name: "Rosemary Shampoo (1 Gallon)",
    price: 200,
    category: "wholesale"
  },

  {
    name: "Rosemary Shampoo (8oz)",
    price: 20,
    category: "retail"
  },

  {
    name: "Handmade Batana Soap (1 Bar)",
    price: 8,
    category: "retail"
  },
  {
    name: "Handmade Batana Soap (100 Bars)",
    price: 500,
    category: "wholesale"
  },

  {
    name: "Melipona Bee Honey (1oz)",
    price: 60,
    category: "retail"
  },
  {
    name: "Melipona Bee Honey (4oz)",
    price: 200,
    category: "retail"
  },

  {
    name: "Tooth Powder (4oz)",
    price: 35,
    category: "retail"
  },

  {
    name: "Lions Mane Powder (1LB)",
    price: 55,
    category: "wholesale"
  },

  {
    name: "Ginger Powder (4oz)",
    price: 12,
    category: "retail"
  },

  {
    name: "Duck Flower (2 Dry Flowers)",
    price: 30,
    category: "retail"
  },

  {
    name: "Coconut Oil (1 Gallon)",
    price: 180,
    category: "wholesale"
  }
];

export default function ShopPage() {
  const [filter, setFilter] = useState("all");

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <div className="section-spacing">
      <div className="site-container">

        <h1 className="section-title">Shop</h1>

        {/* FILTER BUTTONS */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setFilter("all")} className="btn-secondary">
            All
          </button>
          <button onClick={() => setFilter("retail")} className="btn-secondary">
            Retail
          </button>
          <button onClick={() => setFilter("wholesale")} className="btn-secondary">
            Wholesale
          </button>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div key={index} className="card p-6 flex flex-col justify-between">

              <div>
                <h3 className="text-lg font-semibold text-leaf-700">
                  {product.name}
                </h3>

                <p className="mt-2 text-xl font-bold text-sand-700">
                  ${product.price}
                </p>

                {/* CATEGORY BADGE */}
                <div className="mt-3">
                  {product.category === "wholesale" ? (
                    <span className="text-xs font-semibold text-white bg-leaf-700 px-3 py-1 rounded-full">
                      Wholesale
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-sand-700 bg-sand-100 px-3 py-1 rounded-full">
                      Retail
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <button className="mt-6 btn-primary">
                View Product
              </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
