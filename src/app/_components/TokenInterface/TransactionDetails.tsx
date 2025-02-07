import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTokenContract } from "@/hooks/useTokenContract";
import { Address, TransactionReceipt, Transaction } from "viem";
import clsx from "clsx";

const TransactionDetails = () => {
  const [hash, setHash] = useState<Address>();
  const [transactionData, setTransactionData] = useState<TransactionReceipt>();
  const [transaction, setTransaction] = useState<Transaction>();
  const [isLoading, setIsLoading] = useState(false);
  const { getTractionFromHash, getTransaction } = useTokenContract();

  const handleFetchTransaction = async () => {
    if (!hash) return;
    try {
      setIsLoading(true);
      const [receiptResult, transactionResult] = await Promise.all([
        getTractionFromHash(hash as Address),
        getTransaction(hash as Address),
      ]);
      setTransactionData(receiptResult);
      setTransaction(transactionResult);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Enter transaction hash (0x...)"
            value={hash}
            onChange={(e) => setHash(e.target.value as `0x${string}`)}
            className="flex-1"
          />
          <Button
            onClick={handleFetchTransaction}
            disabled={!hash?.startsWith("0x") || hash.length !== 66}
          >
            Fetch Details
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">
            Loading transaction details...
          </div>
        ) : (
          <div className="space-y-4">
            {hash && (
              <div className="grid gap-2">
                <Label className="font-medium">Transaction Hash</Label>
                <div className="text-sm break-all bg-gray-100 p-2 rounded-md">
                  {hash}
                </div>
              </div>
            )}

            {transaction && (
              <div className="grid gap-2">
                <Label className="font-medium">Nonce</Label>
                <div className="text-sm bg-gray-100 p-2 rounded-md">
                  {transaction.nonce}
                </div>
              </div>
            )}

            {transactionData && (
              <>
                <div className="grid gap-2">
                  <Label className="font-medium">Block Hash</Label>
                  <div className="text-sm break-all bg-gray-100 p-2 rounded-md">
                    {transactionData.blockHash}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="font-medium">Block Number</Label>
                  <div className="text-sm bg-gray-100 p-2 rounded-md">
                    {transactionData.blockNumber.toString() ||
                      "Unable to find this block number, please check on the sepolia testnet..."}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="font-medium">From</Label>
                  <div className="text-sm break-all bg-gray-100 p-2 rounded-md">
                    {transactionData.from}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="font-medium">To</Label>
                  <div className="text-sm break-all bg-gray-100 p-2 rounded-md">
                    {transactionData.to}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="font-medium">Status</Label>
                  <div
                    className={clsx(
                      "text-sm p-2 rounded-md",
                      transactionData.status === "success"
                        ? "bg-green-300/70"
                        : "bg-red-300/70"
                    )}
                  >
                    {transactionData.status.charAt(0).toUpperCase() +
                      transactionData.status.slice(1)}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="font-medium">Gas Used</Label>
                  <div className="text-sm bg-gray-100 p-2 rounded-md">
                    {transactionData.gasUsed.toString()}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
