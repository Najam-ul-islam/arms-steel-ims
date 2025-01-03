import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <Skeleton className="h-[300px] w-full" />
        </Card>
        <Card className="col-span-3 p-6">
          <Skeleton className="h-4 w-1/2 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mt-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}