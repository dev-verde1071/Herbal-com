import {
  Html, Head, Body, Container, Section,
  Text, Heading, Hr, Row, Column, Img,
} from "@react-email/components";

type OrderItem = { name: string; price: number; qty: number; image?: string };

type Props = {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
};

export default function OrderConfirmation({ customerName, orderId, items, total }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#071510", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Text style={{ color: "#4a9e52", fontSize: "12px", fontWeight: "600", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 8px" }}>
              Herbal Communities
            </Text>
            <Heading style={{ color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: "0" }}>
              Order Confirmed 🌿
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#7fbf84", fontSize: "14px", margin: "0 0 16px" }}>
              Hi {customerName}, thank you for your order!
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: "12px", margin: "0" }}>
              Order ID: <span style={{ color: "#c89f4f", fontFamily: "monospace" }}>{orderId}</span>
            </Text>
          </Section>

          {items.map((item, i) => (
            <Section key={i} style={{ backgroundColor: "#0f2913", borderRadius: "12px", padding: "16px", marginBottom: "8px", border: "1px solid #163d1c" }}>
              <Row>
                <Column style={{ width: "40px" }}>
                  <Text style={{ fontSize: "24px", margin: "0" }}>🌿</Text>
                </Column>
                <Column style={{ paddingLeft: "12px" }}>
                  <Text style={{ color: "#ffffff", fontSize: "14px", fontWeight: "600", margin: "0" }}>{item.name}</Text>
                  <Text style={{ color: "#9ca3af", fontSize: "12px", margin: "4px 0 0" }}>Qty: {item.qty}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ color: "#c89f4f", fontSize: "14px", fontWeight: "700", margin: "0" }}>
                    ${item.price.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>
          ))}

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />

          <Row>
            <Column><Text style={{ color: "#9ca3af", fontSize: "14px", margin: "0" }}>Total</Text></Column>
            <Column style={{ textAlign: "right" }}>
              <Text style={{ color: "#c89f4f", fontSize: "20px", fontWeight: "700", margin: "0" }}>
                ${total.toFixed(2)}
              </Text>
            </Column>
          </Row>

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />

          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", lineHeight: "1.6" }}>
            Questions? Reach us on{" "}
            <a href="https://www.instagram.com/herbcom_" style={{ color: "#4a9e52" }}>Instagram</a>
            {" "}or{" "}
            <a href="https://www.facebook.com/share/1Fry7QcUcm/" style={{ color: "#4a9e52" }}>Facebook</a>.
            <br />
            Sourced from Guatemala · Honduras · Jamaica
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
