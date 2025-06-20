import React from "react";
import { Button } from "../components/ui/button";

export default {
  title: "UI/Button",
  component: Button,
};

export const Default = () => <Button>Default Button</Button>;
export const Destructive = () => (
  <Button variant="destructive">Destructive</Button>
);
export const Outline = () => <Button variant="outline">Outline</Button>;
export const Ghost = () => <Button variant="ghost">Ghost</Button>;
export const Small = () => <Button size="sm">Small</Button>;
export const Large = () => <Button size="lg">Large</Button>;
