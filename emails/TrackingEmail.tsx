import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

type Props = {
  customerName?: string | null;
  trackingNumber: string;
  trackingCourier: string;
  orderId: string;
};

export default function TrackingEmail({
  customerName,
  trackingNumber,
  trackingCourier,
  orderId,
}: Props) {
  return (
    <Html>
      <Head />

      <Body style={{ backgroundColor: "#071510", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Text style={{ color: "#4a9e52", fontSize: "12px", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase" }}>
              Herbal Communities
            </Text>

            <Heading style={{ color: "#ffffff", fontSize: "28px", margin: "0" }}>
              Your Order Is On The Way 🌿
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "1.7" }}>
              Hi {customerName || "there"},
              <br />
              <br />
              Your Herbal Communities order has been prepared for shipment.
              <br />
              <br />
              <strong>Order:</strong> #{orderId.slice(-8)}
              <br />
              <strong>Courier:</strong> {trackingCourier}
              <br />
              <strong>Tracking Number:</strong> {trackingNumber}
              <br />
              <br />
              Please use the courier and tracking number above to follow your package.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />

          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
            Herbal Communities · Natural wellness rooted in community.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
