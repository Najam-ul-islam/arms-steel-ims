

"use client";

import { useState } from "react";
import { Plus, Search, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionTable  } from "@/components/dashboard/transactions/transaction-table";
// import { AddTransactionDialog } from "@/components/dashboard/transactions/add-transaction-dialog";

export default function TransactionsPage() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        {/* <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button> */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-8" />
          </div>
        </div>
        {/* <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="Purchase">Purchase</SelectItem>
            <SelectItem value="Sales">Sales	</SelectItem>
            {/* <SelectItem value="adjustment">Adjustment</SelectItem> */}
          {/* </SelectContent>
        </Select>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        // </Button> */} 
      </div>

      <TransactionTable transactions={undefined} onTransactionUpdate={function (): void {
        throw new Error("Function not implemented.");
      } } />
      
      {/* <AddTransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={function (): void {
        throw new Error("Function not implemented.");
      } } /> */}
    </div>
  );
}













// "use client";

// import { useState } from "react";
// import { Plus, Search, FileDown, Filter } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { TransactionTable  } from "@/components/dashboard/transactions/transaction-table";
// // import { AddTransactionDialog } from "@/components/dashboard/transactions/add-transaction-dialog";

// export default function TransactionsPage() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
//         {/* <Button onClick={() => setIsDialogOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Transaction
//         </Button> */}
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="flex-1">
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input placeholder="Search transactions..." className="pl-8" />
//           </div>
//         </div>
//         <Select defaultValue="all">
//           <SelectTrigger className="w-[180px]">
//             <Filter className="mr-2 h-4 w-4" />
//             <SelectValue placeholder="Transaction Type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Transactions</SelectItem>
//             <SelectItem value="Purchase">Purchase</SelectItem>
//             <SelectItem value="Sales">Sales	</SelectItem>
//             {/* <SelectItem value="adjustment">Adjustment</SelectItem> */}
//           </SelectContent>
//         </Select>
//         <Button variant="outline">
//           <FileDown className="mr-2 h-4 w-4" />
//           Export
//         </Button>
//       </div>

//       <TransactionTable transactions={undefined} onTransactionUpdate={function (): void {
//         throw new Error("Function not implemented.");
//       } } />
      
//       {/* <AddTransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={function (): void {
//         throw new Error("Function not implemented.");
//       } } /> */}
//     </div>
//   );
// }