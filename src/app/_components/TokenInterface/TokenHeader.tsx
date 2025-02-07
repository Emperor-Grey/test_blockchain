"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenContract } from "@/hooks/useTokenContract";
import { Loader2, Power, Wallet2 } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function TokenHeader({
  onConnectClick,
}: {
  onConnectClick?: () => void;
}) {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { getBalance, getSymbol } = useTokenContract();

  const [balance, setBalance] = useState<bigint | undefined>(undefined);
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleConnect = () => {
    connect({ connector: connectors[0] });
    onConnectClick?.();
  };

  useEffect(() => {
    if (account.address) {
      const fetchTokenData = async () => {
        setIsLoading(true);
        setError(undefined);
        try {
          const fetchedBalance = await getBalance(account.address as string);
          const fetchedSymbol = await getSymbol();
          setBalance(fetchedBalance as bigint);
          setSymbol(fetchedSymbol as string);
        } catch (err) {
          setError("Error fetching token data");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTokenData();
    }
  }, [account.address, getBalance, getSymbol]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              className="size-10"
              src="https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg"
            />
            <AvatarFallback>DWG</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">Dawg Token</CardTitle>
          <div className="flex flex-col items-start">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : balance && symbol ? (
              <Badge variant="secondary" className="text-lg">
                {balance.toString()} {symbol}
              </Badge>
            ) : (
              <span>No data</span>
            )}
          </div>
        </div>
        {account.status === "connected" ? (
          <Button
            variant="destructive"
            onClick={() => disconnect()}
            className="flex items-center gap-2"
          >
            <Power size={16} />
            Disconnect
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleConnect}
            className="flex items-center gap-2"
          >
            <Wallet2 size={16} />
            Connect Wallet
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
