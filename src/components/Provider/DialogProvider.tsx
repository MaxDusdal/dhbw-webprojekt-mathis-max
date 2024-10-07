// components/DialogProvider.jsx
"use client";
import ConfirmationDialog from "../Dialogs/ConfirmationDialog";
import useDialogStore from "~/stores/dialogStore";
import InformationDialog from "../Dialogs/InformationDialog";

const DialogProvider = ({ children }: { children: React.ReactNode }) => {
	const { isOpen, type, title, dialogType, description, onConfirm, hideDialog } = useDialogStore();

	return (
		<>
			{children}
			<ConfirmationDialog
				isOpen={isOpen && dialogType === "confirmation"}
				type={type as "default" | "cancel" | "create" | "destructive"}
				onClose={hideDialog}
				onConfirm={() => {
					onConfirm();
					hideDialog();
				}}
				title={title}
				description={description}
			/>
			<InformationDialog
				isOpen={isOpen && dialogType === "information"}
				onClose={hideDialog}
				title={title}
				description={description}
			/>
		</>
	);
};

export default DialogProvider;
