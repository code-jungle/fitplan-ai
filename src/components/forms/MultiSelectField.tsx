import React from 'react';

interface MultiSelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  required = false,
  className = ''
}) => {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-white/90 text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedValues.includes(option.value)
                ? 'bg-mint-500 text-white border-mint-500 shadow-lg'
                : 'bg-slate-800 text-white/90 hover:bg-slate-700 hover:text-white border-white/20'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-red-400 text-xs mt-1 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
