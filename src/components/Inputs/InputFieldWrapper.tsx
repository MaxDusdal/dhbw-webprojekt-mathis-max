import React from 'react';

const InputFieldWrapper = ({ id, label = "", className = "", children }: { id: string; label: string; className?: string; children: React.ReactNode }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 mt-4 block text-left text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
};

export default InputFieldWrapper;
