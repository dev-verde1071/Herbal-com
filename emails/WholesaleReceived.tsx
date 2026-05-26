import { Html, Head, Body, Container, Section, Text, Heading, Hr } from "@react-email/components";

type Props = { name: string; businessName: string; email: string; phone: string; message?: string };

export default function WholesaleReceived({ name, businessName, email, phone, message }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#071510", fontFamily: "Inter, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 20px" }}>
          <Heading style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", margin: "0 0 24px" }}>
            New Wholesale Application
          </Heading>
          <Section style={{ backgroundColor: "#0f2913", borderRadius: "16px", padding: "24px", border: "1px solid #1f6128" }}>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Name: <span style={{ color: "#fff" }}>{name}</span></Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Business: <span style={{ color: "#fff" }}>{businessName}</span></Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Email: <span style={{ color: "#fff" }}>{email}</span></Text>
            <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 8px" }}>Phone: <span style={{ color: "#fff" }}>{phone}</span></Text>
            {message && <Text style={{ color: "#9ca3af", fontSize: "13px", margin: "8px 0 0" }}>Message: <span style={{ color: "#fff" }}>{message}</span></Text>}
          </Section>
          <Hr style={{ borderColor: "#163d1c", margin: "24px 0" }} />
          <a
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/admin/wholesale`}
            style={{ backgroundColor: "#1f6128", color: "#fff", fontSize: "14px", fontWeight: "700", padding: "12px 24px", borderRadius: "12px", textDecoration: "none", display: "inline-block" }}
          >
            Review in Admin Dashboard →
          </a>
        </Container>
      </Body>
    </Html>
  );
}
