import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

export default {
  title: "UI/Avatar",
  component: Avatar,
};

export const WithImage = () => (
  <Avatar>
    <AvatarImage src="https://i.pravatar.cc/100" alt="Avatar" />
    <AvatarFallback>AB</AvatarFallback>
  </Avatar>
);

export const Fallback = () => (
  <Avatar>
    <AvatarFallback>CD</AvatarFallback>
  </Avatar>
);
