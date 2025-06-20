import React from "react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

export default {
  title: "UI/Sonner",
};

export const Default = () => (
  <div>
    <button onClick={() => toast("Hello from Sonner!")}>Show Toast</button>
    <Toaster />
  </div>
);
