import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../components/ui/resizable";

export default {
  title: "UI/Resizable",
};

export const Default = () => (
  <ResizablePanelGroup
    style={{ width: 400, height: 200, border: "1px solid #ccc" }}
    direction="horizontal"
  >
    <ResizablePanel
      defaultSize={50}
      style={{ background: "#f5f5f5", padding: 16 }}
    >
      Panel 1
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel
      defaultSize={50}
      style={{ background: "#e0e0e0", padding: 16 }}
    >
      Panel 2
    </ResizablePanel>
  </ResizablePanelGroup>
);
