import React, { useState } from "react";
import { DatePickerWithRange } from "../components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

export default {
  title: "UI/DateRangePicker",
  component: DatePickerWithRange,
};

export const Default = () => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  return <DatePickerWithRange date={date} setDate={setDate} />;
};
