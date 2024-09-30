// utils/notification.js
import { toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastPosition } from 'react-toastify';

const defaultOptions = {
	position: "top-right",
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
};

export const notify = {
	success: (message: string, options = {}) => {
		toast.success(message, { ...defaultOptions, ...options } as ToastOptions);
	},
	error: (message: string, options = {}) => {
		toast.error(message, { ...defaultOptions, ...options } as ToastOptions);
	},
	info: (message: string, options = {}) => {
		toast.info(message, { ...defaultOptions, ...options } as ToastOptions);
	},
	warning: (message: string, options = {}) => {
		toast.warning(message, { ...defaultOptions, ...options } as ToastOptions);
	},
	custom: (message: string, options = {}) => {
		toast(message, { ...defaultOptions, ...options } as ToastOptions);
	},
	promise: (promise: Promise<any>, messages: any, options = {}) => {
		return toast.promise(
			promise,
			{
				pending: messages.pending || "Loading...",
				success: messages.success || "Success!",
				error: messages.error || "Error!",
			},
			{ ...defaultOptions, ...options } as ToastOptions,
		);
	},
};
