import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  guestName: string;
  retreatName?: string | null;
  reason: string;
};

export default function RetreatGuestRemovalEmail({
  guestName,
  retreatName,
  reason,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Herbal Communities retreat booking has been updated.</Preview>

      <Body style={{ backgroundColor: "#071510", color: "#ffffff" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "32px",
            backgroundColor: "#0b2514",
            borderRadius: "18px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <Heading style={{ color: "#ffffff" }}>
            Retreat Booking Update
          </Heading>

          <Text style={{ color: "#d7e8dc", fontSize: "16px" }}>
            Hi {guestName || "there"},
          </Text>

          <Text style={{ color: "#d7e8dc", fontSize: "16px", lineHeight: "1.6" }}>
            We are reaching out regarding your Herbal Communities retreat booking
            {retreatName ? ` for ${retreatName}` : ""}. Unfortunately, your guest
            booking has been removed from this retreat.
          </Text>

          <Section
            style={{
              marginTop: "24px",
              padding: "18px",
              backgroundColor: "#071510",
              borderRadius: "14px",
              border: "1px solid #1f6128",
            }}
          >
            <Text style={{ color: "#9dd59f", fontWeight: "bold" }}>
              Reason provided:
            </Text>

            <Text style={{ color: "#d7e8dc", lineHeight: "1.6" }}>
              {reason}
            </Text>
          </Section>

          <Text style={{ color: "#d7e8dc", fontSize: "16px", lineHeight: "1.6", marginTop: "24px" }}>
            A refund will be issued immediately to the original payment method.
            Depending on your bank or payment provider, it may take several
            business days to appear in your account.
          </Text>

          <Text style={{ color: "#d7e8dc", fontSize: "16px", lineHeight: "1.6" }}>
            We sincerely apologize for the inconvenience and appreciate your
            understanding.
          </Text>

          <Text style={{ color: "#9ca3af", marginTop: "32px" }}>
            Herbal Communities
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
