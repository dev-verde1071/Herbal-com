import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    if (!process.env.EASYSHIP_API_TOKEN) {
      return NextResponse.json(
        { error: "Missing EASYSHIP_API_TOKEN." },
        { status: 500 }
      );
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (!order.shippingLine1 || !order.shippingCity || !order.shippingPostal) {
      return NextResponse.json(
        { error: "Order is missing shipping address." },
        { status: 400 }
      );
    }

    const payload = {
      origin_address: {
        line_1: process.env.EASYSHIP_ORIGIN_LINE1 || "",
        line_2: process.env.EASYSHIP_ORIGIN_LINE2 || "",
        city: process.env.EASYSHIP_ORIGIN_CITY || "",
        state: process.env.EASYSHIP_ORIGIN_STATE || "",
        postal_code: process.env.EASYSHIP_ORIGIN_POSTAL || "",
        country_alpha2: process.env.EASYSHIP_ORIGIN_COUNTRY || "US",
        contact_name: process.env.EASYSHIP_ORIGIN_NAME || "Herbal Communities",
        contact_phone: process.env.EASYSHIP_ORIGIN_PHONE || "",
        contact_email: process.env.EASYSHIP_ORIGIN_EMAIL || "",
      },
      destination_address: {
        line_1: order.shippingLine1,
        line_2: order.shippingLine2 || "",
        city: order.shippingCity,
        state: order.shippingState || "",
        postal_code: order.shippingPostal,
        country_alpha2: order.shippingCountry || "US",
        contact_name: order.shippingName || "Customer",
        contact_email: order.email || "",
      },
      parcels: [
        {
          total_actual_weight: 1,
          box: {
            length: 8,
            width: 6,
            height: 4,
          },
          items: order.items.map((item) => ({
            description: item.name,
            quantity: item.qty,
            actual_weight: 0.2,
            declared_currency: "USD",
            declared_customs_value: Number(item.price),
            category: "health_beauty",
          })),
        },
      ],
      incoterms: "DDU",
      insurance: {
        is_insured: false,
      },
      order_data: {
        platform_name: "Herbal Communities",
        platform_order_number: order.id,
        buyer_selected_courier_name: "Standard Shipping",
      },
    };

    const easyshipRes = await fetch(
      "https://public-api.easyship.com/2024-09/shipments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EASYSHIP_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await easyshipRes.json();

    if (!easyshipRes.ok) {
      console.error("Easyship error:", data);

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.errors?.[0]?.message ||
            "Easyship shipment creation failed.",
          details: data,
        },
        { status: 500 }
      );
    }

    const shipmentId =
      data?.shipment?.id ||
      data?.shipment_id ||
      data?.id ||
      data?.data?.id ||
      null;

    const labelUrl =
      data?.shipment?.label?.url ||
      data?.label_url ||
      data?.label?.url ||
      data?.documents?.label?.url ||
      null;

    const trackingNumber =
      data?.shipment?.tracking_number ||
      data?.tracking_number ||
      data?.tracking?.number ||
      null;

    const updated = await db.order.update({
      where: { id: order.id },
      data: {
        easyshipShipmentId: shipmentId,
        easyshipLabelUrl: labelUrl,
        trackingNumber,
        shippingStatus: labelUrl ? "LABEL_CREATED" : "SHIPMENT_CREATED",
        metadata: {
          ...(typeof order.metadata === "object" && order.metadata
            ? (order.metadata as any)
            : {}),
          easyshipResponse: data,
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: updated,
      easyship: data,
    });
  } catch (error: any) {
    console.error("Create Easyship shipment error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create Easyship shipment." },
      { status: 500 }
    );
  }
}
