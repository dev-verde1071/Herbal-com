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
};

export default function WholesaleRejected({ name, businessName }: Props) {
  return (
    <Html>
      <Head />

      <Body style={{ backgroundColor: "#071510", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Text style={{ color: "#4a9e52", fontSize: "12px", fontWeight: "700", letterSpacing: "4px", textTransform: "uppercase" }}>
              Herbal Communities
            </Text>

            <Heading style={{ color: "#ffffff", fontSize: "26px", margin: "0" }}>
              Wholesale Application Update
            </Heading>
          </Section>

          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#d1d5db", fontSize: "14px", lineHeight: "1.7" }}>
              Hi {name},
              <br />
              <br />
              Thank you for taking the time to apply for wholesale access with Herbal Communities for <strong>{businessName}</strong>.
              <br />
              <br />
              After reviewing your application, we are not able to fulfill your wholesale request at this time. This does not mean the door is closed permanently — as our inventory, capacity, and wholesale availability grow, we would be happy to hear from you again in the future.
              <br />
              <br />
              We truly appreciate your interest in working with Herbal Communities and wish you continued success with your business.
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
