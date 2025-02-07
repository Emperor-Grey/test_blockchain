"use client";

import { useAccount, useBalance, useEnsName } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useTokenContract } from "@/hooks/useTokenContract";
import { useEffect, useState } from "react";

export function AccountStatus() {
  const account = useAccount();
  const { data: ensName } = useEnsName({ address: account.address });
  const { data: nativeBalance, isLoading: isBalanceLoading } = useBalance({
    address: account.address,
  });

  const { getBalance, getTotalSupply, getName, getSymbol } = useTokenContract();
  const [tokenData, setTokenData] = useState({
    balance: undefined as bigint | undefined,
    totalSupply: undefined as bigint | undefined,
    name: undefined as string | undefined,
    symbol: undefined as string | undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (account.address) {
        const [balance, totalSupply, name, symbol] = await Promise.all([
          getBalance(account.address),
          getTotalSupply(),
          getName(),
          getSymbol(),
        ]);
        setTokenData({
          balance: balance as bigint,
          totalSupply: totalSupply as bigint,
          name: name as string,
          symbol: symbol as string,
        });
      }
    };
    fetchData();
  }, [account.address, getBalance, getName, getSymbol, getTotalSupply]);

  if (account.status !== "connected") return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Account Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-mono text-sm sm:break-words max-w-full break-all">
                {account.address}
              </p>
              {ensName && <Badge variant="secondary">{ensName}</Badge>}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Coin Name</p>
            {isBalanceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : (
              <p>
                {tokenData.name} ({tokenData.symbol})
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Native Balance</p>
            {isBalanceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : (
              <p>
                {nativeBalance?.formatted} {nativeBalance?.symbol}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Status</p>
            <Badge variant="default" className="capitalize">
              {account.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Token Balance</p>
            {isBalanceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : (
              <p>
                {tokenData.balance?.toString()} {tokenData.symbol}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Total Supply</p>
              {isBalanceLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              ) : (
                <p className="font-mono text-sm">
                  {tokenData.totalSupply?.toString() || 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
