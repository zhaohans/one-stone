import React, { useState } from "react";
import { Toggle } from "../components/ui/toggle";

export default {
  title: "UI/Toggle",
  component: Toggle,
};

export const Default = () => <Toggle>Default</Toggle>;
export const Outline = () => <Toggle variant="outline">Outline</Toggle>;
export const Controlled = () => {
  const [on, setOn] = useState(false);
  return (
    <Toggle pressed={on} onPressedChange={setOn}>
      Controlled
    </Toggle>
  );
};
