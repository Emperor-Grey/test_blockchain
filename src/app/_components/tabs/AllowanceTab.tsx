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

interface AllowanceFormState {
  owner: string;
  spender: string;
}

interface AllowanceFormErrors {
  owner?: string;
  spender?: string;
  general?: string;
}

export function AllowanceTab() {
  const [formState, setFormState] = useState<AllowanceFormState>({
    owner: "",
    spender: "",
  });
  const [errors, setErrors] = useState<AllowanceFormErrors>({});
  const [allowance, setAllowance] = useState<bigint>();
  const [symbol, setSymbol] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { getAllowance, getSymbol } = useTokenContract();

  useEffect(() => {
    const fetchSymbol = async () => {
      try {
        const sym = await getSymbol();
        setSymbol(sym as string);
      } catch (error) {
        console.error("Error fetching symbol:", error);
      }
    };
    fetchSymbol();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: AllowanceFormErrors = {};

    if (!formState.owner) {
      newErrors.owner = "Owner address is required";
    } else if (!isAddress(formState.owner)) {
      newErrors.owner = "Invalid owner address";
    }

    if (!formState.spender) {
      newErrors.spender = "Spender address is required";
    } else if (!isAddress(formState.spender)) {
      newErrors.spender = "Invalid spender address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // GPT Magic (ps- i wrote this very wrong)
  // todo: revise form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AllowanceFormState
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
  };

  useEffect(() => {
    const fetchAllowance = async () => {
      if (formState.owner && formState.spender && validateForm()) {
        setLoading(true);
        try {
          const result = await getAllowance(formState.owner, formState.spender);
          setAllowance(result as bigint);
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            general: "Error fetching allowance",
          }));
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAllowance();
  }, [formState.owner, formState.spender, getAllowance, validateForm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Allowance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Owner Address (0x...)"
            value={formState.owner}
            onChange={(e) => handleInputChange(e, "owner")}
            className={errors.owner ? "border-red-500" : ""}
          />
          {errors.owner && (
            <p className="text-sm text-red-500">{errors.owner}</p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Spender Address (0x...)"
            value={formState.spender}
            onChange={(e) => handleInputChange(e, "spender")}
            className={errors.spender ? "border-red-500" : ""}
          />
          {errors.spender && (
            <p className="text-sm text-red-500">{errors.spender}</p>
          )}
        </div>

        {errors.general && (
          <Alert variant="destructive">
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-gray-100 rounded">
          <p className="text-sm font-medium">Current Allowance:</p>
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <p className="text-lg">
                {String(allowance || 0)} {symbol}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
