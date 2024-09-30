import CustomButton from "../Buttons/CustomButton";

export default function TableHeader({ header, description, onClick, buttonText }: { header: string; description: string; onClick: () => void; buttonText: string }) {
	return (
		<div className="sm:flex sm:items-center">
			<div className="sm:flex-auto">
				<h1 className="text-base font-semibold leading-6 text-gray-900">{header}</h1>
				<p className="mt-2 text-sm text-gray-700">
					{description}
				</p>
			</div>
			<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
				<CustomButton variant="primary" onClick={onClick}>
					{buttonText}
				</CustomButton>
			</div>
		</div>
	);
}
