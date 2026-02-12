import * as StellarSdk from "@stellar/stellar-sdk";

console.log("StellarSdk keys:", Object.keys(StellarSdk));
try {
	const server = new StellarSdk.Horizon.Server(
		"https://horizon-testnet.stellar.org",
	);
	console.log("Server created successfully");
} catch (e) {
	console.error("Error creating server:", e);
}
