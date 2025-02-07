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

interface TransferFromFormState {
  sender: string;
  recipient: string;
  amount: string;
}

interface TransferFromFormErrors {
  sender?: string;
  recipient?: string;
  amount?: string;
  general?: string;
}

export function TransferFromTab() {
  const [formState, setFormState] = useState<TransferFromFormState>({
    sender: "",
    recipient: "",
    amount: "",
  });
  const [txhash, setTxHash] = useState<Address | undefined>();
  const [errors, setErrors] = useState<TransferFromFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { transferFrom, getAllowance, getBalance } = useTokenContract();
  const account = useAccount();

  const validateForm = async (): Promise<boolean> => {
    const newErrors: TransferFromFormErrors = {};

    if (!formState.sender) {
      newErrors.sender = "Sender address is required";
    } else if (!isAddress(formState.sender)) {
      newErrors.sender = "Invalid sender address";
    }

    if (!formState.recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!isAddress(formState.recipient)) {
      newErrors.recipient = "Invalid recipient address";
    }

    if (!formState.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formState.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else {
      try {
        const balance = await getBalance(formState.sender);
        const amount = BigInt(formState.amount);
        if (amount > (balance as bigint)) {
          newErrors.amount = "Insufficient balance in sender's account";
        }

        const allowance = await getAllowance(
          formState.sender,
          account.address as string
        );
        if (amount > (allowance as bigint)) {
          newErrors.amount = "Insufficient allowance to transfer this amount";
        }
      } catch (error) {
        newErrors.general = "Error checking balance and allowance";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TransferFromFormState
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

  const handleTransferFrom = async () => {
    if (!account.address) return;

    setSuccess(false);
    const isValid = await validateForm();

    if (!isValid) return;

    setLoading(true);
    try {
      const { txHash } = await transferFrom(
        formState.sender,
        formState.recipient,
        BigInt(formState.amount)
      );
      setSuccess(true);
      setTxHash(txHash);
      setFormState({ sender: "", recipient: "", amount: "" });
    } catch (error) {
      console.error("TransferFrom error:", error);
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
        <CardTitle>Transfer From</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="From Address (0x...)"
            value={formState.sender}
            onChange={(e) => handleInputChange(e, "sender")}
            disabled={loading}
            className={errors.sender ? "border-red-500" : ""}
          />
          {errors.sender && (
            <p className="text-sm text-red-500">{errors.sender}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="To Address (0x...)"
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
              Transfer completed successfully!{""}
              <span className="break-words max-w-full">{txhash}</span>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleTransferFrom}
          className="w-full"
          disabled={loading || !account.address}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            "Transfer From"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
