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
  name: string;
  businessName: string;
  siteUrl: string;
};

export default function WholesaleApproved({
  name,
  businessName,
  siteUrl,
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
              Wholesale Access Approved 🌿
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "1.7" }}>
              Hi {name},
              <br />
              <br />
              We’re excited to let you know that your wholesale application for <strong>{businessName}</strong> has been approved.
              <br />
              <br />
              We appreciate your interest in working with Herbal Communities and look forward to building a strong relationship with you.
              <br />
              <br />
              A team member will be reaching out by email and/or phone with next steps, availability, ordering details, and any additional information needed to begin working together.
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            <a
              href={`${siteUrl}/dashboard/wholesale`}
              style={{
                backgroundColor: "#1f6128",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                padding: "14px 28px",
                borderRadius: "12px",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              View Wholesale Area
            </a>
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
