# Privy<>Wagmi useWalletClient Issue

Necessary environment variables:

- Privy App ID
- Infura API Key

**Expected Behavior:**

Using the `connectWallet` flow via Privy should yield a walletClient from wagmi's `useWalletClient` hook.

Using the `login` flow via Privy should yield a walletClient from wagmi's `useWalletClient` hook.

**Actual Behavior:**

**Connecting** a wallet has no effect on the `useWalletClient` hook.

Using the `login` flow also does not yield a walletClient. I was able to retrieve a walletClient with this method during debugging via hot reload of the dev server.
