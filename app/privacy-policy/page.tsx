import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles information, cookies and advertising.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" intro={`This policy explains what information ${SITE_NAME} (“we”, “us”) handles when you use this website, and the choices you have.`}>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Tool input.</strong> Our tools, such as the Instagram Bio Generator and the Hashtag Generator, run in your browser. The text you type
          into them is not sent to our servers and is not stored by us.
        </li>
        <li>
          <strong>Accounts.</strong> You do not need an account to use the site, and we do not ask for your name or email to use the tools.
        </li>
        <li>
          <strong>Server logs.</strong> Our hosting provider (Vercel) may record technical information such as IP address, browser type and the pages
          requested, to deliver the site and keep it secure.
        </li>
        <li>
          <strong>Messages you send us.</strong> If you email us, we receive your email address and the contents of your message, and we use them only to
          reply.
        </li>
      </ul>
      <p>We do not currently use analytics tools. If we add them, we will update this policy.</p>

      <h2>Cookies and advertising</h2>
      <p>
        This site is free to use and may show advertising, including ads served by Google AdSense. Third-party vendors, including Google, use cookies to
        serve ads based on a user’s prior visits to this website or other websites. Google’s use of advertising cookies enables it and its partners to
        serve ads to you based on your visit to this site and/or other sites on the internet.
      </p>
      <p>
        You can opt out of personalised advertising by visiting{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        . You can also opt out of some third-party vendors’ use of cookies for personalised advertising at{" "}
        <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
          aboutads.info
        </a>
        . To learn how Google uses data from sites that use its services, see{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          How Google uses information from sites or apps that use our services
        </a>
        .
      </p>
      <p>Where the law requires it, we will ask for your consent before ad-related cookies are used.</p>

      <h2>Our own cookies and storage</h2>
      <p>Our tools do not save your input in cookies or browser storage. You can also control cookies through your browser settings.</p>

      <h2>Third-party links</h2>
      <p>This site may link to other websites. We are not responsible for their content or privacy practices, so please read their policies.</p>

      <h2>Children’s privacy</h2>
      <p>This site is not directed to children under 13, and we do not knowingly collect personal information from children.</p>

      <h2>Your choices and rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct or delete personal information we hold about you. Because we collect very
        little, this mainly applies to emails you send us. Contact us and we will help.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The “Last updated” date at the top shows when it last changed.</p>

      <h2>Contact</h2>
      {CONTACT_EMAIL ? (
        <p>
          Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      ) : (
        <p>
          Questions about this policy? Use the <a href="/contact">Contact page</a>.
        </p>
      )}
    </LegalPage>
  );
}
