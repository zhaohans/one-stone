import React from "react";
import { ScrollArea } from "../components/ui/scroll-area";

export default {
  title: "UI/ScrollArea",
  component: ScrollArea,
};

export const Default = () => (
  <ScrollArea style={{ width: 200, height: 100 }}>
    <div style={{ height: 300 }}>
      This is a scrollable area.
      <br />
      Line 2<br />
      Line 3<br />
      Line 4<br />
      Line 5<br />
      Line 6<br />
      Line 7<br />
      Line 8<br />
      Line 9<br />
      Line 10
      <br />
    </div>
  </ScrollArea>
);
