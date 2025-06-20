import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";

export default {
  title: "UI/Popover",
  component: Popover,
};

export const Default = () => (
  <Popover>
    <PopoverTrigger asChild>
      <button>Open Popover</button>
    </PopoverTrigger>
    <PopoverContent>
      <div>This is the popover content.</div>
    </PopoverContent>
  </Popover>
);
