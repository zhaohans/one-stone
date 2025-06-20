import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";

export default {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
};

export const Default = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button>Open Dropdown</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Item 1</DropdownMenuItem>
      <DropdownMenuItem>Item 2</DropdownMenuItem>
      <DropdownMenuItem>Item 3</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
