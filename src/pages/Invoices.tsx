import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Receipt } from "lucide-react";

// Invoices page placeholder - matches Document Vault style
const Invoices = () => (
  <div className="p-4 max-w-5xl mx-auto">
    {/* Page header and breadcrumb */}
    <div className="mb-4 flex items-center gap-4">
      <Receipt className="w-7 h-7 text-primary" />
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Invoices</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    {/* Placeholder card for invoice list/table */}
    <Card>
      <CardHeader>
        <CardTitle>Invoice Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for future invoice table/filter/search */}
        <div className="text-gray-500">
          Invoice management features coming soon.
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Invoices;
