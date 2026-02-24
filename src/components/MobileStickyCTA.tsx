import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("section"); // First section is Hero
      const applySection = document.getElementById("apply");
      
      if (!heroSection || !applySection) return;

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const applyTop = applySection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Show CTA when scrolled past hero and before reaching apply section
      const pastHero = heroBottom < windowHeight * 0.3;
      const beforeApply = applyTop > windowHeight * 0.5;

      setIsVisible(pastHero && beforeApply);
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToApply = () => {
    const applySection = document.getElementById("apply");
    if (applySection) {
      applySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-app-bg via-app-bg to-transparent pointer-events-none">
      <button
        onClick={scrollToApply}
        className="w-full h-14 bg-btn-primary hover:bg-btn-hover text-white rounded-full font-semibold text-base shadow-lg flex items-center justify-center gap-2 transition-all duration-300 pointer-events-auto active:scale-95"
      >
        Apply for Early Access
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
