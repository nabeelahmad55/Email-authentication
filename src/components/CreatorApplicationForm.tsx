import { useState, ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { LocationSelector } from "~/components/LocationSelector";
import { ApplicationLayout } from "~/components/ApplicationLayout";
import { useApplicationSignupStore } from "~/stores/applicationSignupStore";
import { COUNTRIES } from "~/data/countries";

// Form schema matching the new requirements
const creatorFormSchema = z.object({
  // PAGE 1 - Basic Creator Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  age: z.number().min(18, "You must be at least 18 years old").max(120, "Please enter a valid age"),
  country: z.string().min(1, "Country is required"),
  primaryPlatform: z.enum(["Instagram", "TikTok"], {
    errorMap: () => ({ message: "Please select a platform" }),
  }),
  creatorType: z.enum(["Content Creator", "Influencer", "Photographer/Videographer", "UGC Creator"], {
    errorMap: () => ({ message: "Please select a creator type" }),
  }),
  
  // PAGE 2 - Platform & Audience Snapshot
  platformUsername: z.string().optional(),
  averageViews: z.string().optional(),
  topAudienceLocation: z.string().optional(),
  topAudienceAgeRange: z.string().optional(),
  
  // PAGE 3 - Declaration
  informationAccurate: z.boolean().refine((val) => val === true, {
    message: "You must confirm your information is accurate",
  }),
});

type CreatorFormData = z.infer<typeof creatorFormSchema>;

interface CreatorApplicationFormProps {
  backLinkElement: ReactNode;
  logoElement?: ReactNode;
}

const ageRangeOptions = [
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45+", label: "45+" },
];

export function CreatorApplicationForm({ backLinkElement, logoElement }: CreatorApplicationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const trpc = useTRPC();
  
  const clearSignupData = useApplicationSignupStore((state) => state.clearSignupData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
    watch,
  } = useForm<CreatorFormData>({
    resolver: zodResolver(creatorFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: undefined,
      country: "",
      primaryPlatform: undefined,
      creatorType: undefined,
      platformUsername: "",
      averageViews: "",
      topAudienceLocation: "",
      topAudienceAgeRange: undefined,
      informationAccurate: false,
    },
  });

  const selectedPlatform = watch("primaryPlatform");

  const submitMutation = useMutation(
    trpc.submitCreatorApplication.mutationOptions({
      onSuccess: () => {
        clearSignupData();
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit application");
      },
    })
  );

  const handleContinue = async () => {
    let fieldsToValidate: (keyof CreatorFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "age", "country", "primaryPlatform", "creatorType"];
    } else if (currentStep === 2) {
      // Page 2 fields are optional, no validation needed
      fieldsToValidate = [];
    }
    
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmit = (data: CreatorFormData) => {
    submitMutation.mutate(data);
  };

  // Success State
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-card-bg rounded-lg p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-olive-green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-charcoal mb-3">
            Application Submitted
          </h2>
          <p className="text-base text-slate mb-8">
            Our team will review your application and follow up via email.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ocean-blue hover:text-ocean-blue/80 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ApplicationLayout
      currentStep={currentStep}
      totalSteps={3}
      title="Creator Application"
      subtitle={
        currentStep === 1 ? "Let's start with your basic information" :
        currentStep === 2 ? "Tell us about your platform and audience" :
        "Review and confirm your application"
      }
      backLinkElement={backLinkElement}
      logoElement={logoElement}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* PAGE 1: BASIC CREATOR INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-sm text-terracotta">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-sm text-terracotta">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full h-12 max-w-md rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-terracotta">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Age
                </label>
                <input
                  type="number"
                  {...register("age", { 
                    valueAsNumber: true,
                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10)
                  })}
                  min="18"
                  max="120"
                  onKeyDown={(e) => {
                    // Prevent non-numeric characters
                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                      e.preventDefault();
                    }
                  }}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="18"
                />
                <p className="mt-1.5 text-xs text-slate">
                  Must be 18+
                </p>
                {errors.age && (
                  <p className="mt-1.5 text-sm text-terracotta">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Country
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <LocationSelector
                      selectedCountry={field.value}
                      onCountryChange={field.onChange}
                      error={errors.country?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Primary Platform
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-stone-grey cursor-pointer hover:border-btn-primary hover:bg-champagne/30 transition-all">
                  <input
                    type="radio"
                    {...register("primaryPlatform")}
                    value="Instagram"
                    className="text-btn-primary focus:ring-btn-primary"
                  />
                  <div className="font-medium text-charcoal">Instagram</div>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-stone-grey cursor-pointer hover:border-btn-primary hover:bg-champagne/30 transition-all">
                  <input
                    type="radio"
                    {...register("primaryPlatform")}
                    value="TikTok"
                    className="text-btn-primary focus:ring-btn-primary"
                  />
                  <div className="font-medium text-charcoal">TikTok</div>
                </label>
              </div>
              <p className="mt-2 text-xs text-slate italic">
                Other platforms available in the future
              </p>
              {errors.primaryPlatform && (
                <p className="mt-1.5 text-sm text-terracotta">{errors.primaryPlatform.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Creator Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-stone-grey cursor-pointer hover:border-btn-primary hover:bg-champagne/30 transition-all text-center min-h-[100px]">
                  <input
                    type="radio"
                    {...register("creatorType")}
                    value="Content Creator"
                    className="text-btn-primary focus:ring-btn-primary"
                  />
                  <div>
                    <div className="font-medium text-charcoal text-sm">Content Creator</div>
                    <div className="text-xs text-slate mt-1">Engaging content</div>
                  </div>
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-stone-grey cursor-pointer hover:border-btn-primary hover:bg-champagne/30 transition-all text-center min-h-[100px]">
                  <input
                    type="radio"
                    {...register("creatorType")}
                    value="Influencer"
                    className="text-btn-primary focus:ring-btn-primary"
                  />
                  <div>
                    <div className="font-medium text-charcoal text-sm">Influencer</div>
                    <div className="text-xs text-slate mt-1">Audience reach</div>
                  </div>
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-stone-grey cursor-pointer hover:border-btn-primary hover:bg-champagne/30 transition-all text-center min-h-[100px]">
                  <input
                    type="radio"
                    {...register("creatorType")}
                    value="Photographer/Videographer"
                    className="text-btn-primary focus:ring-btn-primary"
                  />
                  <div>
                    <div className="font-medium text-charcoal text-sm">Photo/Video</div>
                    <div className="text-xs text-slate mt-1">Professional media</div>
                  </div>
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-stone-grey cursor-pointer hover:border-btn-primary hover:bg-champagne/30 transition-all text-center min-h-[100px]">
                  <input
                    type="radio"
                    {...register("creatorType")}
                    value="UGC Creator"
                    className="text-btn-primary focus:ring-btn-primary"
                  />
                  <div>
                    <div className="font-medium text-charcoal text-sm">UGC Creator</div>
                    <div className="text-xs text-slate mt-1">Brand content</div>
                  </div>
                </label>
              </div>
              {errors.creatorType && (
                <p className="mt-1.5 text-sm text-terracotta">{errors.creatorType.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full px-6 h-14 rounded-lg bg-btn-primary text-white font-medium hover:bg-btn-hover transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        )}

        {/* PAGE 2: PLATFORM & AUDIENCE SNAPSHOT */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="bg-champagne border border-stone-grey/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-ocean-blue flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>You'll be asked to upload screenshots to verify this information.</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                {selectedPlatform} Username
              </label>
              {selectedPlatform === "TikTok" ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate font-medium">@</span>
                  <input
                    type="text"
                    {...register("platformUsername")}
                    className="w-full h-12 pl-8 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                    placeholder="username"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  {...register("platformUsername")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="username (no @ or links)"
                />
              )}
              <p className="mt-1.5 text-xs text-slate">
                {selectedPlatform === "TikTok" ? "Enter your username without the @ symbol" : "Enter your username without the @ symbol"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Average Views (Last 28-30 Days)
              </label>
              <input
                type="text"
                {...register("averageViews")}
                onKeyDown={(e) => {
                  // Only allow numbers, backspace, delete, arrow keys
                  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="e.g., 50000, 100000, 1000000"
              />
              <p className="mt-1.5 text-xs text-slate">
                Enter numbers only (approximate is fine)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Top Audience Location
              </label>
              <select
                {...register("topAudienceLocation")}
                className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary text-charcoal"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate">
                Country where most of your audience is located
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Top Audience Age Range
              </label>
              <select
                {...register("topAudienceAgeRange")}
                className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary text-charcoal"
              >
                <option value="">Select age range</option>
                {ageRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 h-14 rounded-lg border-2 border-stone-grey text-slate font-medium hover:border-stone-grey/80 hover:bg-champagne transition-all duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 px-6 h-14 rounded-lg bg-btn-primary text-white font-medium hover:bg-btn-hover transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DECLARATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-champagne rounded-lg p-5 border border-stone-grey/50">
              <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-3">
                Application Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate">Name:</span>
                  <span className="text-charcoal font-medium">{watch("firstName")} {watch("lastName")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Email:</span>
                  <span className="text-charcoal font-medium">{watch("email")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Country:</span>
                  <span className="text-charcoal font-medium">{watch("country")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Platform:</span>
                  <span className="text-charcoal font-medium">{watch("primaryPlatform")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Creator Type:</span>
                  <span className="text-charcoal font-medium">{watch("creatorType")}</span>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-champagne border border-stone-grey/50 rounded-lg p-4">
              <p className="text-sm text-ocean-blue">
                Your data is used only for creator review and is never shared publicly.
              </p>
            </div>

            {/* Confirmation */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("informationAccurate")}
                  className="mt-0.5 rounded border-stone-grey text-btn-primary focus:ring-btn-primary focus:ring-offset-0"
                />
                <span className="text-sm text-charcoal leading-relaxed">
                  I confirm that all information provided is accurate and I may be asked to verify it later.
                </span>
              </label>
              {errors.informationAccurate && (
                <p className="text-sm text-terracotta ml-8">
                  {errors.informationAccurate.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 h-14 rounded-lg border-2 border-stone-grey text-slate font-medium hover:border-stone-grey/80 hover:bg-champagne transition-all duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex-1 px-6 h-14 rounded-lg bg-btn-primary text-white font-medium hover:bg-btn-hover disabled:bg-slate/40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        )}
      </form>
    </ApplicationLayout>
  );
}
