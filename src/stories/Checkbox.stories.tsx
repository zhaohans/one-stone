import React, { useState } from "react";
import { Checkbox } from "../components/ui/checkbox";

export default {
  title: "UI/Checkbox",
  component: Checkbox,
};

export const Default = () => <Checkbox />;

export const Controlled = () => {
  const [checked, setChecked] = useState<false | true | "indeterminate">(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
};
