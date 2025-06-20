import React from "react";
import { Button } from "../components/ui/button";
import { buttonVariants } from "../components/ui/button-variants";

export default {
  title: "UI/ButtonVariants",
};

export const AllVariants = () => (
  <div style={{ display: "flex", gap: 8 }}>
    <Button className={buttonVariants({ variant: "default" })}>Default</Button>
    <Button className={buttonVariants({ variant: "outline" })}>Outline</Button>
    <Button className={buttonVariants({ variant: "destructive" })}>
      Destructive
    </Button>
    <Button className={buttonVariants({ variant: "ghost" })}>Ghost</Button>
  </div>
);
