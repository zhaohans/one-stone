import React from "react";
import { Input } from "../components/ui/input";

export default {
  title: "UI/Input",
  component: Input,
};

export const Default = () => <Input placeholder="Type here..." />;
export const Disabled = () => <Input placeholder="Disabled" disabled />;
export const WithValue = () => <Input defaultValue="Pre-filled value" />;
