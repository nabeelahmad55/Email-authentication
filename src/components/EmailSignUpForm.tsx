import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export function EmailSignUpForm() {
  const trpc = useTRPC();
  const subscribeEmailMutation = useMutation(
    trpc.subscribeEmail.mutationOptions()
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
      await subscribeEmailMutation.mutateAsync({
        email: data.email,
      });
      toast.success("Thanks for subscribing! We'll keep you updated.");
      reset();
    } catch (error: any) {
      if (error.message?.includes("already subscribed")) {
        toast.error("This email is already subscribed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="bg-champagne py-10 md:py-20 px-6 border-y border-stone-grey/50">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-card-bg p-4 rounded-full shadow-sm">
            <Mail className="w-12 h-12 text-btn-primary" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 md:mb-6">
          Stay Updated
        </h2>
        <p className="text-base md:text-xl text-slate mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
          Be the first to know when we launch. Get exclusive updates and early access opportunities.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
          <div className="flex flex-col gap-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full h-12 md:h-auto px-4 md:py-3 rounded-full border border-stone-grey focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:border-btn-primary shadow-sm bg-white text-base"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-terracotta text-left pl-4">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={subscribeEmailMutation.isPending}
              className="h-12 md:h-auto px-8 md:py-3 bg-btn-primary hover:bg-btn-hover text-white font-semibold rounded-full transition-all duration-300 disabled:bg-slate/40 disabled:cursor-not-allowed whitespace-nowrap shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
            >
              {subscribeEmailMutation.isPending ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
