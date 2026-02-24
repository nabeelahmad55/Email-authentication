import { useState, ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LocationSelector } from "~/components/LocationSelector";
import { MultiSelectCheckbox } from "~/components/MultiSelectCheckbox";
import { ApplicationLayout } from "~/components/ApplicationLayout";
import { useApplicationSignupStore } from "~/stores/applicationSignupStore";

const hostFormSchema = z.object({
  // Step 1 - Business Information
  businessOrPropertyName: z.string().min(1, "Business or property name is required"),
  propertyType: z.string().min(1, "Property type is required"),
  propertyWebsiteOrListingLink: z.string().min(1, "Website or listing link is required"),
  country: z.string().min(1, "Country is required"),
  
  // Step 2 - Contact Information
  contactEmail: z.string().email("Valid email is required"),
  primaryContactFullName: z.string().min(1, "Full name is required"),
  phoneNumber: z.string().optional(),
  primaryContactRole: z.string().min(1, "Role is required"),
  otherRoleDescription: z.string().optional(),
  
  // Step 3 - Property Details
  numberOfRoomsOrUnits: z.number().optional().or(z.string().optional()),
  targetGuestType: z.string().optional(),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  peakSeasons: z.string().optional(),
  
  // Step 4 - Collaboration Goals
  collaborationObjectives: z.string().min(1, "Collaboration objectives are required"),
  additionalNotes: z.string().optional(),
  previousCreatorExperience: z.boolean(),
  
  // Confirmations
  informationAccurate: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Privacy Policy",
  }),
}).refine((data) => {
  // If role is "Other", otherRoleDescription is required
  if (data.primaryContactRole === "Other") {
    return !!data.otherRoleDescription && data.otherRoleDescription.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify your role",
  path: ["otherRoleDescription"],
});

type HostFormData = z.infer<typeof hostFormSchema>;

interface HostApplicationFormProps {
  backLinkElement: ReactNode;
  logoElement: ReactNode;
}

const propertyTypeOptions = [
  "Hotel",
  "Resort",
  "Vacation rental",
  "Boutique stay",
];

const roleOptions = [
  "Owner",
  "Manager",
  "Marketing",
  "Other",
];

const amenitiesOptions = [
  { value: "pool", label: "Pool" },
  { value: "spa", label: "Spa/Wellness" },
  { value: "restaurant", label: "Restaurant/Bar" },
  { value: "gym", label: "Gym/Fitness" },
  { value: "beach-access", label: "Beach Access" },
  { value: "mountain-view", label: "Mountain View" },
  { value: "city-view", label: "City View" },
  { value: "pet-friendly", label: "Pet Friendly" },
  { value: "family-friendly", label: "Family Friendly" },
  { value: "wifi", label: "High-Speed WiFi" },
  { value: "parking", label: "Parking" },
  { value: "unique-design", label: "Unique Design/Architecture" },
];

export function HostApplicationForm({ backLinkElement, logoElement }: HostApplicationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const trpc = useTRPC();
  
  const clearSignupData = useApplicationSignupStore((state) => state.clearSignupData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
    watch,
  } = useForm<HostFormData>({
    resolver: zodResolver(hostFormSchema),
    mode: "onChange",
    defaultValues: {
      contactEmail: "",
      country: "",
      amenities: [],
      previousCreatorExperience: false,
      informationAccurate: false,
      agreedToTerms: false,
      otherRoleDescription: "",
    },
  });

  const submitMutation = useMutation(
    trpc.submitHostApplication.mutationOptions({
      onSuccess: () => {
        clearSignupData();
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit application");
      },
    })
  );

  const selectedRole = watch("primaryContactRole");

  const handleContinue = async () => {
    let fieldsToValidate: (keyof HostFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["businessOrPropertyName", "propertyType", "propertyWebsiteOrListingLink", "country"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["contactEmail", "primaryContactFullName", "primaryContactRole"];
      // Add otherRoleDescription validation if role is "Other"
      if (selectedRole === "Other") {
        fieldsToValidate.push("otherRoleDescription");
      }
    } else if (currentStep === 3) {
      fieldsToValidate = ["amenities"];
    } else if (currentStep === 4) {
      fieldsToValidate = ["collaborationObjectives"];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const onSubmit = (data: HostFormData) => {
    // Convert numberOfRoomsOrUnits to number if it's a string
    const numberOfRoomsOrUnits = data.numberOfRoomsOrUnits 
      ? (typeof data.numberOfRoomsOrUnits === 'string' ? parseInt(data.numberOfRoomsOrUnits) : data.numberOfRoomsOrUnits)
      : undefined;

    submitMutation.mutate({
      ...data,
      numberOfRoomsOrUnits,
      otherRoleDescription: data.primaryContactRole === "Other" ? data.otherRoleDescription : undefined,
    });
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
            Our team will review your application and follow up.
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
      totalSteps={5}
      title="Host Application"
      subtitle={currentStep === 5 ? "Review your application" : `Complete your profile`}
      backLinkElement={backLinkElement}
      logoElement={logoElement}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* STEP 1: BUSINESS INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-charcoal tracking-wide uppercase">
              Business Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Business or Property Name
              </label>
              <input
                type="text"
                {...register("businessOrPropertyName")}
                className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="Enter property name"
              />
              {errors.businessOrPropertyName && (
                <p className="mt-2 text-sm text-terracotta">{errors.businessOrPropertyName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Property Type
                </label>
                <select
                  {...register("propertyType")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary text-charcoal"
                >
                  <option value="">Select property type</option>
                  {propertyTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="mt-2 text-sm text-terracotta">{errors.propertyType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">
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
              <label className="block text-sm font-medium text-slate mb-2">
                Website or Listing Link
              </label>
              <input
                type="url"
                {...register("propertyWebsiteOrListingLink")}
                className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="https://"
              />
              <p className="mt-2 text-xs text-slate">
                Official website or primary listing page
              </p>
              {errors.propertyWebsiteOrListingLink && (
                <p className="mt-2 text-sm text-terracotta">
                  {errors.propertyWebsiteOrListingLink.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full px-6 h-14 rounded-lg bg-btn-primary text-white font-medium text-base hover:bg-btn-hover transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: CONTACT INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-charcoal tracking-wide uppercase">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Business Email
                </label>
                <input
                  type="email"
                  {...register("contactEmail")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="your@email.com"
                />
                {errors.contactEmail && (
                  <p className="mt-2 text-sm text-terracotta">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("primaryContactFullName")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="Enter full name"
                />
                {errors.primaryContactFullName && (
                  <p className="mt-2 text-sm text-terracotta">
                    {errors.primaryContactFullName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="+1 (555) 000-0000"
                />
                <p className="mt-2 text-xs text-slate">
                  For quick communication
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Role at Property
                </label>
                <select
                  {...register("primaryContactRole")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary text-charcoal"
                >
                  <option value="">Select role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.primaryContactRole && (
                  <p className="mt-2 text-sm text-terracotta">
                    {errors.primaryContactRole.message}
                  </p>
                )}
              </div>
            </div>

            {selectedRole === "Other" && (
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Please specify your role
                </label>
                <input
                  type="text"
                  {...register("otherRoleDescription")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="e.g., Director of Operations, Sales Manager"
                />
                {errors.otherRoleDescription && (
                  <p className="mt-2 text-sm text-terracotta">
                    {errors.otherRoleDescription.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 h-14 rounded-lg border-2 border-stone-grey text-slate font-medium text-base hover:border-stone-grey/80 hover:bg-champagne transition-all duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 px-6 h-14 rounded-lg bg-btn-primary text-white font-medium text-base hover:bg-btn-hover transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROPERTY DETAILS */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-charcoal tracking-wide uppercase">
              Property Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Number of Rooms/Units (Optional)
                </label>
                <input
                  type="number"
                  {...register("numberOfRoomsOrUnits")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="e.g., 10"
                  min="1"
                />
                <p className="mt-2 text-xs text-slate">
                  Total accommodations
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate mb-2">
                  Target Guest Type (Optional)
                </label>
                <input
                  type="text"
                  {...register("targetGuestType")}
                  className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                  placeholder="e.g., Couples, Families"
                />
                <p className="mt-2 text-xs text-slate">
                  Who stays here?
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Amenities
              </label>
              <Controller
                name="amenities"
                control={control}
                render={({ field }) => (
                  <MultiSelectCheckbox
                    options={amenitiesOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select amenities"
                    error={errors.amenities?.message}
                  />
                )}
              />
              <p className="mt-2 text-xs text-slate">
                Select all that apply
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Peak Seasons (Optional)
              </label>
              <input
                type="text"
                {...register("peakSeasons")}
                className="w-full h-12 rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="e.g., Summer (June-August)"
              />
              <p className="mt-2 text-xs text-slate">
                When is your property most popular?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 h-14 rounded-lg border-2 border-stone-grey text-slate font-medium text-base hover:border-stone-grey/80 hover:bg-champagne transition-all duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 px-6 h-14 rounded-lg bg-btn-primary text-white font-medium text-base hover:bg-btn-hover transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: COLLABORATION GOALS */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-charcoal tracking-wide uppercase">
              Collaboration Goals
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Objectives for Working with Creators
              </label>
              <textarea
                {...register("collaborationObjectives")}
                rows={4}
                className="w-full rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="e.g., Increase brand awareness, showcase unique features, reach new audiences..."
              />
              <p className="mt-2 text-xs text-slate">
                What do you hope to achieve?
              </p>
              {errors.collaborationObjectives && (
                <p className="mt-2 text-sm text-terracotta">
                  {errors.collaborationObjectives.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register("additionalNotes")}
                rows={3}
                className="w-full rounded-lg border-stone-grey focus:border-btn-primary focus:ring-btn-primary placeholder:text-slate/60"
                placeholder="Share any additional information or questions..."
              />
              <p className="mt-2 text-xs text-slate">
                Anything else you'd like us to know
              </p>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("previousCreatorExperience")}
                  className="mt-0.5 rounded border-stone-grey text-btn-primary focus:ring-btn-primary focus:ring-offset-0"
                />
                <span className="text-sm text-slate leading-relaxed">
                  We have previous experience working with creators
                </span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 h-14 rounded-lg border-2 border-stone-grey text-slate font-medium text-base hover:border-stone-grey/80 hover:bg-champagne transition-all duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 px-6 h-14 rounded-lg bg-btn-primary text-white font-medium text-base hover:bg-btn-hover transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                Review Application
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="mb-2">
              <p className="text-base text-slate leading-relaxed">
                Review your application before submitting
              </p>
            </div>

            {/* Business Info Section */}
            <div className="bg-card-bg/50 rounded-lg p-4 border border-stone-grey/50">
              <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-3">
                Business Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate">Property Name:</span>
                  <span className="text-charcoal font-medium">{watch("businessOrPropertyName")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Property Type:</span>
                  <span className="text-charcoal font-medium">{watch("propertyType")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Location:</span>
                  <span className="text-charcoal font-medium">{watch("country")}</span>
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="bg-card-bg/50 rounded-lg p-4 border border-stone-grey/50">
              <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-3">
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate">Name:</span>
                  <span className="text-charcoal font-medium">{watch("primaryContactFullName")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Email:</span>
                  <span className="text-charcoal font-medium">{watch("contactEmail")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Role:</span>
                  <span className="text-charcoal font-medium">
                    {watch("primaryContactRole")}
                    {watch("primaryContactRole") === "Other" && watch("otherRoleDescription") && 
                      ` (${watch("otherRoleDescription")})`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="bg-card-bg/50 rounded-lg p-4 border border-stone-grey/50">
              <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-3">
                Property Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate">Amenities:</span>
                  <span className="text-charcoal font-medium">{watch("amenities").length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Previous Experience:</span>
                  <span className="text-charcoal font-medium">{watch("previousCreatorExperience") ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("informationAccurate")}
                  className="mt-0.5 rounded border-stone-grey text-btn-primary focus:ring-btn-primary focus:ring-offset-0"
                />
                <span className="text-sm text-slate leading-relaxed">
                  I confirm that all information provided is accurate
                </span>
              </label>
              {errors.informationAccurate && (
                <p className="text-sm text-terracotta ml-8">
                  {errors.informationAccurate.message}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("agreedToTerms")}
                  className="mt-0.5 rounded border-stone-grey text-btn-primary focus:ring-btn-primary focus:ring-offset-0"
                />
                <span className="text-sm text-slate leading-relaxed">
                  I agree to the{" "}
                  <span className="text-ocean-blue font-medium">Terms & Privacy Policy</span>
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-sm text-terracotta ml-8">
                  {errors.agreedToTerms.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-6 h-14 rounded-lg border-2 border-stone-grey text-slate font-medium text-base hover:border-stone-grey/80 hover:bg-card-bg/50 transition-all duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="flex-1 px-6 h-14 rounded-lg bg-btn-primary text-white font-medium text-base hover:bg-btn-hover disabled:bg-slate/40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
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
