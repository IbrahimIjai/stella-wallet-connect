/**
 * TransactionHistory Component
 *
 * Displays recent transactions for the connected wallet
 *
 * Features:
 * - List recent transactions
 * - Show: amount, from/to, date
 * - Link to Stellar Expert for details
 * - Empty state when no transactions
 * - Loading state
 * - Refresh functionality
 */

"use client";

import { useState, useEffect } from "react";
import { stellar } from "../lib/stellar-helper";
import { RefreshCw, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Card } from "./example-components";

interface Transaction {
	id: string;
	type: string;
	amount?: string;
	asset?: string;
	from?: string;
	to?: string;
	createdAt: string;
	hash: string;
}

interface TransactionHistoryProps {
	publicKey: string;
}

export default function TransactionHistory({
	publicKey,
}: TransactionHistoryProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [filteredTransactions, setFilteredTransactions] = useState<
		Transaction[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [limit] = useState(20);

	const fetchTransactions = async () => {
		try {
			setRefreshing(true);
			const txs = await stellar.getRecentTransactions(publicKey, limit);
			setTransactions(txs);
			setFilteredTransactions(txs);
		} catch (error) {
			console.error("Error fetching transactions:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (publicKey) {
			fetchTransactions();
		}
	}, [publicKey]);

	useEffect(() => {
		if (searchQuery.trim() === "") {
			setFilteredTransactions(transactions);
		} else {
			const lowerQuery = searchQuery.toLowerCase();
			const filtered = transactions.filter(
				(tx) =>
					tx.hash.toLowerCase().includes(lowerQuery) ||
					(tx.amount && tx.amount.includes(lowerQuery)) ||
					(tx.from && tx.from.toLowerCase().includes(lowerQuery)) ||
					(tx.to && tx.to.toLowerCase().includes(lowerQuery)),
			);
			setFilteredTransactions(filtered);
		}
	}, [searchQuery, transactions]);

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
		});
	};

	const formatAddress = (address?: string): string => {
		if (!address) return "N/A";
		return stellar.formatAddress(address, 4, 4);
	};

	const isOutgoing = (tx: Transaction): boolean => {
		return tx.from === publicKey;
	};

	if (loading) {
		return (
			<Card title="Transaction History">
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="animate-pulse">
							<div className="h-20 bg-gray-100 rounded-lg"></div>
						</div>
					))}
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<div className="flex flex-col gap-4 mb-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold text-black flex items-center gap-2">
						History
					</h2>
					<button
						onClick={fetchTransactions}
						disabled={refreshing}
						className="text-gray-400 hover:text-black disabled:opacity-50 transition-colors p-2 hover:bg-gray-100 rounded-full"
						title="Refresh">
						<RefreshCw
							className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
						/>
					</button>
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Search transactions..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
					/>
				</div>
			</div>

			{filteredTransactions.length === 0 ? (
				<div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-lg">
					<div className="text-4xl mb-3 opacity-20 grayscale">📜</div>
					<h3 className="text-black font-medium mb-1">
						{searchQuery ? "No matches found" : "No Transactions"}
					</h3>
					<p className="text-gray-500 text-sm">
						{searchQuery
							? "Try a different search term"
							: "Your history will appear here."}
					</p>
				</div>
			) : (
				<div className="space-y-0 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
					{filteredTransactions.map((tx) => {
						const outgoing = isOutgoing(tx);

						return (
							<div
								key={tx.id}
								className="group bg-white hover:bg-gray-50 transition-colors p-4 flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center border ${
											outgoing
												? "bg-white border-gray-200 text-gray-400"
												: "bg-black border-black text-white"
										}`}>
										{outgoing ? (
											<ArrowUp className="w-3 h-3" />
										) : (
											<ArrowDown className="w-3 h-3" />
										)}
									</div>

									<div>
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium text-black">
												{outgoing ? "Sent Payment" : "Received Payment"}
											</p>
											<span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
												{formatDate(tx.createdAt)}
											</span>
										</div>
										<p className="text-xs text-gray-500 font-mono mt-0.5">
											{outgoing
												? `To: ${formatAddress(tx.to)}`
												: `From: ${formatAddress(tx.from)}`}
										</p>
									</div>
								</div>

								<div className="text-right">
									{tx.amount && (
										<p
											className={`text-sm font-bold tracking-tight ${
												outgoing ? "text-gray-900" : "text-green-600"
											}`}>
											{outgoing ? "-" : "+"}
											{parseFloat(tx.amount).toFixed(2)} {tx.asset || "XLM"}
										</p>
									)}
									<a
										href={stellar.getExplorerLink(tx.hash, "tx")}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[10px] text-gray-400 hover:text-black hover:underline transition-colors block mt-0.5">
										View
									</a>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{transactions.length > 0 && (
				<div className="mt-6 text-center border-t border-gray-100 pt-4">
					<p className="text-gray-400 text-xs uppercase tracking-wide">
						Showing last {filteredTransactions.length} transaction
						{filteredTransactions.length !== 1 ? "s" : ""}
					</p>
				</div>
			)}
		</Card>
	);
}
