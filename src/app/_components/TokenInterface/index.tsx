"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import TransactionDetails from "./TransactionDetails";
import { AccountStatus } from "./AccountStatus";
import { TokenTabs } from "./TokenTabs";
import TokenHeader from "./TokenHeader";
import { useAccount } from "wagmi";

const OperationNode = ({ x, y, address, balance, isHighlighted }) => (
  <motion.div
    className="absolute flex flex-col items-center justify-start"
    style={{ left: `${x}%`, top: y }}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{
      scale: isHighlighted ? 1.2 : 1,
      opacity: 1,
      rotate: isHighlighted ? [0, -5, 5, 0] : 0,
      boxShadow: isHighlighted
        ? "0px 0px 30px rgba(124, 58, 237, 0.4)"
        : "none",
    }}
    transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
  >
    <div className="w-32 h-32 bg-card border-4 border-primary/20 rounded-3xl shadow-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110">
      <div className="relative">
        <div className="w-20 h-20 bg-primary/20 rounded-2xl absolute -inset-4 animate-pulse" />
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
          <div className="w-6 h-6 bg-primary-foreground rounded-xl" />
        </div>
      </div>
    </div>
    <div className="mt-4 text-sm font-medium text-muted-foreground truncate w-full text-center">
      {address.slice(0, 6)}...{address.slice(-4)}
    </div>
    <div className="mt-1 text-sm font-bold text-primary">{balance} DWG</div>
  </motion.div>
);

const TransferAnimation = ({
  startX,
  startY,
  endX,
  endY,
  amount,
  isActive,
}) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="absolute flex items-center justify-center"
        initial={{ x: `${startX}%`, y: startY + 64, opacity: 0, scale: 0 }}
        animate={{
          x: `${endX}%`,
          y: endY + 64,
          opacity: [0, 1, 1, 0],
          scale: [0, 1.5, 1.5, 0],
          rotate: [0, 360],
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="absolute -inset-3 bg-emerald-500/30 rounded-xl blur-lg animate-pulse" />
          <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-lg">
            {amount}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const AnimationText = ({ currentOperation }) => {
  const operations = [
    { name: "mint", description: "Minting tokens" },
    { name: "transfer", description: "Transferring tokens" },
    { name: "approve", description: "Approving tokens" },
  ];

  return (
    <motion.div
      key={currentOperation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center p-6 text-xl font-medium text-primary"
    >
      {operations[currentOperation].description}
    </motion.div>
  );
};

const TokenOperations = () => {
  const [currentOperation, setCurrentOperation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const operations = [
    {
      name: "mint",
      description: "Minting tokens",
      from: { x: 15, y: 100, address: "0x0000...0000" },
      to: { x: 75, y: 100, address: "0x1234...5678", balance: "100" },
      amount: "100",
    },
    {
      name: "transfer",
      description: "Transferring tokens",
      from: { x: 15, y: 300, address: "0x1234...5678", balance: "80" },
      to: { x: 75, y: 300, address: "0x5678...9ABC", balance: "20" },
      amount: "20",
    },
    {
      name: "approve",
      description: "Approving tokens",
      from: { x: 15, y: 500, address: "0x1234...5678", balance: "50" },
      to: { x: 75, y: 500, address: "0x9ABC...DEF0", balance: "0" },
      amount: "30",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setCurrentOperation((prev) => (prev + 1) % operations.length);
      }, 2000);
    }, 4000);
    return () => clearInterval(timer);
  }, [operations.length]);

  const currentOp = operations[currentOperation];

  return (
    <div className="relative w-full h-auto p-4 pb-32 bg-gradient-to-br from-background to-primary/5 rounded-3xl overflow-hidden">
      <AnimationText currentOperation={currentOperation} />
      <div className="relative w-full h-[640px]">
        {operations.map((op, index) => (
          <React.Fragment key={index}>
            <OperationNode
              x={op.from.x}
              y={op.from.y}
              address={op.from.address}
              balance={op.from.balance}
              isHighlighted={currentOperation === index && isAnimating}
            />
            <OperationNode
              x={op.to.x}
              y={op.to.y}
              address={op.to.address}
              balance={op.to.balance}
              isHighlighted={currentOperation === index && isAnimating}
            />
          </React.Fragment>
        ))}
        <TransferAnimation
          startX={currentOp.from.x}
          startY={currentOp.from.y}
          endX={currentOp.to.x}
          endY={currentOp.to.y}
          amount={currentOp.amount}
          isActive={isAnimating}
        />
      </div>
    </div>
  );
};

const TokenInterface = () => {
  const account = useAccount();

  return (
    <div className="bg-gradient-to-br from-background to-primary/5 p-8">
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <TokenHeader />
          {account.status === "connected" ? (
            <>
              <TokenTabs />
              <AccountStatus />
              <TransactionDetails />
            </>
          ) : (
            <Card className="overflow-hidden">
              <CardContent className="py-12 text-center text-muted-foreground font-medium">
                Please connect your wallet to interact with the token
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:pl-8">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <TokenOperations />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TokenInterface;
