import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

export default {
  title: "UI/Card",
  component: Card,
};

export const Default = () => (
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card description goes here.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>This is the card content.</p>
    </CardContent>
    <CardFooter>
      <button>Action</button>
    </CardFooter>
  </Card>
);
