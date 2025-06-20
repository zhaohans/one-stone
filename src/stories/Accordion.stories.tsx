import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

export default {
  title: "UI/Accordion",
  component: Accordion,
};

export const Default = () => (
  <Accordion type="single" defaultValue="item-1">
    <AccordionItem value="item-1">
      <AccordionTrigger>Item 1</AccordionTrigger>
      <AccordionContent>Content for item 1</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Item 2</AccordionTrigger>
      <AccordionContent>Content for item 2</AccordionContent>
    </AccordionItem>
  </Accordion>
);
