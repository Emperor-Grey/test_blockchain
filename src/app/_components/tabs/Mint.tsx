"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTokenContract } from "@/hooks/useTokenContract";
import { useAccount } from "wagmi";
import { isAddress } from "viem";

interface MintFormState {
  receiver: string;
  amount: string;
}

interface MintFormErrors {
  receiver?: string;
  amount?: string;
  general?: string;
}

export function MintTab() {
  const [formState, setFormState] = useState<MintFormState>({
    receiver: "",
    amount: "",
  });
  const [errors, setErrors] = useState<MintFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [minterAddress, setMinterAddress] = useState<string>();

  const account = useAccount();
  const { mint, getMinter } = useTokenContract();

  useEffect(() => {
    const fetchMinter = async () => {
      try {
        const minter = await getMinter();
        setMinterAddress(minter as string);
      } catch (error) {
        console.error("Error fetching minter:", error);
        setErrors((prev) => ({
          ...prev,
          general: "Error fetching minter address",
        }));
      }
    };
    fetchMinter();
  }, [getMinter]);

  const validateForm = (): boolean => {
    const newErrors: MintFormErrors = {};

    if (!formState.receiver) {
      newErrors.receiver = "Receiver address is required";
    } else if (!isAddress(formState.receiver)) {
      newErrors.receiver = "Invalid receiver address";
    }

    if (!formState.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(formState.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof MintFormState
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

  const handleMint = async () => {
    if (!account.address || account.address !== minterAddress) return;

    setSuccess(false);
    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      await mint(formState.receiver, BigInt(formState.amount));
      setSuccess(true);
      setFormState({ receiver: "", amount: "" });
    } catch (error) {
      console.error("Mint error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Minting failed. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Receiver Address (0x...)"
            value={formState.receiver}
            onChange={(e) => handleInputChange(e, "receiver")}
            disabled={loading}
            className={errors.receiver ? "border-red-500" : ""}
          />
          {errors.receiver && (
            <p className="text-sm text-red-500">{errors.receiver}</p>
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
              Tokens minted successfully!
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleMint}
          className="w-full"
          disabled={loading || account.address !== minterAddress}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            "Mint Tokens"
          )}
        </Button>

        {account.address !== minterAddress && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Only the minter can mint new tokens
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
