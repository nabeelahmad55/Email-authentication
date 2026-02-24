import { createFileRoute, Link } from "@tanstack/react-router";
import { HostApplicationForm } from "~/components/HostApplicationForm";
import { ArrowLeft } from "lucide-react";
import { Logo } from "~/components/Logo";

export const Route = createFileRoute("/host-application/")({
  component: HostApplicationPage,
});

function HostApplicationPage() {
  const logoElement = <Logo size="small" />;
  
  const backLinkElement = (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-warm-700 hover:text-sage-700 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-medium">Back to home</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Form Component - now receives header elements */}
      <HostApplicationForm backLinkElement={backLinkElement} logoElement={logoElement} />
    </div>
  );
}
