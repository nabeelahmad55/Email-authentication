import { COUNTRIES } from "~/data/countries";

interface LocationSelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  error?: string;
}

export function LocationSelector({
  selectedCountry,
  onCountryChange,
  error,
}: LocationSelectorProps) {
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      {/* Country Selection */}
      <div>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="w-full h-12 rounded-lg border-warm-300 focus:border-sage-500 focus:ring-sage-500 text-warm-700"
        >
          <option value="">Select country</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
