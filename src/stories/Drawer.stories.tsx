import React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "../components/ui/drawer";

export default {
  title: "UI/Drawer",
  component: Drawer,
};

export const Default = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <button>Open Drawer</button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Drawer Title</DrawerTitle>
        <DrawerDescription>This is a drawer description.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);
