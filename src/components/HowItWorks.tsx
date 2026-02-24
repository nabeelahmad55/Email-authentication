import { FileText, Users, Camera } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Apply",
      description: "Create your profile and set your collaboration preferences",
    },
    {
      icon: Users,
      title: "Match",
      description: "We align creators with the right stays",
    },
    {
      icon: Camera,
      title: "Create",
      description: "Deliver agreed content in a focused environment",
    },
  ];

  return (
    <section className="py-12 md:py-24 px-6 bg-app-bg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-center mb-12 md:mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-card-bg rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 text-center md:text-left"
            >
              <div className="w-16 h-16 bg-champagne rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <step.icon className="w-8 h-8 text-btn-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-charcoal mb-4">
                {step.title}
              </h3>
              <p className="text-slate leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
