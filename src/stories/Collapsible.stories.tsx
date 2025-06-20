import React, { useState } from "react";
import { Collapsible } from "../components/ui/collapsible";

export default {
  title: "UI/Collapsible",
  component: Collapsible,
};

export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>
        {open ? "Hide" : "Show"} Content
      </button>
      <Collapsible open={open}>
        <div style={{ marginTop: 8, background: "#eee", padding: 8 }}>
          This is collapsible content.
        </div>
      </Collapsible>
    </div>
  );
};
