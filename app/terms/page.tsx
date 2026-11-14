import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms for using the ${SITE_NAME} Creator Toolkit.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" intro={`By using ${SITE_NAME}, you agree to these terms. If you do not agree, please do not use the site.`}>
      <h2>Using the tools</h2>
      <p>
        The tools on this site are provided free of charge for personal and business use. Please use them lawfully and do not try to disrupt, overload or
        misuse the site.
      </p>

      <h2>Suggestions, not guarantees</h2>
      <p>
        Bios, hashtags and other output are automatically generated suggestions. We do not guarantee any result, such as more followers, reach or income.
        Review and edit everything before you publish it, and make sure it is accurate and appropriate for your audience.
      </p>

      <h2>Your content and responsibility</h2>
      <p>
        You are responsible for what you publish and for following the rules of the platforms you use, such as Instagram, YouTube and TikTok. Output
        you generate is yours to edit and use on your own profiles.
      </p>

      <h2>No affiliation with other platforms</h2>
      <p>
        {SITE_NAME} is an independent website. Instagram, YouTube, TikTok and other names are trademarks of their respective owners. We are not
        affiliated with, endorsed by or sponsored by them.
      </p>

      <h2>Our content</h2>
      <p>The site’s design, text and code belong to {SITE_NAME}. Please do not copy or republish them without permission.</p>

      <h2>Availability and changes</h2>
      <p>We may change, pause or remove tools and features at any time. Features marked “coming soon” may change or may not be released.</p>

      <h2>Disclaimer and limitation of liability</h2>
      <p>
        The site and its tools are provided “as is”, without warranties of any kind. To the extent permitted by law, we are not liable for any loss or
        damage that arises from using the site or relying on its output.
      </p>

      <h2>Advertising and links</h2>
      <p>The site may show advertising and may link to third-party websites. We do not control third-party content and are not responsible for it.</p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms. Continued use of the site after a change means you accept the updated terms.</p>

      <h2>Contact</h2>
      {CONTACT_EMAIL ? (
        <p>
          Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      ) : (
        <p>
          Questions about these terms? Use the <a href="/contact">Contact page</a>.
        </p>
      )}
    </LegalPage>
  );
}
