import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../components/ui/hover-card";

export default {
  title: "UI/HoverCard",
  component: HoverCard,
};

export const Default = () => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <button>Hover me</button>
    </HoverCardTrigger>
    <HoverCardContent>Hover card content</HoverCardContent>
  </HoverCard>
);
