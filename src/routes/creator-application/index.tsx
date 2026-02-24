import { createFileRoute, Link } from "@tanstack/react-router";
import { CreatorApplicationForm } from "~/components/CreatorApplicationForm";
import { Logo } from "~/components/Logo";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/creator-application/")({
  component: CreatorApplicationPage,
});

function CreatorApplicationPage() {
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
      <CreatorApplicationForm 
        backLinkElement={backLinkElement} 
        logoElement={logoElement}
      />
    </div>
  );
}
