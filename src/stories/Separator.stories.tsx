import React from "react";
import { Separator } from "../components/ui/separator";

export default {
  title: "UI/Separator",
  component: Separator,
};

export const Horizontal = () => <Separator />;
export const Vertical = () => (
  <Separator orientation="vertical" className="h-20" />
);
