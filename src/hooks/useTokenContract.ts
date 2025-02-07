import { CONTRACT_ADDRESS } from "@/contants/contract";
import ABI from "../abi.json";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { client, getWalletClient } from "../viem";
import { Address } from "viem";

// ALL THE COMMENTED CODE IS LIKE WITH WAGMI AND NON COMMENTED CODE IS WITH VIEM

export function useTokenContract() {
  const account = useAccount();

  // const getBalance = async (address: string) => {
  //   const { data } = useReadContract({
  //     abi: ABI,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "balanceOf",
  //     args: [address],
  //   }) as { data: bigint | undefined };

  //   return data;
  // };

  const getBalance = async (address: string) => {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "balanceOf",
      args: [address],
    });
    return result;
  };

  const getTractionFromHash = async (hash: Address) => {
    const result = await client.waitForTransactionReceipt({ hash });
    console.log("The result for the getTransaction hash is: ", result);
    return result;
  };

  const getTransaction = async (hash: Address) => {
    const result = await client.getTransaction({ hash });
    console.log("The Entire Transaction Details: ", result);
    return result;
  };

  // const getTotalSupply = async () => {
  //   const { data } = useReadContract({
  //     abi: ABI,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "totalSupply",
  //   }) as { data: bigint | undefined };

  //   return data;
  // };

  const getTotalSupply = async () => {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "totalSupply",
    });
    return result;
  };

  // const getSymbol = async () => {
  //   const { data } = useReadContract({
  //     abi: ABI,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "symbol",
  //   }) as { data: string | undefined };

  //   return data;
  // };

  const getSymbol = async () => {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "symbol",
    });
    return result;
  };

  // const getName = async () => {
  //   const { data } = useReadContract({
  //     abi: ABI,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "name",
  //   }) as { data: string | undefined };

  //   return data;
  // };

  const getName = async () => {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "name",
    });
    return result;
  };

  // const getMinter = async () => {
  //   const { data } = useReadContract({
  //     abi: ABI,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "minter",
  //   }) as { data: string | undefined };

  //   return data;
  // };

  // Get minter using viem
  const getMinter = async () => {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "minter",
    });
    return result;
  };

  // const getAllowance = async (owner: string, spender: string) => {
  //   const { data } = useReadContract({
  //     abi: ABI,
  //     address: CONTRACT_ADDRESS,
  //     functionName: "allowance",
  //     args: [owner, spender],
  //   }) as { data: bigint | undefined };

  //   return data;
  // };

  // Get allowance using viem
  const getAllowance = async (owner: string, spender: string) => {
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "allowance",
      args: [owner, spender],
    });
    return result;
  };

  // const transfer = async (recipient: string, amount: bigint) => {
  //   return writeContractAsync({
  //     address: CONTRACT_ADDRESS,
  //     abi: ABI,
  //     functionName: "transfer",
  //     args: [recipient, amount],
  //   });
  // };

  const transfer = async (recipient: string, amount: bigint) => {
    const walletClient = getWalletClient();
    if (!walletClient) throw new Error("No wallet client available");

    const { request } = await client.simulateContract({
      account: account.address,
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "transfer",
      args: [recipient, amount],
    });
    const txHash = await walletClient.writeContract(request);
    return { request, txHash };
  };

  // const approve = async (spender: string, amount: bigint) => {
  //   return writeContractAsync({
  //     address: CONTRACT_ADDRESS,
  //     abi: ABI,
  //     functionName: "approve",
  //     args: [spender, amount],
  //   });
  // };

  const approve = async (spender: string, amount: bigint) => {
    const walletClient = getWalletClient();
    if (!walletClient) throw new Error("No wallet client available");

    const { request } = await client.simulateContract({
      account: account.address,
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "approve",
      args: [spender, amount],
    });
    await walletClient.writeContract(request);
    return request;
  };

  // const transferFrom = async (
  //   sender: string,
  //   recipient: string,
  //   amount: bigint
  // ) => {
  //   return writeContractAsync({
  //     address: CONTRACT_ADDRESS,
  //     abi: ABI,
  //     functionName: "transferFrom",
  //     args: [sender, recipient, amount],
  //   });
  // };

  const transferFrom = async (
    sender: string,
    recipient: string,
    amount: bigint
  ) => {
    const walletClient = getWalletClient();
    if (!walletClient) throw new Error("No wallet client available");

    const { request } = await client.simulateContract({
      account: account.address,
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "transferFrom",
      args: [sender, recipient, amount],
    });
    const txHash = await walletClient.writeContract(request);
    return { request, txHash };
  };

  // const mint = async (receiver: string, amount: bigint) => {
  //   return writeContractAsync({
  //     address: CONTRACT_ADDRESS,
  //     abi: ABI,
  //     functionName: "mint",
  //     args: [receiver, amount],
  //   });
  // };

  const mint = async (receiver: string, amount: bigint) => {
    if (!account.address) throw new Error("No account connected");

    const walletClient = getWalletClient();
    if (!walletClient) throw new Error("No wallet client available");

    const { request } = await client.simulateContract({
      account: account.address,
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "mint",
      args: [receiver, amount],
    });

    const hash = await walletClient.writeContract(request);
    return hash;
  };

  return {
    getBalance,
    getTractionFromHash,
    getTransaction,
    getTotalSupply,
    getSymbol,
    getName,
    getMinter,
    getAllowance,
    transfer,
    approve,
    transferFrom,
    mint,
  };
}
