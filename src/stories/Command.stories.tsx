import React from "react";
import { Command } from "../components/ui/command";

export default {
  title: "UI/Command",
  component: Command,
};

export const Default = () => (
  <Command>
    <div>Command 1</div>
    <div>Command 2</div>
    <div>Command 3</div>
  </Command>
);
