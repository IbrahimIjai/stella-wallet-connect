# 🌟 Stella Wallet Connect

Build beautiful payment dashboards on the Stellar blockchain. Focus purely on UI/UX design while we handle the heavy lifting!

**Tech Stack:** React (Vite), TypeScript, Tailwind CSS, Stellar Wallets Kit, Bun.

## 🎯 What's This?

A starter template for building Stellar payment interfaces. Perfect for hackathons and learning.
All complex blockchain logic is abstracted in `src/lib/stellar-helper.ts`. **Do not modify that file.** Your job is to make the app look amazing.

## ✨ Features

- **Wallet Connection**: Integrated with `@creit.tech/stellar-wallets-kit` (Freighter, xBull, Albedo, etc.).
- **Balance Display**: Real-time XLM balance updates.
- **Send Payments**: Secure payment form with validation.
- **Transaction History**: Searchable, clean transaction list.
- **Bonus Features**: Ready-to-use components in `src/components/wallet-features.tsx` (QR Codes, Address Book, etc.).

## � Screenshots

| Wallet Connected                                 | Balance Display                               |
| ------------------------------------------------ | --------------------------------------------- |
| ![Wallet Connected](./screenshots/connected.png) | ![Balance Display](./screenshots/balance.png) |

| Successful Transaction                        | Transaction Result                  |
| --------------------------------------------- | ----------------------------------- |
| ![Transaction](./screenshots/transaction.png) | ![Result](./screenshots/result.png) |

## �🚀 Quick Start

### 1. Prerequisites

- [Bun](https://bun.sh/) installed.
- A Stellar Wallet extension (e.g., [Freighter](https://www.freighter.app/)).

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/IbrahimIjai/stella-wallet-connect.git
cd stella-wallet-connect

# Install dependencies
bun install
```

### 3. Run Development Server

```bash
bun dev
```

Open `http://localhost:5173` in your browser.

## 🛠️ Integration Guide

### Wallet Connection (@creit.tech/stellar-wallets-kit)

To integrate the wallet connection modal:

1.  **Install the Kit & Polyfills**:

    ```bash
    bun add @creit.tech/stellar-wallets-kit @stellar/stellar-sdk vite-plugin-node-polyfills
    ```

2.  **Configure Vite**:
    Update `vite.config.ts` to handle Node globals (Buffer, process) required by Stellar SDK.
    _(Already done in this template)_

3.  **Usage**:
    The helper in `src/lib/stellar-helper.ts` manages the connection.

    ```typescript
    import { stellar } from "./lib/stellar-helper";

    // Opens the modal to connect a wallet
    const publicKey = await stellar.connectWallet();
    ```

### sending Payments & Polling History

**Sending Payments:**
Use the `sendPayment` function which handles the transaction building and signing automatically.

```typescript
const result = await stellar.sendPayment({
	from: userPublicKey,
	to: recipientAddress,
	amount: "10.0", // XLM
	memo: "Hackathon Prize", // Optional
});

if (result.success) {
	console.log("Tx Hash:", result.hash);
}
```

**Polling History:**
Fetch transactions periodically or on user action.

```typescript
// Fetch last 20 transactions
const history = await stellar.getRecentTransactions(userPublicKey, 20);

// Data structure returned:
// {
//   id: string,
//   type: "payment",
//   amount: "10.0",
//   from: "G...",
//   to: "G...",
//   createdAt: "2023-...",
//   hash: "..."
// }
```

## 📁 Project Structure

```
stella-wallet-connect/
├── src/
│   ├── components/         # 🎨 Edit these!
│   │   ├── wallet-connection.tsx
│   │   ├── balance-display.tsx
│   │   ├── payment-form.tsx
│   │   ├── transaction-history.tsx
│   │   └── wallet-features.tsx
│   ├── lib/
│   │   └── stellar-helper.ts # ⚠️ Blockchain logic (Read-only)
│   ├── App.tsx             # Main entry
│   └── index.css           # Tailwind globals
├── package.json
└── vite.config.ts
```

## 💡 Tips for Hackathons

1.  **Customize `index-page.tsx`**: This is your main dashboard. Change the layout here.
2.  **Style Components**: Go into `src/components/` and tweak the Tailwind classes to match your brand.
3.  **Unlock Bonus Features**: Import components from `wallet-features.tsx` to add "Dark Mode", "Address Book", or "QR Codes" instantly.

## 🤝 Contributing

Fork it, build it, share it.
Submit PRs to [IbrahimIjai/stella-wallet-connect](https://github.com/IbrahimIjai/stella-wallet-connect).

---

Made with ❤️ for the Stellar Community.
