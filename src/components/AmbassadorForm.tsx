import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import toast from "react-hot-toast";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

const ambassadorFormSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  location: z.string().min(1, "Location is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
});

type AmbassadorFormData = z.infer<typeof ambassadorFormSchema>;

const experienceLevelOptions = [
  "New to hosting",
  "Some experience",
  "Experienced host",
  "Professional hospitality",
];

export function AmbassadorForm() {
  const trpc = useTRPC();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AmbassadorFormData>({
    resolver: zodResolver(ambassadorFormSchema),
  });

  const submitMutation = useMutation(
    trpc.submitAmbassadorApplication.mutationOptions({
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit application");
      },
    })
  );

  const onSubmit = (data: AmbassadorFormData) => {
    submitMutation.mutate(data);
  };

  // Success State
  if (isSubmitted) {
    return (
      <section className="py-12 md:py-24 px-6 bg-champagne min-h-[600px] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg p-8 text-center shadow-sm">
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
            Thanks for your interest! Our team will review your application and get in touch via email.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ocean-blue hover:text-ocean-blue/80 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-24 px-6 bg-champagne">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-4">
            Become an Ambassador
          </h2>
          <p className="text-base text-slate">
            Are you a host interested in collaborating with creators? Join our
            ambassador program.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl p-6 md:p-10 shadow-sm space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Full Name *
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="w-full h-12 rounded-xl border-stone-grey shadow-sm focus:border-amber-gold focus:ring-amber-gold placeholder:text-slate/60"
              placeholder="Your name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-terracotta">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Email Address *
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full h-12 rounded-xl border-stone-grey shadow-sm focus:border-amber-gold focus:ring-amber-gold placeholder:text-slate/60"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-terracotta">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Location *
            </label>
            <input
              type="text"
              {...register("location")}
              className="w-full h-12 rounded-xl border-stone-grey shadow-sm focus:border-amber-gold focus:ring-amber-gold placeholder:text-slate/60"
              placeholder="City, Country"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-terracotta">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Experience Level *
            </label>
            <select
              {...register("experienceLevel")}
              className="w-full h-12 rounded-xl border-stone-grey shadow-sm focus:border-amber-gold focus:ring-amber-gold text-charcoal"
            >
              <option value="">Select experience level</option>
              {experienceLevelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.experienceLevel && (
              <p className="mt-1 text-sm text-terracotta">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full h-14 bg-amber-gold hover:bg-amber-gold-dark disabled:bg-slate/40 text-white rounded-xl text-base font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-gold/30 focus:ring-offset-2"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </section>
  );
}
