import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ApplicationType = "creator" | "host";
type Platform = "instagram" | "youtube" | "tiktok";

type PlatformConnectionData = {
  platform: Platform;
  username: string;
  profileUrl: string;
  followerCount?: string;
  profileImageUrl?: string;
  contentCategoryIndicators?: string;
};

type ApplicationSignupStore = {
  platformData: PlatformConnectionData | null;
  applicationType: ApplicationType | null;
  signupId: number | null;
  setPlatformConnectionData: (data: PlatformConnectionData, applicationType: ApplicationType, signupId: number) => void;
  clearSignupData: () => void;
  hasCompletedInitialSignup: () => boolean;
};

export const useApplicationSignupStore = create<ApplicationSignupStore>()(
  persist(
    (set, get) => ({
      platformData: null,
      applicationType: null,
      signupId: null,
      setPlatformConnectionData: (data, applicationType, signupId) => 
        set({ platformData: data, applicationType, signupId }),
      clearSignupData: () => 
        set({ platformData: null, applicationType: null, signupId: null }),
      hasCompletedInitialSignup: () => {
        const state = get();
        return state.platformData !== null && state.applicationType !== null && state.signupId !== null;
      },
    }),
    {
      name: "application-signup-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
