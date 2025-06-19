import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { GraduationCap } from "lucide-react";

// Training page placeholder - matches Document Vault style
const Training = () => (
  <div className="p-4 max-w-5xl mx-auto">
    {/* Page header and breadcrumb */}
    <div className="mb-4 flex items-center gap-4">
      <GraduationCap className="w-7 h-7 text-primary" />
      <div>
        <h1 className="text-2xl font-bold">Training</h1>
        <Breadcrumb>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Training</BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    {/* Placeholder card for training list/table */}
    <Card>
      <CardHeader>
        <CardTitle>Training Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for future training table/filter/search */}
        <div className="text-gray-500">
          Training assignments and tracking features coming soon.
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Training;
