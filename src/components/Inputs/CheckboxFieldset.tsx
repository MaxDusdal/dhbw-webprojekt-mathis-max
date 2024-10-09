import React from "react";

const CheckboxItem = ({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (id: string) => void;
}) => (
  <div className="relative flex items-start">
    <div className="flex h-6 items-center">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.id)
        }
        aria-describedby={`${id}-description`}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
    </div>
    <div className="ml-3 text-sm leading-6">
      <label htmlFor={id} className="font-medium text-gray-900">
        {label}
      </label>
      <p id={`${id}-description`} className="text-gray-500">
        {description}
      </p>
    </div>
  </div>
);

const CheckboxFieldset = ({
  legend,
  items,
  values,
  onChange,
}: {
  legend: string;
  items: { id: string; label: string; description: string }[];
  values: { [key: string]: boolean };
  onChange: (id: string) => void;
}) => {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="space-y-5">
        {items.map((item) => (
          <CheckboxItem
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            checked={values[item.id] || false}
            onChange={() => onChange(item.id)}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default CheckboxFieldset;
