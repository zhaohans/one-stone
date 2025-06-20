import React from "react";
import { Skeleton } from "../components/ui/skeleton";

export default {
  title: "UI/SkeletonVariants",
};

export const AllVariants = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Skeleton className="w-32 h-8" />
    <Skeleton className="w-8 h-8 rounded-full" />
    <Skeleton className="w-16 h-4" />
    <Skeleton className="w-24 h-6" />
  </div>
);
