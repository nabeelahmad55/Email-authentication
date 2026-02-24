import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";
import { Instagram, Music, Youtube, ArrowRight } from "lucide-react";
import { useApplicationSignupStore } from "~/stores/applicationSignupStore";

const platformDataSchema = z.object({
  username: z.string().min(1, "Username or handle is required"),
  profileUrl: z.string().url("Please enter a valid URL").or(z.string().min(1)),
  followerCount: z.string().optional(),
});

type PlatformDataFormData = z.infer<typeof platformDataSchema>;

type PlatformConnectionFormProps = {
  onConnectionComplete: () => void;
};

export function PlatformConnectionForm({ onConnectionComplete }: PlatformConnectionFormProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<"instagram" | "youtube" | "tiktok" | null>(null);
  const trpc = useTRPC();
  const setPlatformConnectionData = useApplicationSignupStore((state) => state.setPlatformConnectionData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlatformDataFormData>({
    resolver: zodResolver(platformDataSchema),
  });

  const platformConnectionMutation = useMutation(
    trpc.platformConnection.mutationOptions({
      onSuccess: (data) => {
        setPlatformConnectionData(
          {
            platform: data.platform,
            username: data.username,
            profileUrl: data.profileUrl,
            followerCount: data.followerCount,
          },
          "creator",
          data.signupId
        );
        toast.success("Platform connected! Let's continue with your application");
        onConnectionComplete();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to connect. Please try again.");
      },
    })
  );

  const handlePlatformSelect = (platform: "instagram" | "youtube" | "tiktok") => {
    setSelectedPlatform(platform);
    reset();
  };

  const onSubmit = (data: PlatformDataFormData) => {
    if (!selectedPlatform) return;
    
    platformConnectionMutation.mutate({
      platform: selectedPlatform,
      username: data.username,
      profileUrl: data.profileUrl,
      followerCount: data.followerCount,
      applicationType: "creator",
    });
  };

  const handleBack = () => {
    setSelectedPlatform(null);
    reset();
  };

  const getPlatformPlaceholder = () => {
    switch (selectedPlatform) {
      case "instagram":
        return "instagram.com/yourhandle";
      case "youtube":
        return "youtube.com/@yourchannel";
      case "tiktok":
        return "tiktok.com/@yourhandle";
      default:
        return "";
    }
  };

  // Platform selection view
  if (!selectedPlatform) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-warm-600 leading-relaxed">
            Choose your primary content platform to get started
          </p>
        </div>

        <div className="space-y-3">
          {/* Instagram Button */}
          <button
            type="button"
            onClick={() => handlePlatformSelect("instagram")}
            className="group w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 border-warm-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Instagram className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-warm-900">Instagram</div>
                <div className="text-sm text-warm-500">Connect your Instagram profile</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-warm-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </button>

          {/* YouTube Button */}
          <button
            type="button"
            onClick={() => handlePlatformSelect("youtube")}
            className="group w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 border-warm-200 bg-white hover:border-red-300 hover:bg-red-50/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <Youtube className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-warm-900">YouTube</div>
                <div className="text-sm text-warm-500">Connect your YouTube channel</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-warm-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </button>

          {/* TikTok Button */}
          <button
            type="button"
            onClick={() => handlePlatformSelect("tiktok")}
            className="group w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 border-warm-200 bg-white hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Music className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-left">
                <div className="font-medium text-warm-900">TikTok</div>
                <div className="text-sm text-warm-500">Connect your TikTok profile</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-warm-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    );
  }

  // Profile data input view
  const platformConfig = {
    instagram: {
      name: "Instagram",
      icon: Instagram,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      accentColor: "purple",
    },
    youtube: {
      name: "YouTube",
      icon: Youtube,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      accentColor: "red",
    },
    tiktok: {
      name: "TikTok",
      icon: Music,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-700",
      accentColor: "gray",
    },
  };

  const config = platformConfig[selectedPlatform];
  const Icon = config.icon;

  return (
    <div className="space-y-8">
      {/* Platform header */}
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-warm-900 mb-1">
            {config.name} Profile
          </h3>
          <p className="text-sm text-warm-600">
            Enter your profile details to continue
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-warm-900 mb-2">
            Username or Handle
          </label>
          <input
            id="username"
            type="text"
            {...register("username")}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 placeholder:text-warm-400 transition-all"
            placeholder="yourhandle"
            disabled={platformConnectionMutation.isPending}
            autoFocus
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Profile URL field */}
        <div>
          <label htmlFor="profileUrl" className="block text-sm font-medium text-warm-900 mb-2">
            Profile URL
          </label>
          <input
            id="profileUrl"
            type="text"
            {...register("profileUrl")}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 placeholder:text-warm-400 transition-all"
            placeholder={getPlatformPlaceholder()}
            disabled={platformConnectionMutation.isPending}
          />
          {errors.profileUrl && (
            <p className="mt-2 text-sm text-red-600">{errors.profileUrl.message}</p>
          )}
        </div>

        {/* Follower count field */}
        <div>
          <label htmlFor="followerCount" className="block text-sm font-medium text-warm-900 mb-2">
            Follower/Subscriber Count <span className="text-warm-500 font-normal">(Optional)</span>
          </label>
          <input
            id="followerCount"
            type="text"
            {...register("followerCount")}
            className="w-full px-4 py-3 rounded-lg border border-warm-300 bg-white focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 placeholder:text-warm-400 transition-all"
            placeholder="e.g., 25k, 100k, 1M"
            disabled={platformConnectionMutation.isPending}
          />
          <p className="mt-2 text-xs text-warm-500">
            Approximate count is fine
          </p>
          {errors.followerCount && (
            <p className="mt-2 text-sm text-red-600">{errors.followerCount.message}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={platformConnectionMutation.isPending}
            className="px-6 py-3 rounded-lg border-2 border-warm-300 text-warm-700 font-medium hover:border-warm-400 hover:bg-warm-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={platformConnectionMutation.isPending}
            className="flex-1 px-6 py-3 rounded-lg bg-sage-600 text-white font-medium hover:bg-sage-700 disabled:bg-warm-300 disabled:cursor-not-allowed transition-all duration-200"
          >
            {platformConnectionMutation.isPending ? "Connecting..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
