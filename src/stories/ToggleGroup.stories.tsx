import React from "react";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";

export default {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
};

export const Default = () => (
  <ToggleGroup type="single" defaultValue="1">
    <ToggleGroupItem value="1">One</ToggleGroupItem>
    <ToggleGroupItem value="2">Two</ToggleGroupItem>
    <ToggleGroupItem value="3">Three</ToggleGroupItem>
  </ToggleGroup>
);
