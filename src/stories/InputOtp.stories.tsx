import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";

export default {
  title: "UI/InputOTP",
  component: InputOTP,
};

export const Default = () => {
  const [value, setValue] = useState("");
  return (
    <InputOTP value={value} onChange={setValue} maxLength={4}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
};
