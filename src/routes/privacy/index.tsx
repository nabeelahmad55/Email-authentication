import { createFileRoute, Link } from "@tanstack/react-router";
import Markdown from "markdown-to-jsx";
import { Footer } from "~/components/Footer";
import { Logo } from "~/components/Logo";
import privacyPolicyContent from "~/data/privacy-policy.md?raw";

export const Route = createFileRoute("/privacy/")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[980px] mx-auto px-6 py-6">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-[980px] mx-auto px-6 py-16 md:py-24">
          <article className="prose prose-lg max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h1:text-5xl prose-h1:mb-4 prose-h1:mt-0 prose-h1:text-gray-900
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-gray-900 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[17px]
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-6 prose-ul:text-gray-700
            prose-ol:my-6 prose-ol:text-gray-700
            prose-li:my-2 prose-li:text-[17px]
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-hr:border-gray-300 prose-hr:my-12">
            <Markdown>{privacyPolicyContent}</Markdown>
          </article>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
