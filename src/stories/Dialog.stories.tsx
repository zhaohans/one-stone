import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

export default {
  title: "UI/Dialog",
  component: Dialog,
};

export const Default = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button>Open Dialog</button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogDescription>This is a dialog description.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
