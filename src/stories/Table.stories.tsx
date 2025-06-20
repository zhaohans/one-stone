import React from "react";
import { Table } from "../components/ui/table";

export default {
  title: "UI/Table",
  component: Table,
};

export const Default = () => (
  <Table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Alice</td>
        <td>30</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>25</td>
      </tr>
    </tbody>
  </Table>
);
