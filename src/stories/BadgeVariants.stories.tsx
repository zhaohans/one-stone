import React from "react";
import { Badge } from "../components/ui/badge";
import { badgeVariants } from "../components/ui/badge-variants";

export default {
  title: "UI/BadgeVariants",
};

export const AllVariants = () => (
  <div style={{ display: "flex", gap: 8 }}>
    <Badge className={badgeVariants({ variant: "default" })}>Default</Badge>
    <Badge className={badgeVariants({ variant: "success" })}>Success</Badge>
    <Badge className={badgeVariants({ variant: "warning" })}>Warning</Badge>
    <Badge className={badgeVariants({ variant: "error" })}>Error</Badge>
    <Badge className={badgeVariants({ variant: "info" })}>Info</Badge>
  </div>
);
