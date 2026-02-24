import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-app-bg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-app-bg/80 via-app-bg/90 to-app-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6 md:py-16 text-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-charcoal mb-4 md:mb-6 tracking-tight leading-tight">
          The smarter way creators and stays collaborate.
        </h1>

        <p className="text-xl sm:text-2xl md:text-2xl text-slate mb-8 md:mb-10 max-w-4xl mx-auto leading-relaxed">
          Content Connect matches vetted creators with hotels and unique stays so they can collaborate on high quality content through hosted experiences.
        </p>

        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
          <Link
            to="/creator-application"
            className="group inline-flex items-center justify-between gap-3 bg-btn-primary hover:bg-btn-hover text-white px-8 sm:px-10 h-14 sm:h-auto sm:py-5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2 w-full sm:w-80"
          >
            Apply as a Creator
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/host-application"
            className="group inline-flex items-center justify-between gap-3 bg-btn-primary hover:bg-btn-hover text-white px-8 sm:px-10 h-14 sm:h-auto sm:py-5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl sm:transform sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-btn-primary/30 focus:ring-offset-2 w-full sm:w-80"
          >
            Apply as a Host
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
