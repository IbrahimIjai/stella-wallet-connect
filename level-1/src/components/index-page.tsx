"use client";

import { useState } from "react";
import WalletConnection from "./wallet-connection";
import BalanceDisplay from "./balance-display";
import PaymentForm from "./payment-form";
import TransactionHistory from "./transaction-history";

export default function Home() {
	const [publicKey, setPublicKey] = useState<string>("");
	const [isConnected, setIsConnected] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const handleConnect = (key: string) => {
		setPublicKey(key);
		setIsConnected(true);
	};

	const handleDisconnect = () => {
		setPublicKey("");
		setIsConnected(false);
	};

	const handlePaymentSuccess = () => {
		// Refresh balance and transaction history
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
			{/* Header */}
			<header className="border-b border-black sticky top-0 bg-white z-50">
				<div className="max-w-5xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-lg">
								S
							</div>
							<div>
								<h1 className="text-xl font-bold tracking-tight">
									Stellar Wallet
								</h1>
							</div>
						</div>

						<div className="flex items-center gap-6">
							<a
								href="https://stellar.org"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium hover:underline decoration-1 underline-offset-4 transition-all">
								About
							</a>
							<a
								href="https://github.com/IbrahimIjai/stella-wallet-connect"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium hover:underline decoration-1 underline-offset-4 transition-all">
								GitHub
							</a>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-5xl mx-auto px-6 py-12">
				{/* Welcome Banner - Minimalist */}
				{!isConnected && (
					<div className="mb-12 text-center space-y-4">
						<h2 className="text-4xl font-bold tracking-tight">
							Simplifying Stellar Payments
						</h2>
						<p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
							Connect your wallet to manage your assets on the Stellar network.
							Secure, fast, and built for the future.
						</p>
					</div>
				)}

				{/* Wallet Connection */}
				<div className="mb-12">
					<WalletConnection
						onConnect={handleConnect}
						onDisconnect={handleDisconnect}
					/>
				</div>

				{/* Dashboard Content - Only show when connected */}
				{isConnected && publicKey && (
					<div className="space-y-12">
						{/* Balance Section */}
						<div key={`balance-${refreshKey}`}>
							<BalanceDisplay publicKey={publicKey} />
						</div>

						{/* Two Column Layout for Payment Form and Transaction History */}
						<div className="grid lg:grid-cols-2 gap-12">
							{/* Payment Form */}
							<div>
								<PaymentForm
									publicKey={publicKey}
									onSuccess={handlePaymentSuccess}
								/>
							</div>

							{/* Transaction History */}
							<div key={`history-${refreshKey}`}>
								<TransactionHistory publicKey={publicKey} />
							</div>
						</div>

						{/* Info Cards - Minimal Grid */}
						<div className="grid md:grid-cols-3 gap-6 border-t border-gray-100 pt-12">
							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="font-bold mb-2">Lightning Fast</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									Transactions settle in 3-5 seconds on the Stellar network.
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="font-bold mb-2">Low Fees</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									Transaction fees are negligible, enabling micro-payments.
								</p>
							</div>

							<div className="bg-gray-50 rounded-lg p-6">
								<h3 className="font-bold mb-2">Secure</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									Built on vetted blockchain technology with enterprise-grade
									security.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Getting Started Guide - Only show when not connected */}
				{!isConnected && (
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-gray-100">
						<div className="space-y-2">
							<div className="text-2xl font-bold">1</div>
							<h3 className="font-semibold text-sm uppercase tracking-wide">
								Install
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Get a Stellar wallet like Freighter or Albedo.
							</p>
						</div>

						<div className="space-y-2">
							<div className="text-2xl font-bold">2</div>
							<h3 className="font-semibold text-sm uppercase tracking-wide">
								Connect
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Link your wallet securely to the dashboard.
							</p>
						</div>

						<div className="space-y-2">
							<div className="text-2xl font-bold">3</div>
							<h3 className="font-semibold text-sm uppercase tracking-wide">
								Fund
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Get free Testnet XLM to start experimenting.
							</p>
						</div>

						<div className="space-y-2">
							<div className="text-2xl font-bold">4</div>
							<h3 className="font-semibold text-sm uppercase tracking-wide">
								Transact
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Send assets instantly across the network.
							</p>
						</div>
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="border-t border-black bg-black text-white mt-auto">
				<div className="max-w-5xl mx-auto px-6 py-12">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						<div className="text-center md:text-left">
							<p className="font-bold mb-1">Stellar Dashboard</p>
							<p className="text-sm text-gray-400">
								Running on Stellar Testnet
							</p>
						</div>
						<div className="text-sm text-gray-500">
							For development purposes only.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
