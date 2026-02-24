import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";
import { Instagram, Music } from "lucide-react";
import { useApplicationSignupStore } from "~/stores/applicationSignupStore";

const profileHandleSchema = z.object({
  profileHandle: z.string().min(1, "Please enter your profile handle or link"),
});

type ProfileHandleFormData = z.infer<typeof profileHandleSchema>;

type InitialSignupFormProps = {
  applicationType: "creator" | "host";
  onSignupComplete: () => void;
};

export function InitialSignupForm({ applicationType, onSignupComplete }: InitialSignupFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "tiktok" | null>(null);
  const trpc = useTRPC();
  const setSignupData = useApplicationSignupStore((state) => state.setSignupData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileHandleFormData>({
    resolver: zodResolver(profileHandleSchema),
  });

  const initialSignupMutation = useMutation(
    trpc.initialSignup.mutationOptions({
      onSuccess: (data) => {
        setSignupData(data.platform, data.profileHandle, applicationType, data.signupId);
        toast.success("Connected! Let's continue with your application");
        onSignupComplete();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to connect. Please try again.");
      },
    })
  );

  const handlePlatformSelect = (platform: "instagram" | "tiktok") => {
    setSelectedPlatform(platform);
    reset();
  };

  const onSubmit = (data: ProfileHandleFormData) => {
    if (!selectedPlatform) return;
    
    initialSignupMutation.mutate({
      platform: selectedPlatform,
      profileHandle: data.profileHandle,
      applicationType,
    });
  };

  const handleBack = () => {
    setSelectedPlatform(null);
    reset();
  };

  // Platform selection view
  if (!selectedPlatform) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-charcoal mb-3">
            Connect Your Profile
          </h3>
          <p className="text-sm text-slate leading-relaxed">
            Choose your primary platform to get started
          </p>
        </div>

        <div className="space-y-4">
          {/* Instagram Button */}
          <button
            type="button"
            onClick={() => handlePlatformSelect("instagram")}
            className="w-full h-14 md:h-auto md:py-6 flex items-center justify-center gap-4 px-8 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white font-semibold text-base md:text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Instagram className="w-6 h-6" />
            </div>
            <span>Connect with Instagram</span>
          </button>

          {/* TikTok Button */}
          <button
            type="button"
            onClick={() => handlePlatformSelect("tiktok")}
            className="w-full h-14 md:h-auto md:py-6 flex items-center justify-center gap-4 px-8 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-semibold text-base md:text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Music className="w-6 h-6" />
            </div>
            <span>Connect with TikTok</span>
          </button>
        </div>

        <p className="text-xs text-center text-slate leading-relaxed pt-4">
          Your profile must be public for review. By continuing, you agree to our{" "}
          <span className="text-ocean-blue font-medium">Terms of Service</span> and{" "}
          <span className="text-ocean-blue font-medium">Privacy Policy</span>
        </p>
      </div>
    );
  }

  // Handle input view
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          selectedPlatform === "instagram" 
            ? "bg-gradient-to-br from-purple-100 to-pink-100" 
            : "bg-gradient-to-br from-gray-100 to-gray-200"
        }`}>
          {selectedPlatform === "instagram" ? (
            <Instagram className="w-8 h-8 text-purple-600" />
          ) : (
            <Music className="w-8 h-8 text-gray-900" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-charcoal mb-2">
          Enter Your {selectedPlatform === "instagram" ? "Instagram" : "TikTok"} Handle
        </h3>
        <p className="text-sm text-slate">
          We'll use this to review your content and connect with you
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate mb-2">
            Profile Handle or Link
          </label>
          <input
            type="text"
            {...register("profileHandle")}
            className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
            placeholder={selectedPlatform === "instagram" ? "@yourhandle or profile URL" : "@yourhandle or profile URL"}
            disabled={initialSignupMutation.isPending}
            autoFocus
          />
          <p className="mt-2 text-xs text-slate">
            Enter your @handle or paste your full profile link
          </p>
          {errors.profileHandle && (
            <p className="mt-2 text-sm text-terracotta">{errors.profileHandle.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={initialSignupMutation.isPending}
            className="flex-1 h-14 px-6 rounded-lg border-2 border-stone-grey text-slate font-semibold text-base md:text-lg hover:border-stone-grey/80 hover:bg-champagne transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={initialSignupMutation.isPending}
            className="flex-1 h-14 px-6 rounded-lg bg-btn-primary text-white font-semibold text-base md:text-lg hover:bg-btn-hover disabled:bg-slate/40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
          >
            {initialSignupMutation.isPending ? "Connecting..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
