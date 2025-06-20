import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../components/ui/sheet";

export default {
  title: "UI/Sheet",
  component: Sheet,
};

export const Default = () => (
  <Sheet>
    <SheetTrigger asChild>
      <button>Open Sheet</button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Sheet Title</SheetTitle>
        <SheetDescription>This is a sheet description.</SheetDescription>
      </SheetHeader>
      <SheetFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
