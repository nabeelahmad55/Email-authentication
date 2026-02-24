import { ReactNode } from "react";

interface ApplicationLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  backLinkElement?: ReactNode;
  logoElement?: ReactNode;
}

export function ApplicationLayout({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  backLinkElement,
  logoElement,
}: ApplicationLayoutProps) {
  return (
    <div className="min-h-screen bg-app-bg pt-5 pb-12 px-4 md:px-6">
      <div className="max-w-[800px] mx-auto">
        <div className="bg-champagne rounded-2xl border border-stone-grey/60 p-8 md:p-12">
          {/* Back to home link and logo - positioned side by side at the top */}
          {(backLinkElement || logoElement) && (
            <div className="mb-4 flex items-center justify-between">
              {backLinkElement && <div>{backLinkElement}</div>}
              {logoElement && <div>{logoElement}</div>}
            </div>
          )}
          
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs font-medium text-slate">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index + 1 === currentStep
                      ? "bg-btn-primary"
                      : index + 1 < currentStep
                      ? "bg-btn-primary/60"
                      : "bg-stone-grey"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-charcoal tracking-tight mb-2">
              {title}
            </h1>
            
            {subtitle && (
              <p className="text-slate leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
