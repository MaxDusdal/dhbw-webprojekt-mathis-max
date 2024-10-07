import { create } from "zustand";

interface DialogState {
	isOpen: boolean;
	type: string;
	dialogType: "information" | "confirmation";
	title: string;
	description: string;
	onConfirm: () => void;
	showDialog: (
		type: string,
		title: string,
		dialogType: "information" | "confirmation",
		description: string,
		onConfirm?: () => void,
	) => void;
	hideDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
	isOpen: false,
	type: "default",
	dialogType: "information",
	title: "",
	description: "",
	onConfirm: () => {},
	showDialog: (type, title, dialogType = "confirmation", description, onConfirm) =>
		set({
			isOpen: true,
			type,
			title,
			dialogType,
			description,
			onConfirm: onConfirm || undefined,
		}),
	hideDialog: () => set({ isOpen: false }),
}));

export default useDialogStore;
