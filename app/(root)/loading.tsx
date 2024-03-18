import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function Loading() {
  console.log("Array(5) :>> ", Array(5).fill(""));
  return (
    <div className="flex flex-col gap-10 p-8">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        ))}
    </div>
  );
}

export default Loading;
