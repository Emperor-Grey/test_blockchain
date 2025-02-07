import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, Users, Lock, CreditCard, Factory } from "lucide-react";
import { TransferFromTab } from "../tabs/TransferFromTab";
import { ApproveTab } from "../tabs/ApproveTab";
import { AllowanceTab } from "../tabs/AllowanceTab";
import { MintTab } from "../tabs/Mint";
import { TransferTab } from "../tabs/TransferTab";

// for this one thing to work i had to go through the docs too much time waste (not really)
export function TokenTabs() {
  return (
    <Tabs defaultValue="transfer" className="space-y-4">
      <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
        <TabsTrigger value="transfer" className="flex items-center gap-2">
          <ArrowLeftRight size={16} />
          Transfer
        </TabsTrigger>
        <TabsTrigger value="transferFrom" className="flex items-center gap-2">
          <Users size={16} />
          TransferFrom
        </TabsTrigger>
        <TabsTrigger value="approve" className="flex items-center gap-2">
          <Lock size={16} />
          Approve
        </TabsTrigger>
        <TabsTrigger value="allowance" className="flex items-center gap-2">
          <CreditCard size={16} />
          Allowance
        </TabsTrigger>
        <TabsTrigger value="mint" className="flex items-center gap-2">
          <Factory size={16} />
          Mint
        </TabsTrigger>
      </TabsList>

      <TabsContent value="transfer">
        <TransferTab />
      </TabsContent>
      <TabsContent value="transferFrom">
        <TransferFromTab />
      </TabsContent>
      <TabsContent value="approve">
        <ApproveTab />
      </TabsContent>
      <TabsContent value="allowance">
        <AllowanceTab />
      </TabsContent>
      <TabsContent value="mint">
        <MintTab />
      </TabsContent>
    </Tabs>
  );
}
