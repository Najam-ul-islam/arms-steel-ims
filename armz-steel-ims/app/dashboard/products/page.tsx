// "use client";

// import { Suspense } from "react";
// import { Plus } from "lucide-react";
// import { ProductList } from "@/components/dashboard/products/product-list";
// import { Button } from "@/components/ui/button";
// import { ProductModal } from "@/components/dashboard/products/product-modal";
// import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

// export default function ProductsPage() {
//   return (
//     <div className="flex-1 space-y-4 p-8 pt-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-3xl font-bold tracking-tight">Products</h2>
//         <ProductModal>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Product
//           </Button>
//         </ProductModal>
//       </div>

//       <Suspense fallback={<DashboardSkeleton />}>
//         <ProductList />
//       </Suspense>
//     </div>
//   );
// }



"use client";

import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { ProductList } from "@/components/dashboard/products/product-list";
import { Button } from "@/components/ui/button";
import { ProductModal } from "@/components/dashboard/products/product-modal";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function ProductsPage() {
  const [refreshFlag, setRefreshFlag] = useState(false);


  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <ProductModal onClose={triggerRefresh} open={false}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </ProductModal>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ProductList refreshKey={refreshFlag} />
      </Suspense>
    </div>
  );
}


