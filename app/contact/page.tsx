import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team.`,
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact us" intro="Have feedback, a tool idea, a bug report or a question? We’d like to hear from you." showUpdated={false}>
      <h2>Email</h2>
      {CONTACT_EMAIL ? (
        <p>
          Write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We aim to reply as soon as we can.
        </p>
      ) : (
        <p>Our contact email will be published on this page soon.</p>
      )}

      <h2>What to write to us about</h2>
      <ul>
        <li>Suggestions for new creator tools</li>
        <li>Bugs or problems with a tool</li>
        <li>Questions about privacy or these policies</li>
        <li>Business and partnership enquiries</li>
      </ul>
    </LegalPage>
  );
}
