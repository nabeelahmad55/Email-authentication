import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "~/components/Header";
import { Hero } from "~/components/Hero";
import { ProductDescription } from "~/components/ProductDescription";
import { HowItWorks } from "~/components/HowItWorks";
import { FAQ } from "~/components/FAQ";
import { EmailSignUpForm } from "~/components/EmailSignUpForm";
import { Footer } from "~/components/Footer";
import { MobileStickyCTA } from "~/components/MobileStickyCTA";

import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header />
      <Hero />
      <div id="who-we-are">
        <ProductDescription />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="apply" className="py-10 md:py-20 px-6 bg-app-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-slate max-w-2xl mx-auto leading-relaxed">
              Join Content Connect and start forming meaningful, high-value collaborations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            <div className="bg-card-bg rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold text-charcoal mb-3">
                For Creators
              </h3>
              <p className="text-slate mb-6 leading-relaxed flex-grow">
                Access exceptional stays and work with hospitality brands through structured, professional partnerships designed for serious creators.
              </p>
              <Link
                to="/creator-application"
                className="group inline-flex items-center justify-center gap-2 w-full bg-btn-primary hover:bg-btn-hover text-white px-6 h-12 md:h-auto md:py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                Apply as a Creator
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold text-charcoal mb-3">
                For Hosts
              </h3>
              <p className="text-slate mb-6 leading-relaxed flex-grow">
                Partner with vetted creators to showcase your space with high-quality content.
              </p>
              <Link
                to="/host-application"
                className="group inline-flex items-center justify-center gap-2 w-full bg-btn-primary hover:bg-btn-hover text-white px-6 h-12 md:h-auto md:py-4 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2"
              >
                Apply as a Host
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <div id="early-access">
        <EmailSignUpForm />
      </div>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
