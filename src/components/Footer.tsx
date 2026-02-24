import { Logo } from "~/components/Logo";
import { Instagram } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-btn-primary text-white/80 py-3 md:py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6 md:gap-12">
          {/* Logo and Launch Text Section */}
          <div className="flex flex-col items-center text-center">
            <Logo size="footer" className="mb-3 md:mb-4 !h-20 md:!h-[107.8px]" />
            <p className="text-base md:text-lg font-semibold text-white/90 tracking-wide">Launching Soon</p>
          </div>

          {/* Social Links and Navigation Section */}
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/contentconnecthq"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="https://www.tiktok.com/@contentconnecthq"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
                aria-label="Follow us on TikTok"
              >
                <img src="/tiktok-logo.svg" alt="TikTok" className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            </div>
            
            {/* Privacy Policy Link */}
            <div className="flex gap-6 text-sm md:text-base">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Content Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
