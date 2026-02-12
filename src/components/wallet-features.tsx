/**
 * Wallet Features Components
 *
 * A collection of advanced features to enhance the wallet experience.
 */

"use client";

import { useState } from "react";
import {
	Moon,
	Sun,
	QrCode,
	LineChart,
	Search,
	Book,
	User,
	Plus,
	X,
} from "lucide-react";
import { Card } from "./example-components";

// ============================================
// Theme Toggle
// ============================================
export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	const toggleTheme = () => {
		setIsDark(!isDark);
		document.documentElement.classList.toggle("dark");
	};

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
			title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
			{isDark ? (
				<Sun className="text-black w-5 h-5" />
			) : (
				<Moon className="text-black w-5 h-5" />
			)}
		</button>
	);
}

// ============================================
// QR Code for Address
// ============================================
export function AddressQRCode({ address }: { address: string }) {
	const [showQR, setShowQR] = useState(false);

	return (
		<div>
			<button
				onClick={() => setShowQR(!showQR)}
				className="text-gray-500 hover:text-black flex items-center gap-2 text-sm font-medium transition-colors">
				<QrCode className="w-4 h-4" /> {showQR ? "Hide QR" : "Show QR Code"}
			</button>

			{showQR && (
				<div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
					<div className="text-center">
						<p className="text-black font-medium text-sm mb-4">
							Scan to receive payment
						</p>

						{/* QR Code Placeholder */}
						<div className="w-48 h-48 bg-black flex items-center justify-center mx-auto mb-4 rounded-lg">
							<QrCode className="text-white w-24 h-24 opacity-80" />
						</div>

						<p className="text-gray-500 text-xs font-mono break-all bg-gray-50 p-2 rounded border border-gray-100">
							{address}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

// ============================================
// Balance Chart
// ============================================
export function BalanceChart() {
	return (
		<Card title="Balance History">
			<div className="h-64 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
				{/* Simulated Chart Line */}
				<svg
					className="absolute bottom-0 left-0 right-0 h-40 w-full text-black/5"
					fill="currentColor"
					viewBox="0 0 100 100"
					preserveAspectRatio="none">
					<path d="M0,100 L0,50 C20,60 40,30 60,40 C80,50 100,20 100,20 L100,100 Z" />
				</svg>

				<div className="text-center z-10">
					<LineChart className="w-8 h-8 text-black/20 mx-auto mb-3" />
					<p className="text-gray-500 text-sm font-medium">Activity Chart</p>
					<p className="text-gray-400 text-xs mt-1">
						Transactional data visualization
					</p>
				</div>
			</div>
		</Card>
	);
}

// ============================================
// Search/Filter Transactions
// ============================================
export function TransactionFilter({
	onFilter,
}: {
	onFilter: (query: string) => void;
}) {
	const [query, setQuery] = useState("");

	const handleSearch = (value: string) => {
		setQuery(value);
		onFilter(value);
	};

	return (
		<div className="relative">
			<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				value={query}
				onChange={(e) => handleSearch(e.target.value)}
				placeholder="Search transactions..."
				className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
			/>
		</div>
	);
}

// ============================================
// Transaction Confirmation Modal
// ============================================
export function TransactionConfirmation({
	isOpen,
	onConfirm,
	onCancel,
	recipient,
	amount,
}: {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	recipient: string;
	amount: string;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
				<div className="p-6">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-xl font-bold text-black">
							Confirm Transaction
						</h3>
						<button
							onClick={onCancel}
							className="text-gray-400 hover:text-black">
							<X className="w-5 h-5" />
						</button>
					</div>

					<div className="space-y-4 mb-8">
						<div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
							<p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
								To Recipient
							</p>
							<p className="text-black font-mono text-sm break-all">
								{recipient}
							</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex justify-between items-center">
							<p className="text-gray-500 text-xs font-medium uppercase tracking-wide">
								Amount
							</p>
							<p className="text-black text-2xl font-bold">
								{amount}{" "}
								<span className="text-sm font-normal text-gray-500">XLM</span>
							</p>
						</div>
					</div>

					<div className="flex gap-3">
						<button
							onClick={onCancel}
							className="flex-1 bg-white hover:bg-gray-50 text-black border border-gray-200 font-bold py-3 px-6 rounded-lg transition-colors">
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors">
							Confirm Payment
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// ============================================
// Address Book
// ============================================
export function AddressBook() {
	const [addresses, setAddresses] = useState<
		Array<{ name: string; address: string }>
	>([]);
	const [showAdd, setShowAdd] = useState(false);
	const [newName, setNewName] = useState("");
	const [newAddress, setNewAddress] = useState("");

	const handleAdd = () => {
		if (newName && newAddress) {
			setAddresses([...addresses, { name: newName, address: newAddress }]);
			setNewName("");
			setNewAddress("");
			setShowAdd(false);
		}
	};

	return (
		<Card title="Address Book">
			<div className="mb-4 flex justify-between items-center">
				<p className="text-gray-500 text-sm">Save your favorite contacts</p>
				<button
					onClick={() => setShowAdd(!showAdd)}
					className="text-black hover:bg-gray-50 border border-gray-200 rounded-full p-2 transition-colors"
					title="Add Address">
					{showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
				</button>
			</div>

			{showAdd && (
				<div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
					<p className="text-black font-medium text-sm mb-3">Add New Contact</p>

					<div className="space-y-3">
						<input
							type="text"
							placeholder="Name (e.g., Alice)"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-black"
						/>
						<input
							type="text"
							placeholder="Stellar Address (G...)"
							value={newAddress}
							onChange={(e) => setNewAddress(e.target.value)}
							className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:border-black font-mono text-sm"
						/>
						<button
							onClick={handleAdd}
							disabled={!newName || !newAddress}
							className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 rounded-lg disabled:opacity-50 transition-colors">
							Save Contact
						</button>
					</div>
				</div>
			)}

			{addresses.length === 0 ? (
				<div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
					<Book className="w-8 h-8 text-gray-300 mx-auto mb-2" />
					<p className="text-gray-500 text-sm">No saved contacts</p>
					<button
						onClick={() => setShowAdd(true)}
						className="text-black text-xs font-medium hover:underline mt-1">
						Add your first contact
					</button>
				</div>
			) : (
				<div className="space-y-2">
					{addresses.map((contact, index) => (
						<div
							key={index}
							className="group bg-white border border-gray-100 hover:border-gray-300 rounded-lg p-3 flex justify-between items-center transition-all">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs">
									{contact.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<p className="text-black font-medium text-sm">
										{contact.name}
									</p>
									<p className="text-gray-400 text-[10px] font-mono truncate max-w-[150px]">
										{contact.address}
									</p>
								</div>
							</div>
							<button className="text-xs border border-gray-200 hover:border-black px-2 py-1 rounded text-gray-500 hover:text-black transition-colors">
								Select
							</button>
						</div>
					))}
				</div>
			)}
		</Card>
	);
}

// ============================================
// Loading Animations
// ============================================
export function AnimatedCard({
	children,
	delay = 0,
}: {
	children: React.ReactNode;
	delay?: number;
}) {
	return (
		<div className="animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
			{children}
		</div>
	);
}
