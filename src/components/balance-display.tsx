"use client";

import { useState, useEffect } from "react";
import { stellar } from "../lib/stellar-helper";
import { Recycle, Coins } from "lucide-react";
import { Card } from "./example-components";

interface BalanceDisplayProps {
	publicKey: string;
}

export default function BalanceDisplay({ publicKey }: BalanceDisplayProps) {
	const [balance, setBalance] = useState<string>("0");
	const [assets, setAssets] = useState<
		Array<{ code: string; issuer: string; balance: string }>
	>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchBalance = async () => {
		try {
			setRefreshing(true);
			const balanceData = await stellar.getBalance(publicKey);
			setBalance(balanceData.xlm);
			setAssets(balanceData.assets);
		} catch (error) {
			console.error("Error fetching balance:", error);
			alert("Failed to fetch balance. Please try again.");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (publicKey) {
			fetchBalance();
		}
	}, [publicKey]);

	const formatBalance = (balance: string): string => {
		const num = parseFloat(balance);
		return num.toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 7,
		});
	};

	if (loading) {
		return (
			<Card title="💰 Your Balance">
				<div className="animate-pulse">
					<div className="h-16 bg-white/5 rounded-lg mb-4"></div>
					<div className="h-10 bg-white/5 rounded-lg w-1/2"></div>
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-black flex items-center gap-2">
					<Coins className="text-black w-4 h-4" />
					Your Balance
				</h2>
				<button
					onClick={fetchBalance}
					disabled={refreshing}
					className="text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
					title="Refresh balance">
					<Recycle
						className={`w-4 h-4 text-gray-500 ${refreshing ? "animate-spin" : ""}`}
					/>
				</button>
			</div>

			{/* XLM Balance */}
			<div className="bg-black text-white rounded-lg p-6 mb-4 shadow-sm">
				<p className="text-white/60 text-sm mb-2 uppercase tracking-wide font-medium">
					Available Balance
				</p>
				<div className="flex items-baseline gap-2">
					<p className="text-5xl font-bold tracking-tight">
						{formatBalance(balance)}
					</p>
					<p className="text-2xl text-white/40 font-light">XLM</p>
				</div>
				<p className="text-white/30 text-sm mt-2">
					≈ ${(parseFloat(balance) * 0.12).toFixed(2)} USD
				</p>
			</div>

			{/* Other Assets */}
			{assets.length > 0 && (
				<div className="space-y-2">
					<p className="text-gray-500 text-sm mb-2 font-medium uppercase tracking-wide">
						Other Assets
					</p>
					{assets.map((asset, index) => (
						<div
							key={index}
							className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:border-black transition-colors">
							<div className="flex flex-col">
								<span className="font-semibold text-black">{asset.code}</span>
								<span className="text-gray-400 text-[10px] font-mono truncate max-w-[150px]">
									{asset.issuer}
								</span>
							</div>
							<p className="text-black font-bold">
								{formatBalance(asset.balance)}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Info Box */}
			<div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-xs flex items-center gap-2">
				<span className="font-bold">Tip:</span> Keep at least 1 XLM in your
				account for network reserves.
			</div>
		</Card>
	);
}
