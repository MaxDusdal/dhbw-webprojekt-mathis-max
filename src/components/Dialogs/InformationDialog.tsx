import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import CustomButton from "../Buttons/CustomButton";

export default function InformationDialog({
	isOpen,
	onClose,
	title,
	description,
}: {
	isOpen: boolean;
	onClose: React.Dispatch<React.SetStateAction<boolean>>;
	title: string;
	description: string;
}) {
	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-[1000]">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
					>
						<div>
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
								<InformationCircleIcon aria-hidden="true" className="h-6 w-6 text-blue-600" />
							</div>
							<div className="mt-3 text-center sm:mt-5">
								<DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
									{title}
								</DialogTitle>
								<div className="mt-2">
									<p className="text-sm text-gray-500">{description}</p>
								</div>
							</div>
						</div>
						<div className="mt-5 sm:mt-6">
							<CustomButton variant="secondary" onClick={() => onClose(false)}>
								Ok
							</CustomButton>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
