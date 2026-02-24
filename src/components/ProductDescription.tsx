import { Sparkles, Shield, Handshake, TrendingUp, Eye, Users, Wallet } from "lucide-react";

export function ProductDescription() {
  return (
    <section className="bg-app-bg py-10 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 md:mb-6">
            What is Content Connect?
          </h2>
          <p className="text-base md:text-xl text-slate max-w-3xl mx-auto leading-relaxed">
            Content Connect brings vetted creators and unique stays together through clear, well managed collaborations that provide hosts with ongoing quality content and give creators access to standout stays.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-btn-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">
              For Hosts — Consistent, High-Quality Content
            </h3>
            <p className="text-sm md:text-base text-slate leading-relaxed">
              Access trusted creators on demand and keep your social media filled with fresh photo and video content. Every collaboration is planned in advance, so you always know what you're receiving and how it can be used.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center">
                <Handshake className="w-8 h-8 text-btn-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">
              For Creators — Stay, Create, Grow
            </h3>
            <p className="text-sm md:text-base text-slate leading-relaxed">
              Discover beautiful properties and secure hosted stays with clear deliverables and no guesswork. Focus on creating your best work in inspiring locations.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-champagne rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-btn-primary" />
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-charcoal mb-3">
              Clear & Protected Collaborations
            </h3>
            <p className="text-sm md:text-base text-slate leading-relaxed">
              Every partnership runs through a structured system with agreed deliverables, communication tools, and support — protecting both sides and keeping expectations aligned.
            </p>
          </div>
        </div>

        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-4">
              📣 Social Media & Bookings
            </h2>
            <p className="text-base md:text-lg text-slate max-w-3xl mx-auto leading-relaxed">
              Travellers increasingly choose hotels based on what they see and trust online.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="bg-card-bg rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-champagne rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-btn-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-btn-primary mb-2">70%</div>
                  <p className="text-base md:text-lg text-charcoal font-semibold mb-2">
                    of bookings are influenced by social media
                  </p>
                  <p className="text-sm md:text-base text-slate">
                    Travellers increasingly choose hotels based on what they see and trust online.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-champagne rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 md:w-7 md:h-7 text-btn-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-btn-primary mb-2">63%</div>
                  <p className="text-base md:text-lg text-charcoal font-semibold mb-2">
                    Visual content drives action
                  </p>
                  <p className="text-sm md:text-base text-slate">
                    Guests are up to 63% more likely to book after seeing strong photo and video content.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-champagne rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 md:w-7 md:h-7 text-btn-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-btn-primary mb-2">3×</div>
                  <p className="text-base md:text-lg text-charcoal font-semibold mb-2">
                    Active social pages win more direct bookings
                  </p>
                  <p className="text-sm md:text-base text-slate">
                    Hotels with high engagement can be up to 3× more likely to get booked directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card-bg rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-champagne rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 md:w-7 md:h-7 text-btn-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-btn-primary mb-2">80–90%</div>
                  <p className="text-base md:text-lg text-charcoal font-semibold mb-2">
                    A smarter way to get content
                  </p>
                  <p className="text-sm md:text-base text-slate">
                    Hotels using Content Connect often cut their creator marketing spend by around 80–90% while still getting regular, high-quality content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 lg:p-12">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-charcoal mb-4 text-center">
            Why Content Connect is Unique
          </h3>
          <p className="text-base md:text-lg text-slate text-center max-w-3xl mx-auto leading-relaxed">
            Content Connect is designed for creators and hospitality brands who value quality. Every collaboration is carefully considered so the content produced feels intentional, on brand, and valuable for both sides.
          </p>
        </div>
      </div>
    </section>
  );
}
