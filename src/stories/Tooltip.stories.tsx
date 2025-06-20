import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../components/ui/tooltip";

export default {
  title: "UI/Tooltip",
  component: Tooltip,
};

export const Default = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button style={{ margin: 40 }}>Hover me</button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
