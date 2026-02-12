"use client";

import { useState } from "react";

// Example: Loading Spinner
export function LoadingSpinner() {
	return (
		<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
			<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
				Loading...
			</span>
		</div>
	);
}

// Example: Balance Card
export function BalanceCard({
	balance,
	label,
}: {
	balance: string;
	label: string;
}) {
	return (
		<div className="bg-black text-white rounded-lg p-6 shadow-sm border border-black">
			<p className="text-white/60 text-sm mb-2 uppercase tracking-wide font-medium">
				{label}
			</p>
			<p className="text-4xl font-bold tracking-tight">{balance}</p>
		</div>
	);
}

// Example: Transaction Item
export function TransactionItem({
	type,
	amount,
	asset,
	date,
	hash,
	explorerLink,
}: {
	type: string;
	amount?: string;
	asset?: string;
	date: string;
	hash: string;
	explorerLink: string;
}) {
	return (
		<div className="group border-b border-gray-100 last:border-0 py-4 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-lg">
			<div className="flex justify-between items-start mb-1">
				<div>
					<p className="font-semibold text-sm">
						{type === "payment" ? "💸" : "📝"} {type}
					</p>
					{amount && (
						<p className="text-black font-medium text-sm mt-1">
							{amount} {asset || "XLM"}
						</p>
					)}
				</div>

				<a
					href={explorerLink}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs font-mono text-gray-400 group-hover:text-black transition-colors border border-gray-200 group-hover:border-black rounded px-2 py-1">
					View →
				</a>
			</div>
			<div className="flex justify-between text-xs text-gray-400 mt-2">
				<span>{new Date(date).toLocaleString()}</span>
				<span className="font-mono">{hash.slice(0, 8)}...</span>
			</div>
		</div>
	);
}

// Example: Copy to Clipboard Button
export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			onClick={handleCopy}
			className="text-gray-500 hover:text-black text-xs font-medium transition-colors">
			{copied ? "✓ Copied" : "Copy"}
		</button>
	);
}

// Example: Alert/Toast Component
export function Alert({
	type,
	message,
	onClose,
}: {
	type: "success" | "error" | "info";
	message: string;
	onClose: () => void;
}) {
	return (
		<div
			className={`${
				type === "success"
					? "bg-black text-white"
					: type === "error"
						? "bg-red-600 text-white"
						: "bg-gray-100 text-black"
			} px-4 py-3 rounded-lg text-sm flex justify-between items-center`}>
			<span>{message}</span>
			<button onClick={onClose} className="ml-4 opacity-60 hover:opacity-100">
				✕
			</button>
		</div>
	);
}

// Example: Card Component
export function Card({
	title,
	children,
}: {
	title?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
			{title && (
				<h2 className="text-xl font-bold text-black mb-6 border-b border-gray-100 pb-4">
					{title}
				</h2>
			)}
			{children}
		</div>
	);
}

// Example: Input Component
export function Input({
	label,
	placeholder,
	type = "text",
	value,
	onChange,
	error,
}: {
	label: string;
	placeholder?: string;
	type?: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
}) {
	return (
		<div>
			<label className="block text-black text-sm font-medium mb-1.5">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
			/>
			{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
		</div>
	);
}

// Example: Button Component
export function Button({
	children,
	onClick,
	variant = "primary",
	disabled = false,
	fullWidth = false,
}: {
	children: React.ReactNode;
	onClick: () => void;
	variant?: "primary" | "secondary" | "danger";
	disabled?: boolean;
	fullWidth?: boolean;
}) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${
				variant === "primary"
					? "bg-black text-white hover:bg-gray-800"
					: variant === "danger"
						? "bg-red-600 text-white hover:bg-red-700"
						: "bg-white text-black border border-gray-200 hover:border-black"
			} ${
				fullWidth ? "w-full" : ""
			} font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
			{children}
		</button>
	);
}

// Example: Empty State Component
export function EmptyState({
	icon,
	title,
	description,
}: {
	icon: string;
	title: string;
	description: string;
}) {
	return (
		<div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-lg">
			<div className="text-4xl mb-3 opacity-50 grayscale">{icon}</div>
			<h3 className="text-black font-medium mb-1">{title}</h3>
			<p className="text-gray-500 text-sm">{description}</p>
		</div>
	);
}

// Example: Modal Component
export function Modal({
	isOpen,
	onClose,
	title,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
				<div className="flex justify-between items-center p-6 border-b border-gray-100">
					<h3 className="text-lg font-bold text-black">{title}</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-black text-xl transition-colors">
						✕
					</button>
				</div>
				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}
