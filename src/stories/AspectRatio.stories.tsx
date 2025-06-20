import React from "react";
import { AspectRatio } from "../components/ui/aspect-ratio";

export default {
  title: "UI/AspectRatio",
  component: AspectRatio,
};

export const Default = () => (
  <AspectRatio ratio={16 / 9} style={{ background: "#eee", width: 320 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      16:9 Aspect Ratio
    </div>
  </AspectRatio>
);
