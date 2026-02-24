import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ConsentStatus = "accepted" | "rejected" | null;

type CookieConsentStore = {
  consentStatus: ConsentStatus;
  setConsent: (status: "accepted" | "rejected") => void;
  hasResponded: () => boolean;
};

export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set, get) => ({
      consentStatus: null,
      setConsent: (status) => set({ consentStatus: status }),
      hasResponded: () => get().consentStatus !== null,
    }),
    {
      name: "cookie-consent-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
