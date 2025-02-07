// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   useAccount,
//   useBalance,
//   useConnect,
//   useDisconnect,
//   useEnsName,
//   useReadContract,
//   useWriteContract,
// } from "wagmi";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Wallet2,
//   Power,
//   AlertCircle,
//   Coins,
//   ArrowLeftRight,
//   Lock,
//   CreditCard,
//   Users,
//   Factory,
//   Loader2,
// } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import ABI from "../abi.json";
// import TokenHeader from "./_components/TokenInterface/TokenHeader";

// const CONTRACT_ADDRESS = "0xD8Da7d286101A299F73Cc2d4dD99a5F6f2eb886C";

// const TokenInterface = () => {
//   const [amount, setAmount] = useState("");
//   const [recipient, setRecipient] = useState("");
//   const [spender, setSpender] = useState("");
//   const [sender, setSender] = useState("");
//   const [mintReceiver, setMintReceiver] = useState("");
//   const [allowanceOwner, setAllowanceOwner] = useState("");
//   const [allowanceSpender, setAllowanceSpender] = useState("");
//   const [loading, setLoading] = useState(false);

//   const account = useAccount();
//   const { connectors, connect } = useConnect();
//   const { disconnect } = useDisconnect();
//   const { writeContractAsync: writeContract, isPending } = useWriteContract();

//   const { data: ensName } = useEnsName({ address: account.address });
//   const { data: nativeBalance, isLoading: isBalanceLoading } = useBalance({
//     address: account.address,
//   });

//   const { data: totalSupply } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "totalSupply",
//   }) as { data: bigint | undefined };

//   const { data: balance } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "balanceOf",
//     args: [account.address],
//   }) as { data: bigint | undefined };

//   async function getBalance() {
//     const { data: balance } = useReadContract({
//       abi: ABI,
//       address: CONTRACT_ADDRESS,
//       functionName: "balanceOf",
//       args: [account.address],
//     }) as { data: bigint | undefined };

//     return balance;
//   }

//   const { data: symbol } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "symbol",
//   }) as { data: string | undefined };

//   const { data: name } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "name",
//   }) as { data: string | undefined };

//   const minter = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "minter",
//     account: "0x3E53d785995bb74C0B9ba8F71D0d6a0c4d9E6901",
//   }) as { data: string | undefined };

//   const { data: allowance } = useReadContract({
//     abi: ABI,
//     address: CONTRACT_ADDRESS,
//     functionName: "allowance",
//     args: [allowanceOwner || "0x", allowanceSpender || "0x"],
//   }) as { data: bigint | undefined };

//   const handleTransfer = async () => {
//     setLoading(true);
//     try {
//       await writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "transfer",
//         args: [recipient, BigInt(amount)],
//       });
//     } catch (error) {
//       console.error("Transfer error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async () => {
//     setLoading(true);

//     try {
//       await writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "approve",
//         args: [spender, BigInt(amount)],
//       });
//     } catch (error) {
//       console.error("Approve error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTransferFrom = async () => {
//     setLoading(true);

//     try {
//       await writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "transferFrom",
//         args: [sender, recipient, BigInt(amount)],
//       });
//     } catch (error) {
//       console.error("TransferFrom error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMint = async () => {
//     setLoading(true);

//     try {
//       await writeContract({
//         address: CONTRACT_ADDRESS,
//         abi: ABI,
//         functionName: "mint",
//         args: [mintReceiver, BigInt(amount)],
//       });
//     } catch (error) {
//       console.error("Mint error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <TokenHeader />

//         {account.status === "connected" ? (
//           <Tabs defaultValue="transfer" className="space-y-4">
//             <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
//               <TabsTrigger value="transfer" className="flex items-center gap-2">
//                 <ArrowLeftRight size={16} />
//                 Transfer
//               </TabsTrigger>
//               <TabsTrigger
//                 value="transferFrom"
//                 className="flex items-center gap-2"
//               >
//                 <Users size={16} />
//                 TransferFrom
//               </TabsTrigger>
//               <TabsTrigger value="approve" className="flex items-center gap-2">
//                 <Lock size={16} />
//                 Approve
//               </TabsTrigger>
//               <TabsTrigger
//                 value="allowance"
//                 className="flex items-center gap-2"
//               >
//                 <CreditCard size={16} />
//                 Allowance
//               </TabsTrigger>
//               <TabsTrigger value="mint" className="flex items-center gap-2">
//                 <Factory size={16} />
//                 Mint
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="transfer">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Transfer Tokens</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input
//                     placeholder="To Address"
//                     value={recipient}
//                     onChange={(e) => setRecipient(e.target.value)}
//                   />
//                   <Input
//                     placeholder="Amount"
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                   />
//                   <Button
//                     onClick={handleTransfer}
//                     className="w-full"
//                     disabled={loading || isPending}
//                   >
//                     {loading ? (
//                       <Loader2 className="h-4 w-4 animate-spin text-white" />
//                     ) : (
//                       "Transfer"
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="transferFrom">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Transfer From</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input
//                     placeholder="From Address"
//                     value={sender}
//                     onChange={(e) => setSender(e.target.value)}
//                   />
//                   <Input
//                     placeholder="To Address"
//                     value={recipient}
//                     onChange={(e) => setRecipient(e.target.value)}
//                   />
//                   <Input
//                     placeholder="Amount"
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                   />
//                   <Button
//                     onClick={handleTransferFrom}
//                     className="w-full"
//                     disabled={loading || isPending}
//                   >
//                     {loading ? (
//                       <Loader2 className="h-4 w-4 animate-spin text-white" />
//                     ) : (
//                       "Transfer From"
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="approve">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Approve Spender</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input
//                     placeholder="Spender Address"
//                     value={spender}
//                     onChange={(e) => setSpender(e.target.value)}
//                   />
//                   <Input
//                     placeholder="Amount"
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                   />
//                   <Button
//                     onClick={handleApprove}
//                     className="w-full"
//                     disabled={loading || isPending}
//                   >
//                     {loading ? (
//                       <Loader2 className="h-4 w-4 animate-spin text-white" />
//                     ) : (
//                       "Approve"
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="allowance">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Check Allowance</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input
//                     placeholder="Owner Address"
//                     value={allowanceOwner}
//                     onChange={(e) => setAllowanceOwner(e.target.value)}
//                   />
//                   <Input
//                     placeholder="Spender Address"
//                     value={allowanceSpender}
//                     onChange={(e) => setAllowanceSpender(e.target.value)}
//                   />
//                   <div className="p-4 bg-gray-100 rounded">
//                     <p className="text-sm font-medium">Current Allowance:</p>
//                     <p className="text-lg">
//                       {String(allowance || 0)} {String(symbol)}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="mint">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Mint Tokens</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input
//                     placeholder="Receiver Address"
//                     value={mintReceiver}
//                     onChange={(e) => setMintReceiver(e.target.value)}
//                   />
//                   <Input
//                     placeholder="Amount"
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                   />
//                   <Button
//                     onClick={handleMint}
//                     className="w-full"
//                     disabled={
//                       loading || account.address !== minter.data || isPending
//                     }
//                   >
//                     {loading ? (
//                       <Loader2 className="h-4 w-4 animate-spin text-white" />
//                     ) : (
//                       "Mint"
//                     )}
//                   </Button>
//                   {account.address !== minter.data && (
//                     <Alert>
//                       <AlertCircle className="h-4 w-4" />
//                       <AlertDescription>
//                         Only the minter can mint new tokens
//                       </AlertDescription>
//                     </Alert>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         ) : (
//           <Card>
//             <CardContent className="py-8">
//               <div className="text-center text-gray-500">
//                 Please connect your wallet to interact with the token
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Account Status */}
//         {account.status === "connected" && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg font-medium">
//                 Account Status
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <p className="text-sm text-gray-500">Address</p>
//                     <p className="font-mono text-sm">{account.address}</p>
//                     {ensName && <Badge variant="secondary">{ensName}</Badge>}
//                   </div>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm text-gray-500">Coin Name</p>
//                   {isBalanceLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
//                   ) : (
//                     <p>
//                       {name} ({nativeBalance?.symbol})
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-sm text-gray-500">Native Balance</p>
//                   {isBalanceLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
//                   ) : (
//                     <p>
//                       {nativeBalance?.formatted} {nativeBalance?.symbol}
//                     </p>
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-gray-500">Status</p>
//                   <Badge
//                     variant={
//                       account.status === "connected" ? "default" : "destructive"
//                     }
//                     className="capitalize"
//                   >
//                     {account.status}
//                   </Badge>
//                 </div>

//                 <div className="space-y-1">
//                   <p className="text-sm text-gray-500">Token Balance</p>
//                   {isBalanceLoading ? (
//                     <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
//                   ) : (
//                     <p>
//                       {balance?.toString()} {symbol}
//                     </p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-1">
//                     <p className="text-sm text-gray-500">Total Supply</p>
//                     {isBalanceLoading ? (
//                       <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
//                     ) : (
//                       <p className="font-mono text-sm">{totalSupply || 0}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TokenInterface;

import { redirect } from "next/navigation";
import React from "react";

const Main = () => {
  return redirect("/token");
};

export default Main;
