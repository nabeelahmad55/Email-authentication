import { Check, X } from "lucide-react";

export function WhoItsFor() {
  const forList = [
    "Professional creators",
    "UGC specialists",
    "Travel & lifestyle content creators",
    "Structured brand work experience",
    "Commitment to deliverables",
  ];

  const notForList = [
    "One-time giveaway seekers",
    "Casual influencers",
    "Unstructured stay expectations",
    "No-deliverable arrangements",
  ];

  return (
    <section className="py-12 md:py-24 px-6 bg-champagne">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-center mb-12 md:mb-16">
          Audience
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* For */}
          <div className="bg-card-bg rounded-3xl p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-champagne rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-btn-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-charcoal">For</h3>
            </div>
            <ul className="space-y-4">
              {forList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-olive-green mt-0.5 flex-shrink-0" />
                  <span className="text-slate">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not For */}
          <div className="bg-card-bg rounded-3xl p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-stone-grey rounded-xl flex items-center justify-center">
                <X className="w-6 h-6 text-slate" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-charcoal">Not For</h3>
            </div>
            <ul className="space-y-4">
              {notForList.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-slate mt-0.5 flex-shrink-0" />
                  <span className="text-slate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
