import { useState, useMemo, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectCheckboxProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
}

export function MultiSelectCheckbox({
  options,
  value,
  onChange,
  placeholder = "Select options",
  searchable = true,
  error,
}: MultiSelectCheckboxProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  const displayText =
    value.length === 0
      ? placeholder
      : value.length === 1
      ? selectedLabels[0]
      : `${value.length} selected`;

  return (
    <div>
      <Listbox value={value} onChange={() => {}} multiple>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="relative w-full h-12 rounded-lg border border-warm-300 bg-white px-3 text-left focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500">
              <span
                className={`block truncate ${
                  value.length === 0 ? "text-warm-400" : "text-warm-700"
                }`}
              >
                {displayText}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                {value.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="pointer-events-auto rounded p-1 hover:bg-warm-100 mr-1"
                  >
                    <X className="h-4 w-4 text-warm-500" />
                  </button>
                ) : null}
                <ChevronDown
                  className={`h-5 w-5 text-warm-400 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {searchable && (
                  <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b border-warm-200">
                    <input
                      type="text"
                      className="w-full rounded-md border-warm-300 py-1.5 px-2 text-sm focus:border-sage-500 focus:ring-sage-500"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-warm-500">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      as={Fragment}
                    >
                      {({ active }) => (
                        <li
                          className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? "bg-sage-50" : ""
                          }`}
                          onClick={() => handleToggle(option.value)}
                        >
                          <span
                            className={`block truncate text-sm ${
                              value.includes(option.value)
                                ? "font-medium text-warm-900"
                                : "font-normal text-warm-700"
                            }`}
                          >
                            {option.label}
                          </span>
                          {value.includes(option.value) && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sage-600">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </li>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
