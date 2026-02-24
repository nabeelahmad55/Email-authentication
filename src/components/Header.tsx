import { Logo } from "~/components/Logo";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = ["who-we-are", "how-it-works", "apply", "faq", "early-access"];
    
    // Map to track intersection ratios for all sections
    const sectionVisibility = new Map<string, number>();

    // Create IntersectionObserver with offset for sticky header
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Update visibility map for each observed section
        entries.forEach((entry) => {
          sectionVisibility.set(entry.target.id, entry.intersectionRatio);
        });

        // Find the section with the highest visibility
        let maxRatio = 0;
        let mostVisibleSection = "";
        
        sectionVisibility.forEach((ratio, sectionId) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleSection = sectionId;
          }
        });

        // Update active section if we found one with significant visibility
        if (mostVisibleSection && maxRatio > 0) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        // Root margin accounts for sticky header height (negative top margin)
        // This ensures sections are considered "active" when they're visible below the header
        rootMargin: "-80px 0px -50% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Manually set active section for immediate feedback
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false); // Close mobile menu
      
      // Dynamically calculate header height to account for different screen sizes
      const headerElement = document.querySelector('header');
      const headerHeight = headerElement ? headerElement.offsetHeight : 56;
      
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    setActiveSection("");
    setIsMobileMenuOpen(false); // Close mobile menu
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinkClasses = (sectionId: string) => {
    const isActive = activeSection === sectionId;
    return `text-ocean-blue hover:text-ocean-blue/80 font-medium transition-all duration-300 pb-1 ${
      isActive 
        ? "font-bold border-b-2 border-btn-primary" 
        : "border-b-2 border-transparent"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-app-bg/95 backdrop-blur-sm border-b-4 md:border-b border-charcoal/80 md:border-stone-grey/50">
      <div className="max-w-7xl mx-auto px-6 py-0 md:py-4 flex items-center justify-between">
        <Logo onClick={scrollToTop} className="md:ml-0" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("who-we-are")}
            className={navLinkClasses("who-we-are")}
          >
            Who We Are
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className={navLinkClasses("how-it-works")}
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className={navLinkClasses("faq")}
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection("early-access")}
            className={navLinkClasses("early-access")}
          >
            Stay Updated
          </button>
          <button
            onClick={() => scrollToSection("apply")}
            className="bg-btn-primary hover:bg-btn-hover text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
          >
            Apply
          </button>
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-champagne transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-charcoal" />
          ) : (
            <Menu className="w-6 h-6 text-charcoal" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-grey/50 bg-card-bg shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            <button
              onClick={() => scrollToSection("who-we-are")}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeSection === "who-we-are"
                  ? "bg-champagne text-ocean-blue font-semibold border-l-4 border-btn-primary"
                  : "text-ocean-blue hover:bg-champagne/50"
              }`}
            >
              Who We Are
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeSection === "how-it-works"
                  ? "bg-champagne text-ocean-blue font-semibold border-l-4 border-btn-primary"
                  : "text-ocean-blue hover:bg-champagne/50"
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeSection === "faq"
                  ? "bg-champagne text-ocean-blue font-semibold border-l-4 border-btn-primary"
                  : "text-ocean-blue hover:bg-champagne/50"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("early-access")}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeSection === "early-access"
                  ? "bg-champagne text-ocean-blue font-semibold border-l-4 border-btn-primary"
                  : "text-ocean-blue hover:bg-champagne/50"
              }`}
            >
              Stay Updated
            </button>
            <button
              onClick={() => scrollToSection("apply")}
              className="mt-3 bg-btn-primary hover:bg-btn-hover text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-center active:scale-95"
            >
              Apply
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
