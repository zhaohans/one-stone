import React from "react";
import { RadioGroup } from "../components/ui/radio-group";

export default {
  title: "UI/RadioGroup",
  component: RadioGroup,
};

export const Default = () => (
  <RadioGroup defaultValue="1">
    <label>
      <input type="radio" name="group" value="1" defaultChecked /> Option 1
    </label>
    <label>
      <input type="radio" name="group" value="2" /> Option 2
    </label>
    <label>
      <input type="radio" name="group" value="3" /> Option 3
    </label>
  </RadioGroup>
);
