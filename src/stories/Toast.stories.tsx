import React from "react";
import { Toast, ToastTitle, ToastDescription } from "../components/ui/toast";
import { ToastProvider } from "../components/ui/toast-manager";

export default {
  title: "UI/Toast",
  component: Toast,
};

export const Default = () => (
  <ToastProvider>
    <Toast open>
      <ToastTitle>Toast Title</ToastTitle>
      <ToastDescription>This is a toast message.</ToastDescription>
    </Toast>
  </ToastProvider>
);
