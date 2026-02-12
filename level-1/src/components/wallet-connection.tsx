"use client";

import { useState } from "react";
import { stellar } from "../lib/stellar-helper";
import { Wallet, Copy, CheckCircle, LogOut } from "lucide-react";
import { Card } from "./example-components";

interface WalletConnectionProps {
	onConnect: (publicKey: string) => void;
	onDisconnect: () => void;
}

export default function WalletConnection({
	onConnect,
	onDisconnect,
}: WalletConnectionProps) {
	const [publicKey, setPublicKey] = useState<string>("");
	const [isConnected, setIsConnected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleConnect = async () => {
		try {
			setLoading(true);
			const key = await stellar.connectWallet();
			setPublicKey(key);
			setIsConnected(true);
			onConnect(key);
		} catch (error: any) {
			console.error("Connection error:", error);
			alert(`Failed to connect wallet:\n${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	const handleDisconnect = () => {
		stellar.disconnect();
		setPublicKey("");
		setIsConnected(false);
		onDisconnect();
	};

	const handleCopyAddress = async () => {
		await navigator.clipboard.writeText(publicKey);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (!isConnected) {
		return (
			<div className="max-w-2xl mx-auto text-center">
				<div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
					<div className="mb-6">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Wallet className="w-8 h-8 text-black" />
						</div>
						<h2 className="text-2xl font-bold text-black mb-2">
							Connect Your Wallet
						</h2>
						<p className="text-gray-500">
							Connect your Stellar wallet to view your balance and make
							transactions.
						</p>
					</div>

					<button
						onClick={handleConnect}
						disabled={loading}
						className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
						{loading ? (
							<>
								<div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
								Connecting...
							</>
						) : (
							<>Connect Wallet</>
						)}
					</button>

					<div className="mt-8 pt-8 border-t border-gray-100">
						<p className="text-gray-500 text-sm mb-4 font-medium uppercase tracking-wide">
							Supported Wallets
						</p>
						<div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
							<span className="flex items-center gap-1">✓ Freighter</span>
							<span className="flex items-center gap-1">✓ xBull</span>
							<span className="flex items-center gap-1">✓ Albedo</span>
							<span className="flex items-center gap-1">✓ Lobstr</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Card>
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 bg-green-500 rounded-full"></div>
					<span className="text-black font-medium text-sm">
						Wallet Connected
					</span>
				</div>
				<button
					onClick={handleDisconnect}
					className="text-gray-400 hover:text-red-600 text-sm flex items-center gap-2 transition-colors">
					<LogOut className="w-4 h-4" /> Disconnect
				</button>
			</div>

			<div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
				<p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-medium">
					Your Address
				</p>
				<div className="flex items-center justify-between gap-3">
					<p className="text-black font-mono text-sm break-all">{publicKey}</p>
					<button
						onClick={handleCopyAddress}
						className="text-gray-400 hover:text-black transition-colors"
						title={copied ? "Copied!" : "Copy address"}>
						{copied ? (
							<CheckCircle className="w-4 h-4 text-green-500" />
						) : (
							<Copy className="w-4 h-4" />
						)}
					</button>
				</div>
			</div>

			<div className="flex gap-2">
				<a
					href={stellar.getExplorerLink(publicKey, "account")}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-gray-500 hover:text-black hover:underline transition-colors flex items-center gap-1">
					View on Stellar Expert →
				</a>
			</div>
		</Card>
	);
}
