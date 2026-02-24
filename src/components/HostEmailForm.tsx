import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Home, CheckCircle } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export function HostEmailForm() {
  const trpc = useTRPC();
  const submitHostEmailMutation = useMutation(
    trpc.submitHostEmail.mutationOptions()
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      await submitHostEmailMutation.mutateAsync({
        email: data.email,
      });
      toast.success("Thanks for your interest! We'll be in touch soon.");
      reset();
    } catch (error: any) {
      if (error.message?.includes("already been submitted")) {
        toast.error("This email has already been submitted");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const benefits = [
    "Partner with vetted, professional creators",
    "Receive high-quality content for your property",
    "Structured collaborations with clear deliverables",
  ];

  return (
    <section className="bg-champagne py-12 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card-bg rounded-3xl shadow-xl p-6 md:p-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-champagne p-5 rounded-2xl shadow-sm">
                <Home className="w-12 h-12 md:w-14 md:h-14 text-btn-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Hosts: Get Involved
            </h2>
            <p className="text-base md:text-xl text-slate mb-8 max-w-2xl mx-auto leading-relaxed">
              Do you have a property perfect for content creators? Partner with us to host talented creators and showcase your space to engaged audiences.
            </p>
          </div>

          <div className="mb-10">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-champagne rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-olive-green flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-charcoal leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto">
            <div className="bg-champagne rounded-2xl p-4 md:p-6 shadow-sm">
              <label className="block text-sm font-semibold text-charcoal mb-3">
                Enter your email to get started
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className="w-full h-12 px-4 md:px-5 rounded-xl border-2 border-stone-grey focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:border-btn-primary text-base shadow-sm bg-white"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-terracotta text-left pl-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitHostEmailMutation.isPending}
                  className="h-14 px-6 md:px-8 bg-btn-primary hover:bg-btn-hover text-white font-bold rounded-xl transition-all duration-300 disabled:bg-slate/40 disabled:cursor-not-allowed whitespace-nowrap shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
                >
                  {submitHostEmailMutation.isPending ? "Sending..." : "Get in Touch"}
                </button>
              </div>
            </div>
            <p className="text-sm text-slate text-center mt-4">
              We'll contact you within 48 hours to discuss partnership opportunities
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
