import React from "react";
import { Breadcrumb } from "../components/ui/breadcrumb";

export default {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
};

export const Default = () => (
  <Breadcrumb>
    <a href="#">Home</a> / <a href="#">Library</a> / <span>Data</span>
  </Breadcrumb>
);
