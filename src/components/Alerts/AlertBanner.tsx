import React from "react";

import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";

// Define the type for the type prop
type AlertType = "error" | "success";

const AlertBanner = ({
  type,
  header,
  message,
}: {
  type: AlertType;
  header: string;
  message: string;
}) => {
  // Determine the classes based on the type of alert
  const baseClass = "rounded-md p-4 flex text-white";
  const typeClasses = {
    error: {
      container: "bg-red-600",
      icon: "text-red-100",
      IconComponent: XCircleIcon,
    },
    success: {
      container: "bg-green-600",
      icon: "text-green-100",
      IconComponent: CheckCircleIcon,
    },
  };

  // Select the correct classes and icon based on the type prop
  const { container, icon, IconComponent } =
    typeClasses[type] || typeClasses.error;

  return (
    <div className={`${baseClass} ${container}`}>
      <div className="flex-shrink-0">
        <IconComponent className={`h-5 w-5 ${icon}`} aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium">{header}</h3>
        <div className="mt-2 text-sm">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
