import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../components/ui/tooltip";

export default {
  title: "UI/TooltipProvider",
  component: TooltipProvider,
};

export const Default = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button>Hover me</button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
