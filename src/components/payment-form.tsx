/**
 * PaymentForm Component
 *
 * Allows users to send XLM payments
 *
 * Features:
 * - Input for recipient address
 * - Input for amount
 * - Optional memo field
 * - Form validation
 * - Success message with transaction hash
 * - Error handling with user-friendly messages
 */

"use client";

import { useState } from "react";
import { stellar } from "../lib/stellar-helper";
import { Paperclip, CheckCircle } from "lucide-react";
import { Card, Input, Button, Alert } from "./example-components";

interface PaymentFormProps {
	publicKey: string;
	onSuccess?: () => void;
}

export default function PaymentForm({
	publicKey,
	onSuccess,
}: PaymentFormProps) {
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [memo, setMemo] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
		{},
	);
	const [alert, setAlert] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [txHash, setTxHash] = useState("");

	const validateForm = (): boolean => {
		const newErrors: { recipient?: string; amount?: string } = {};

		// Validate recipient address
		if (!recipient.trim()) {
			newErrors.recipient = "Recipient address is required";
		} else if (recipient.length !== 56 || !recipient.startsWith("G")) {
			newErrors.recipient =
				"Invalid Stellar address (must start with G and be 56 characters)";
		}

		// Validate amount
		if (!amount.trim()) {
			newErrors.amount = "Amount is required";
		} else {
			const numAmount = parseFloat(amount);
			if (isNaN(numAmount) || numAmount <= 0) {
				newErrors.amount = "Amount must be a positive number";
			} else if (numAmount < 0.0000001) {
				newErrors.amount = "Amount is too small (minimum: 0.0000001 XLM)";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true);
			setAlert(null);
			setTxHash("");

			const result = await stellar.sendPayment({
				from: publicKey,
				to: recipient,
				amount: amount,
				memo: memo || undefined,
			});

			if (result.success) {
				setTxHash(result.hash);
				setAlert({
					type: "success",
					message: `Payment sent successfully! 🎉`,
				});

				// Clear form
				setRecipient("");
				setAmount("");
				setMemo("");
				setErrors({});

				// Call success callback
				if (onSuccess) {
					onSuccess();
				}
			}
		} catch (error: any) {
			console.error("Payment error:", error);
			let errorMessage = "Failed to send payment. ";

			if (error.message.includes("insufficient")) {
				errorMessage += "Insufficient balance.";
			} else if (error.message.includes("destination")) {
				errorMessage += "Invalid destination account.";
			} else {
				errorMessage += error.message || "Please try again.";
			}

			setAlert({
				type: "error",
				message: errorMessage,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
				<Paperclip className="text-black w-4 h-4" />
				Send Payment
			</h2>

			{alert && (
				<div className="mb-4">
					<Alert
						type={alert.type}
						message={alert.message}
						onClose={() => setAlert(null)}
					/>
				</div>
			)}

			{txHash && (
				<div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
					<div className="flex items-start gap-3">
						<CheckCircle className="text-black text-xl flex-shrink-0 mt-1 w-4 h-4" />
						<div className="flex-1">
							<p className="text-black font-semibold mb-2">
								Transaction Confirmed!
							</p>
							<p className="text-gray-500 text-sm mb-1">Transaction Hash:</p>
							<p className="text-black font-mono text-xs break-all mb-3 bg-white p-2 border border-gray-100 rounded">
								{txHash}
							</p>
							<a
								href={stellar.getExplorerLink(txHash, "tx")}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-600 hover:text-black text-sm underline decoration-gray-400 underline-offset-2">
								View on Stellar Expert →
							</a>
						</div>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="Recipient Address"
					placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
					value={recipient}
					onChange={setRecipient}
					error={errors.recipient}
				/>

				<Input
					label="Amount (XLM)"
					type="number"
					placeholder="0.00"
					value={amount}
					onChange={setAmount}
					error={errors.amount}
				/>

				<Input
					label="Memo (Optional)"
					placeholder="Payment for..."
					value={memo}
					onChange={setMemo}
				/>

				<div className="pt-2">
					<Button
						onClick={() => {}}
						variant="primary"
						disabled={loading}
						fullWidth>
						{loading ? (
							<span className="flex items-center justify-center gap-2">
								<div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
								Sending...
							</span>
						) : (
							<span className="flex items-center justify-center gap-2">
								<Paperclip className="w-4 h-4" />
								Send Payment
							</span>
						)}
					</Button>
				</div>
			</form>

			<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
				<p className="text-gray-600 text-xs leading-relaxed">
					<strong className="text-black">Warning:</strong> Double-check the
					recipient address. Transactions on the Stellar network are
					irreversible.
				</p>
			</div>
		</Card>
	);
}
