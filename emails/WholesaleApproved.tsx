import { Html, Head, Body, Container, Section, Text, Heading, Hr } from "@react-email/components";

type Props = { name: string; businessName: string; siteUrl: string };

export default function WholesaleApproved({ name, businessName, siteUrl }: Props) {
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
              Wholesale Access Approved 🍯
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#7fbf84", fontSize: "14px", lineHeight: "1.6", margin: "0" }}>
              Hi {name},<br /><br />
              Great news! Your wholesale application for <strong style={{ color: "#ffffff" }}>{businessName}</strong> has been approved.
              You now have full access to our wholesale pricing and bulk ordering portal.
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#1a1200", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #c89f4f33" }}>
            <Text style={{ color: "#c89f4f", fontSize: "14px", fontWeight: "700", margin: "0 0 8px" }}>What you can access:</Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.8", margin: "0" }}>
              ✦ Full Melipona stingless bee honey catalog<br />
              ✦ Liter pricing with and without custom labeling<br />
              ✦ Half-liter options available<br />
              ✦ Bulk order discounts
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <a
              href={`${siteUrl}/dashboard/wholesale`}
              style={{ backgroundColor: "#1f6128", color: "#ffffff", fontSize: "14px", fontWeight: "700", padding: "14px 32px", borderRadius: "12px", textDecoration: "none", display: "inline-block" }}
            >
              Access Wholesale Dashboard →
            </a>
          </Section>

          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />
          <Text style={{ color: "#6b7280", fontSize: "12px", textAlign: "center" }}>
            Questions? Message us on Instagram or Facebook.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
