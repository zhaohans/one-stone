import React from "react";
import { Progress } from "../components/ui/progress";

export default {
  title: "UI/Progress",
  component: Progress,
};

export const Zero = () => <Progress value={0} />;
export const Half = () => <Progress value={50} />;
export const Full = () => <Progress value={100} />;
