"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTokenContract } from "@/hooks/useTokenContract";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { Address, isAddress } from "viem";

interface TransferFormState {
  recipient: string;
  amount: string;
}

interface TransferFormErrors {
  recipient?: string;
  amount?: string;
  general?: string;
}

export function TransferTab() {
  const [formState, setFormState] = useState<TransferFormState>({
    recipient: "",
    amount: "",
  });
  const [txhash, setTxHash] = useState<Address | undefined>();
  const [errors, setErrors] = useState<TransferFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { transfer, getBalance } = useTokenContract();
  const account = useAccount();

  const validateForm = async (): Promise<boolean> => {
    const newErrors: TransferFormErrors = {};

    if (!formState.recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!isAddress(formState.recipient)) {
      newErrors.recipient = "Invalid Ethereum address";
    }

    if (!formState.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formState.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else {
      try {
        // No balance like my pocket
        const balance = await getBalance(account.address as string);
        const amount = BigInt(formState.amount);
        if (amount > (balance as bigint)) {
          newErrors.amount = "Insufficient balance";
        }
      } catch (error) {
        newErrors.amount = "Error checking balance";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TransferFormState
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      general: undefined,
    }));
    setSuccess(false);
  };

  const handleTransfer = async () => {
    if (!account.address) return;

    setSuccess(false);
    const isValid = await validateForm();

    if (!isValid) return;

    setLoading(true);
    try {
      const { txHash } = await transfer(
        formState.recipient,
        BigInt(formState.amount)
      );
      setSuccess(true);
      setTxHash(txHash);
      setFormState({ recipient: "", amount: "" });
    } catch (error) {
      console.error("Transfer error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Transaction failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Recipient Address (0x...)"
            value={formState.recipient}
            onChange={(e) => handleInputChange(e, "recipient")}
            disabled={loading}
            className={errors.recipient ? "border-red-500" : ""}
          />
          {errors.recipient && (
            <p className="text-sm text-red-500">{errors.recipient}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Amount"
            type="number"
            min="0"
            step="any"
            value={formState.amount}
            onChange={(e) => handleInputChange(e, "amount")}
            disabled={loading}
            className={errors.amount ? "border-red-500" : ""}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        {errors.general && (
          <Alert variant="destructive">
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Transfer completed successfully!{" "}
              <span className="break-words max-w-full">{txhash}</span>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleTransfer}
          className="w-full"
          disabled={loading || !account.address}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            "Transfer"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
