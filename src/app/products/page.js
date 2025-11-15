import Image from "next/image";

export default function Products() {
  return (
    <section className="max-w-4xl mx-auto space-y-12">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-leaf-600">Our Products</h1>
        <p className="text-brand-700 mt-2">
          Explore natural herbs, wellness products, and handcrafted remedies.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* PRODUCT CARD EXAMPLE */}
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="w-full h-40 bg-leaf-50 rounded mb-3"></div>
          <h3 className="font-semibold">Product Name</h3>
          <p className="text-sm text-gray-600">Short description here.</p>
          <button className="mt-3 px-4 py-2 bg-leaf-500 text-white rounded hover:bg-leaf-600">
            View Details
          </button>
        </div>

        {/* Duplicate these product cards as needed */}
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="w-full h-40 bg-leaf-50 rounded mb-3"></div>
          <h3 className="font-semibold">Product Name</h3>
          <p className="text-sm text-gray-600">Short description here.</p>
          <button className="mt-3 px-4 py-2 bg-leaf-500 text-white rounded hover:bg-leaf-600">
            View Details
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <div className="w-full h-40 bg-leaf-50 rounded mb-3"></div>
          <h3 className="font-semibold">Product Name</h3>
          <p className="text-sm text-gray-600">Short description here.</p>
          <button className="mt-3 px-4 py-2 bg-leaf-500 text-white rounded hover:bg-leaf-600">
            View Details
          </button>
        </div>

      </div>
    </section>
  );
}
