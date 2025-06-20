import React from "react";
import { Carousel } from "../components/ui/carousel";

export default {
  title: "UI/Carousel",
  component: Carousel,
};

export const Default = () => (
  <Carousel>
    <div>Slide 1</div>
    <div>Slide 2</div>
    <div>Slide 3</div>
  </Carousel>
);
