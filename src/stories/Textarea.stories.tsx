import React from "react";
import { Textarea } from "../components/ui/textarea";

export default {
  title: "UI/Textarea",
  component: Textarea,
};

export const Default = () => <Textarea placeholder="Type here..." />;
export const Disabled = () => <Textarea placeholder="Disabled" disabled />;
export const WithValue = () => <Textarea defaultValue="Pre-filled value" />;
