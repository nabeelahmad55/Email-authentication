import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";
import { Youtube, Instagram, Music2 } from "lucide-react";

export const Route = createFileRoute("/apply/")({
  component: ApplyPage,
});

// Curated list of popular countries and their major cities
const LOCATIONS = {
  "United States": ["New York", "Los Angeles", "Miami", "Chicago", "San Francisco", "Austin", "Seattle"],
  "United Kingdom": ["London", "Manchester", "Edinburgh", "Bristol", "Liverpool"],
  "Spain": ["Barcelona", "Madrid", "Valencia", "Seville", "Málaga"],
  "France": ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux"],
  "Italy": ["Rome", "Milan", "Florence", "Venice", "Naples"],
  "Portugal": ["Lisbon", "Porto", "Faro", "Coimbra"],
  "Greece": ["Athens", "Santorini", "Mykonos", "Thessaloniki", "Crete"],
  "Mexico": ["Mexico City", "Tulum", "Playa del Carmen", "Guadalajara", "Oaxaca"],
  "Thailand": ["Bangkok", "Chiang Mai", "Phuket", "Krabi", "Koh Samui"],
  "Indonesia": ["Bali", "Jakarta", "Yogyakarta", "Lombok"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  "Japan": ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Sapporo"],
  "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"],
  "Dubai": ["Dubai City", "Abu Dhabi"],
  "Singapore": ["Singapore"],
  "Switzerland": ["Zurich", "Geneva", "Lucerne", "Bern", "Interlaken"],
  "Austria": ["Vienna", "Salzburg", "Innsbruck"],
  "Croatia": ["Dubrovnik", "Split", "Zagreb", "Hvar"],
  "Turkey": ["Istanbul", "Cappadocia", "Antalya", "Bodrum"],
  "Morocco": ["Marrakech", "Casablanca", "Fez", "Tangier"],
  "South Africa": ["Cape Town", "Johannesburg", "Durban"],
  "Brazil": ["Rio de Janeiro", "São Paulo", "Salvador", "Florianópolis"],
  "Argentina": ["Buenos Aires", "Mendoza", "Bariloche"],
  "Colombia": ["Bogotá", "Medellín", "Cartagena"],
  "Costa Rica": ["San José", "Tamarindo", "Manuel Antonio"],
  "Peru": ["Lima", "Cusco", "Arequipa"],
  "Iceland": ["Reykjavik"],
  "Norway": ["Oslo", "Bergen", "Tromsø"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö"],
  "Denmark": ["Copenhagen", "Aarhus"],
  "New Zealand": ["Auckland", "Wellington", "Queenstown", "Christchurch"],
} as const;

const hostFormSchema = z.object({
  propertyWebsiteOrListingLink: z.string().min(1, "Website or booking link is required"),
  businessOrPropertyName: z.string().min(1, "Business name is required"),
  propertyType: z.string().min(1, "Business type is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  primaryContactFullName: z.string().min(1, "First and last name is required"),
  contactEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Conditions",
  }),
});

type HostFormData = z.infer<typeof hostFormSchema>;

const businessTypeOptions = [
  "Hotel",
  "Resort",
  "Vacation rental",
  "Boutique stay",
  "Bed & Breakfast",
  "Hostel",
  "Other",
];

function ApplyPage() {
  const [showHostForm, setShowHostForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const trpc = useTRPC();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<HostFormData>({
    resolver: zodResolver(hostFormSchema),
    defaultValues: {
      propertyWebsiteOrListingLink: "",
      businessOrPropertyName: "",
      propertyType: "",
      country: "",
      city: "",
      primaryContactFullName: "",
      contactEmail: "",
      phoneNumber: "",
      agreedToTerms: false,
    },
  });

  const selectedCountry = watch("country");

  const submitMutation = useMutation(
    trpc.submitHostApplication.mutationOptions({
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit application");
      },
    })
  );

  const onSubmit = (data: HostFormData) => {
    // Submit with required fields and some defaults for optional fields
    submitMutation.mutate({
      ...data,
      primaryContactRole: "Owner", // Default value
      amenities: [], // Default empty array
      collaborationObjectives: "Interested in working with content creators", // Default value
      previousCreatorExperience: false,
      informationAccurate: true, // Implied by submitting
    });
  };

  const handleHostButtonClick = () => {
    setShowHostForm(true);
    // Scroll to form after a brief delay to allow render
    setTimeout(() => {
      const formElement = document.getElementById("host-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-gray-600"
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Application Submitted
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Thank you! Our team will review your application and get back to you soon.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setShowHostForm(false);
            }}
            className="text-gray-700 hover:text-gray-800 font-medium transition-colors"
          >
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main content container */}
      <div className="w-full max-w-[460px] mx-auto px-4 pt-[80px]">
        {/* Header Block */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-gray-900 mb-3">
            Apply to CC
          </h1>
          <p className="text-base text-[#666666] max-w-[400px] mx-auto leading-relaxed">
            Track your collaborations, and connect with hosts around the world
          </p>
        </div>

        {/* Primary Apply Buttons */}
        <div className="space-y-4 mb-10">
          <Link
            to="/creator-application"
            className="block w-full h-12 rounded-lg bg-black text-white font-semibold text-base hover:bg-gray-900 transition-colors flex items-center justify-center"
          >
            Apply as a Creator
          </Link>
          <button
            onClick={handleHostButtonClick}
            className="block w-full h-12 rounded-lg bg-black text-white font-semibold text-base hover:bg-gray-900 transition-colors"
          >
            Apply as a Host
          </button>
        </div>

        {/* Social Apply Section */}
        <div className="mb-10">
          <p className="text-sm text-[#666666] text-center mb-4">
            Apply with
          </p>
          <div className="flex gap-2 justify-center flex-wrap max-[480px]:flex-col max-[480px]:items-center">
            <button
              className="w-[120px] max-[480px]:w-full h-11 rounded-lg border border-[#DDDDDD] bg-white text-black font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              onClick={() => toast.error("Social application coming soon")}
            >
              <Youtube className="w-5 h-5" />
              YouTube
            </button>
            <button
              className="w-[120px] max-[480px]:w-full h-11 rounded-lg border border-[#DDDDDD] bg-white text-black font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              onClick={() => toast.error("Social application coming soon")}
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </button>
            <button
              className="w-[120px] max-[480px]:w-full h-11 rounded-lg border border-[#DDDDDD] bg-white text-black font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              onClick={() => toast.error("Social application coming soon")}
            >
              <Music2 className="w-5 h-5" />
              TikTok
            </button>
          </div>
        </div>

        {/* Host Application Form (conditionally shown) */}
        {showHostForm && (
          <div id="host-form" className="mb-16">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Website / Booking Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website / Booking Link
                </label>
                <input
                  type="url"
                  {...register("propertyWebsiteOrListingLink")}
                  className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black placeholder:text-gray-400"
                  placeholder="https://"
                />
                {errors.propertyWebsiteOrListingLink && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.propertyWebsiteOrListingLink.message}
                  </p>
                )}
              </div>

              {/* Business name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business name
                </label>
                <input
                  type="text"
                  {...register("businessOrPropertyName")}
                  className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black placeholder:text-gray-400"
                  placeholder="Enter business name"
                />
                {errors.businessOrPropertyName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessOrPropertyName.message}
                  </p>
                )}
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  {...register("propertyType")}
                  className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black text-gray-700"
                >
                  <option value="">Select business type</option>
                  {businessTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        // Reset city when country changes
                        setValue("city", "");
                      }}
                      className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black text-gray-700"
                    >
                      <option value="">Select country</option>
                      {Object.keys(LOCATIONS).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => {
                    const cities = selectedCountry ? LOCATIONS[selectedCountry as keyof typeof LOCATIONS] || [] : [];
                    const isDisabled = !selectedCountry || cities.length === 0;
                    
                    return (
                      <select
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isDisabled}
                        className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {isDisabled ? "Select country first" : "Select city"}
                        </option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    );
                  }}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Your name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  {...register("primaryContactFullName")}
                  className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black placeholder:text-gray-400"
                  placeholder="First and last name"
                />
                {errors.primaryContactFullName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.primaryContactFullName.message}
                  </p>
                )}
              </div>

              {/* Email address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  {...register("contactEmail")}
                  className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black placeholder:text-gray-400"
                  placeholder="your@email.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              {/* Phone no. */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone no.
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full h-12 rounded-md border border-[#DDDDDD] focus:border-black focus:ring-black placeholder:text-gray-400"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("agreedToTerms")}
                    className="mt-0.5 rounded border-[#DDDDDD] text-black focus:ring-black focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I agree to the Terms and Conditions
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="mt-2 text-sm text-red-600 ml-7">
                    {errors.agreedToTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full h-12 rounded-lg bg-black text-white font-semibold text-base hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submitMutation.isPending ? "Submitting..." : "Apply"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pb-8 text-center">
          <p className="text-xs text-[#999999]">
            © 2024 CC. All Rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
