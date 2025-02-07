"use client";

import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

export const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const getWalletClient = () => {
  if (typeof window === "undefined") return null;

  return createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });
};
