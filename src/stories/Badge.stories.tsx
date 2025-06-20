import React from "react";
import { Badge } from "../components/ui/badge";

export default {
  title: "UI/Badge",
  component: Badge,
};

export const Default = () => <Badge>Default Badge</Badge>;
export const Secondary = () => (
  <Badge variant="secondary">Secondary Badge</Badge>
);
export const Destructive = () => (
  <Badge variant="destructive">Destructive Badge</Badge>
);
export const Outline = () => <Badge variant="outline">Outline Badge</Badge>;
