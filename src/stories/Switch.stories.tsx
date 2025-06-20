import React, { useState } from "react";
import { Switch } from "../components/ui/switch";

export default {
  title: "UI/Switch",
  component: Switch,
};

export const Default = () => <Switch />;

export const Controlled = () => {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} />;
};
