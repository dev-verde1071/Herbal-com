"use client";

import { useState, useEffect } from "react";
import Container from "@/components/container";
import PageHeader from "@/components/page-header";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Container>
      <PageHeader title="Your Cart" subtitle="Review your selections before checkout." />

      {cartItems.length === 0 ? (
        <p className="text-center text-brand-700 mt-8">
          Your cart is empty. Go add some products or tours!
        </p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border border-brand-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-leaf-700">{item.name}</h3>
                <p className="text-brand-700">${item.price}</p>
                <p className="text-sm text-brand-600">Qty: {item.qty}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-8 border-t pt-4">
            <p className="font-semibold text-leaf-700">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => alert("Stripe checkout integration coming next")}
              className="bg-leaf-500 hover:bg-leaf-600 text-white px-6 py-2 rounded-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}
