"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTokenContract } from "@/hooks/useTokenContract";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { isAddress } from "viem";

interface ApproveFormState {
  spender: string;
  amount: string;
}

interface ApproveFormErrors {
  spender?: string;
  amount?: string;
  general?: string;
}

export function ApproveTab() {
  const [formState, setFormState] = useState<ApproveFormState>({
    spender: "",
    amount: "",
  });
  const [errors, setErrors] = useState<ApproveFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { approve, getBalance } = useTokenContract();
  const account = useAccount();

  const validateForm = async (): Promise<boolean> => {
    const newErrors: ApproveFormErrors = {};

    if (!formState.spender) {
      newErrors.spender = "Spender address is required";
    } else if (!isAddress(formState.spender)) {
      newErrors.spender = "Invalid spender address";
    }

    if (!formState.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formState.amount) < 0) {
      newErrors.amount = "Amount must be greater than or equal to 0";
    } else {
      try {
        // dude, he doesn't have enough balance
        const balance = await getBalance(account.address as string);
        const amount = BigInt(formState.amount);
        if (amount > (balance as bigint)) {
          newErrors.amount = "Amount exceeds your balance";
        }
      } catch (error) {
        newErrors.general = "Error checking balance";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ApproveFormState
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

  const handleApprove = async () => {
    if (!account.address) return;

    setSuccess(false);
    const isValid = await validateForm();

    if (!isValid) return;

    setLoading(true);
    try {
      await approve(formState.spender, BigInt(formState.amount));
      setSuccess(true);
      setFormState({ spender: "", amount: "" });
    } catch (error) {
      console.error("Approve error:", error);
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
        <CardTitle>Approve Spender</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Spender Address (0x...)"
            value={formState.spender}
            onChange={(e) => handleInputChange(e, "spender")}
            disabled={loading}
            className={errors.spender ? "border-red-500" : ""}
          />
          {errors.spender && (
            <p className="text-sm text-red-500">{errors.spender}</p>
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
              Approval completed successfully!
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleApprove}
          className="w-full"
          disabled={loading || !account.address}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            "Approve"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
