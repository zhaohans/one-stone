import React from "react";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

export default {
  title: "UI/Alert",
  component: Alert,
};

export const Default = () => (
  <Alert>
    <AlertTitle>Default Alert</AlertTitle>
    <AlertDescription>This is a default alert.</AlertDescription>
  </Alert>
);

export const Destructive = () => (
  <Alert variant="destructive">
    <AlertTitle>Destructive Alert</AlertTitle>
    <AlertDescription>This is a destructive alert.</AlertDescription>
  </Alert>
);
