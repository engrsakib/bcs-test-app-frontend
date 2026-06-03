import type { Metadata } from "next";
import { PRIVACY_POLICY_HTML } from "@/content/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy | MCQ Analysis",
  description:
    "Privacy policy for the MCQ Analysis mobile application and related services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <article
        className="privacy-policy mx-auto max-w-3xl text-[15px] leading-relaxed text-gray-800 [&_a]:text-teal-700 [&_a]:underline [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY_HTML }}
      />
    </main>
  );
}
