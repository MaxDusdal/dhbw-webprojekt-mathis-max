import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  PlusCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import CustomButton from "../Buttons/CustomButton";

import { type DialogTypes } from "@/utils/types";

/**
 * Reusable confirmation dialog component, used to confirm actions before executing them.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is open or not
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onConfirm - Function to execute the action after confirming
 * @param {string} props.title - Title of the dialog
 * @param {string} props.description - Description of the dialog
 * @param {('create'|'destructive'|'default')} [props.type='default'] - Type of dialog, affects styling
 * @param {string} [props.confirmButtonText] - Custom text for the confirm button
 * @returns {JSX.Element}
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "default",
  confirmButtonText,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: DialogTypes;
  confirmButtonText?: string;
}) => {
  const dialogStyles = {
    create: {
      icon: PlusCircleIcon,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      confirmButtonVariant: "primary",
      confirmButtonText: "Erstellen",
    },
    destructive: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      confirmButtonVariant: "warning",
      confirmButtonText: "Löschen",
    },
    cancel: {
      icon: ExclamationTriangleIcon,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-100",
      confirmButtonVariant: "warning",
      confirmButtonText: "Abbrechen",
    },
    default: {
      icon: InformationCircleIcon,
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-100",
      confirmButtonVariant: "primary",
      confirmButtonText: "Bestätigen",
    },
  };

  const {
    icon: Icon,
    iconColor,
    iconBgColor,
    confirmButtonVariant,
    confirmButtonText: defaultConfirmText,
  } = dialogStyles[type];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-[1000]" onClose={onClose}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor} sm:mx-0 sm:h-10 sm:w-10`}
                    >
                      <Icon
                        className={`h-6 w-6 ${iconColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {title}
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <CustomButton
                    type="button"
                    onClick={onConfirm}
                    variant={
                      confirmButtonVariant as
                        | "primary"
                        | "secondary"
                        | "tertiary"
                        | "warning"
                        | "disabled"
                    }
                    className="sm:ml-3"
                  >
                    {confirmButtonText || defaultConfirmText}
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                  >
                    Abbrechen
                  </CustomButton>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationDialog;
