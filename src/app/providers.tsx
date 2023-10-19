"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
import { configureChains, sepolia } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";

export function Providers({ children }: { children: React.ReactNode }) {
  const configureChainsConfig = configureChains(
    [sepolia],
    [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY! })]
  );
  return (
    <CacheProvider>
      <ChakraProvider>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
            loginMethods: ["wallet", "google", "email"], // "email", "google", "twitter"
            defaultChain: sepolia,
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
            supportedChains: [sepolia],
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              showWalletLoginFirst: true,
            },
          }}
        >
          <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
            {children}
          </PrivyWagmiConnector>
        </PrivyProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
