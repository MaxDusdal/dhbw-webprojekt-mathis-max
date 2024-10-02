import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex cursor-default items-center justify-between py-4">
      <span>{label}</span>
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleDecrease}
          className="rounded-full p-1 text-gray-400 ring-1 ring-gray-400 transition-colors hover:text-black hover:ring-black disabled:text-gray-200 disabled:ring-gray-200"
          disabled={value <= min}
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="mx-2 min-w-[24px] text-center">{value}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="rounded-full p-1 text-gray-400 ring-1 ring-gray-400 transition-colors hover:text-black hover:ring-black disabled:text-gray-200 disabled:ring-gray-200"
          disabled={value >= max}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
