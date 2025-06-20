import React from "react";
import { NavigationMenu } from "../components/ui/navigation-menu";

export default {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
};

export const Default = () => (
  <NavigationMenu>
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </NavigationMenu>
);
