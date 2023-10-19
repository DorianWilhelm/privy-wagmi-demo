"use client";
import { Button, Flex, Heading, VStack, Text, HStack } from "@chakra-ui/react";
import {
  WalletWithMetadata,
  useConnectWallet,
  useLogin,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useCallback } from "react";
import { Address, isAddressEqual } from "viem";
import { useAccount, useDisconnect, useWalletClient } from "wagmi";

export default function Home() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { login } = useLogin();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { connectWallet } = useConnectWallet({
    onSuccess: async (wallet) => {
      console.log(wallet);
    },
  });
  const { disconnect } = useDisconnect();
  const { data: walletClient, isFetching } = useWalletClient();
  const { authenticated, logout } = usePrivy();

  const { wallets: connectedWallets } = useWallets();

  const signMessage = useCallback(async () => {
    if (!walletClient?.account) {
      console.log("no account");
      return;
    }
    walletClient.signMessage({
      account: walletClient.account?.address,
      message: "hello world",
    });
  }, [walletClient]);

  return (
    <>
      <Flex justifyContent="space-between" gap={40}>
        <Flex direction="column" w="full" gap={4}>
          <Flex justify="space-between" align="center">
            <Heading size="xl">PRIVY</Heading>
            <Text>
              Connection status:{" "}
              {authenticated ? "🟢 connected" : "🔴 disconnected"}
            </Text>
          </Flex>
          <Button
            variant="solid"
            colorScheme={authenticated ? "red" : "green"}
            onClick={authenticated ? logout : login}
          >
            {authenticated ? "Logout" : "Login"}
          </Button>

          <Heading size="md">Connected Wallets:</Heading>
          {connectedWallets.map((wallet) => {
            return (
              <Flex key={wallet.address} alignItems="center" gap={8}>
                <Text>{wallet.address}</Text>
                <Flex>
                  <Button
                    isDisabled={
                      activeWallet &&
                      isAddressEqual(
                        wallet.address as Address,
                        activeWallet?.address as Address
                      )
                    }
                    colorScheme="blue"
                    onClick={() => {
                      const connectedWallet = connectedWallets.find(
                        (w) => w.address === wallet.address
                      );
                      if (!connectedWallet) connectWallet();
                      else setActiveWallet(connectedWallet);
                    }}
                    disabled={wallet.address === activeWallet?.address}
                  >
                    Make active
                  </Button>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
        <Flex direction="column" w="full" gap={4}>
          <Flex align="center" justify="space-between">
            <Heading size="xl">WAGMI</Heading>

            <Text>
              Connection status: {isConnecting && "🟡 connecting..."}
              {isConnected && "🟢 connected"}
              {isDisconnected && "🔴 disconnected"}
            </Text>
          </Flex>

          <Button
            variant="solid"
            colorScheme={isConnected ? "red" : "green"}
            onClick={isConnected ? () => disconnect() : () => connectWallet()}
          >
            {isConnected ? "Disconnect" : "Connect Wallet"}
          </Button>

          <Heading size="md">Connected Wallets:</Heading>
          <Text>{address || "no wallet connected"}</Text>
          <Flex align="center" justify="space-between">
            <Heading size="md">WalletClient</Heading>
            <Text>
              Status: {isFetching && "🟡 fetching..."}
              {!!walletClient && "🟢 ready"}
              {!walletClient && "🔴 disconnected"}
            </Text>
          </Flex>
          <Flex align="center">
            {!!walletClient && (
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={signMessage}
              >
                Sign message
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
