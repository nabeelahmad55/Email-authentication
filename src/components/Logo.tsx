import React from "react";

interface LogoProps {
  size?: "default" | "small" | "footer";
  className?: string;
  onClick?: () => void;
}

export function Logo({ size = "default", className = "", onClick }: LogoProps) {
  // Separate styling for default (header) vs small (application form) sizes
  let containerHeightClasses = "h-20 md:h-16"; // Default for header
  let imageTransformClasses = "md:max-w-none md:scale-[4.84] md:origin-center md:translate-x-48"; // Header transform

  if (size === "small") {
    // Application form size: Make it 1.75x bigger on desktop (80px * 1.75 = 140px) -> Reduced to 98px (0.7x of 140px) -> Now increased to 107.8px (1.1x of 98px)
    containerHeightClasses = "h-24 md:h-[107.8px]"; 
    
    // Application form positioning: Adjust scaling and translation for proper alignment
    // With the size at 107.8px, we need to fine-tune the positioning so 't' of 'connect' aligns with 'e' of 'complete'
    // Scale at 2.02125 (1.8375 * 1.1), translation at -22 (-20 * 1.1)
    imageTransformClasses = "md:scale-[2.02125] md:origin-right md:-translate-x-22";
  } else if (size === "footer") {
    // Footer size: same scale factor as small, but centered (no horizontal translation)
    containerHeightClasses = "h-24 md:h-[107.8px]"; 
    imageTransformClasses = "md:scale-[2.02125] md:origin-center md:translate-x-0";
  }

  const content = (
    <div className={`flex items-center ${className}`}>
      <img
        src="/content-connect-logo-1.png"
        alt="Content Connect"
        className={`${containerHeightClasses} w-auto
          max-w-[132px]
          ${imageTransformClasses}
          transform-gpu`}
      />
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
        aria-label="Scroll to top"
      >
        {content}
      </button>
    );
  }

  return content;
}
