import { Link } from "@tanstack/react-router";
import { useCookieConsentStore } from "~/stores/cookieConsentStore";

export function CookieConsent() {
  const { consentStatus, setConsent } = useCookieConsentStore();

  // Don't render if user has already responded
  if (consentStatus !== null) {
    return null;
  }

  const handleAccept = () => {
    setConsent("accepted");
  };

  const handleReject = () => {
    setConsent("rejected");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal text-white shadow-lg border-t border-stone-grey/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex-1 pr-4">
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies.{" "}
              <Link
                to="/privacy"
                className="text-white underline hover:text-white/80 transition-colors"
              >
                Learn more
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm font-medium text-white/90 hover:text-white bg-transparent border border-white/30 hover:border-white/50 rounded-lg transition-all duration-200"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-sm font-medium text-white bg-btn-primary hover:bg-btn-hover rounded-lg transition-all duration-200 shadow-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
