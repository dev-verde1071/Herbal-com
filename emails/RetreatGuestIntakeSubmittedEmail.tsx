import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type Props = {
  guestName: string;
  retreatName?: string | null;
};

export default function RetreatGuestIntakeSubmittedEmail({
  guestName,
  retreatName,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your retreat guest information has been submitted.</Preview>

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
            Guest Information Submitted
          </Heading>

          <Text style={{ color: "#d7e8dc", fontSize: "16px" }}>
            Hi {guestName || "there"},
          </Text>

          <Text style={{ color: "#d7e8dc", fontSize: "16px", lineHeight: "1.6" }}>
            Your guest information
            {retreatName ? ` for ${retreatName}` : ""} has been submitted
            successfully.
          </Text>

          <Text style={{ color: "#d7e8dc", fontSize: "16px", lineHeight: "1.6" }}>
            Our team will review your details and reach out to confirm any
            additional retreat preparation information.
          </Text>

          <Text style={{ color: "#9ca3af", marginTop: "32px" }}>
            Herbal Communities
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
