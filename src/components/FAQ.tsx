import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is Content Connect?",
    answer: "Content Connect is a platform where vetted creators and unique stays collaborate through simple, structured partnerships — giving hosts a steady stream of professional content and giving creators access to exceptional places to stay."
  },
  {
    question: "How do I apply as a creator?",
    answer: "Click the 'Apply as a Creator' button and fill out our application form. We'll review your portfolio, engagement metrics, and professional experience. Our vetting process ensures we work with creators who understand the value of their work and can deliver professional content."
  },
  {
    question: "How do I apply as a host?",
    answer: "Click the 'Apply as a Host' button and provide details about your property. We look for unique hospitality spaces that are ready to collaborate with professional creators and understand the value of high-quality content."
  },
  {
    question: "Is this a free stay giveaway platform?",
    answer: "No. Content Connect is designed for professional collaborations with clear deliverables and expectations. Every partnership is a business relationship built on mutual respect and value exchange, not a giveaway."
  },
  {
    question: "What kind of creators do you work with?",
    answer: "We work with professional content creators, UGC specialists, and travel/lifestyle creators who have experience with structured brand work and are committed to delivering agreed-upon content. We prioritize quality over follower count."
  },
  {
    question: "When will the platform launch?",
    answer: "We're currently in early access mode with limited creator onboarding. Sign up for our email list to be notified when we open applications more broadly and when the full platform launches."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-24 px-6 bg-app-bg">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal text-center mb-12 md:mb-16">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card-bg rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-champagne"
              >
                <h3 className="text-base md:text-lg font-semibold text-charcoal pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-amber-gold flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-slate leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
