import React from "react";
import { Menubar } from "../components/ui/menubar";

export default {
  title: "UI/Menubar",
  component: Menubar,
};

export const Default = () => (
  <Menubar>
    <a href="#">File</a>
    <a href="#">Edit</a>
    <a href="#">View</a>
  </Menubar>
);
