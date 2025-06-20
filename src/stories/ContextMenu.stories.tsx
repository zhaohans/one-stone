import React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../components/ui/context-menu";

export default {
  title: "UI/ContextMenu",
  component: ContextMenu,
};

export const Default = () => (
  <ContextMenu>
    <ContextMenuTrigger asChild>
      <div
        style={{
          width: 200,
          height: 100,
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Right-click me
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Item 1</ContextMenuItem>
      <ContextMenuItem>Item 2</ContextMenuItem>
      <ContextMenuItem>Item 3</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
);
