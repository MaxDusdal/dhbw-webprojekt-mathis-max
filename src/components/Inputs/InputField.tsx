import React, { useState } from "react";
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";

type InputFieldProps = {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<any>;
  error?: FieldError;
  rows?: number;
  resizable?: boolean;
  registerOptions?: RegisterOptions;
};

const InputField = ({
  id,
  name,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  register,
  error,
  rows = 3,
  resizable = false,
  registerOptions = {},
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses =
    "block w-full rounded-md shadow-sm focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6";
  const validClasses =
    "border-0 ring-1 ring-inset ring-gray-300 text-gray-900 placeholder:text-gray-400";
  const invalidClasses =
    "border-0 ring-1 ring-inset ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500";
  const resizableClasses = resizable ? "resize-y" : "resize-none";
  const disabledClasses = disabled
    ? "bg-gray-100 ring-gray-400 text-gray-400 cursor-not-allowed"
    : "";

  const inputClasses = `${baseClasses} ${error ? invalidClasses : validClasses} ${disabledClasses} ${type === "password" ? "pr-10" : ""}`;

  // TODO: Fix the type of the register function, i lost hours on this and can't find the solution, future me please help
  // @ts-ignore
  const { onChange, onBlur, ref, ...restRegister } = register(name, {
    ...registerOptions,
    // @ts-ignore
    valueAsNumber: type === "number",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value =
      type === "number"
        ? e.target.value === ""
          ? ""
          : Number(e.target.value)
        : e.target.value;
    onChange({
      target: {
        name,
        value,
      },
    } as any);
  };

  const commonProps = {
    id,
    name,
    onChange: handleChange,
    onBlur,
    ref,
    placeholder,
    disabled,
    className: inputClasses,
    "aria-invalid": error ? true : false,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="relative rounded-md shadow-sm">
        {type === "textarea" ? (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${commonProps.className} ${resizableClasses}`}
          />
        ) : (
          <input
            {...commonProps}
            type={type === "password" && showPassword ? "text" : type}
          />
        )}
        {error && (
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center ${type === "password" ? "pr-10" : "pr-3"}`}
          >
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeSlashIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
