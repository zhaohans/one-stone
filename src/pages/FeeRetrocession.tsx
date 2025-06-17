
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Download, Search, Plus, Filter } from 'lucide-react';

const FeeRetrocession = () => {
  const [statements, setStatements] = useState([
    {
      id: 1,
      fileName: 'Bank_A_Statement_Q1_2024.xlsx',
      uploadDate: '2024-03-15',
      status: 'Processed',
      totalFees: 125000,
      calculatedRetrocession: 87500,
      clientsAffected: 15
    },
    {
      id: 2,
      fileName: 'Custodian_B_Statement_Q1_2024.csv',
      uploadDate: '2024-03-12',
      status: 'Review',
      totalFees: 89000,
      calculatedRetrocession: 62300,
      clientsAffected: 8
    },
    {
      id: 3,
      fileName: 'Bank_C_Statement_Q1_2024.xlsx',
      uploadDate: '2024-03-10',
      status: 'Draft',
      totalFees: 156000,
      calculatedRetrocession: 109200,
      clientsAffected: 22
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee & Retrocession Management</h1>
          <p className="text-gray-600">Upload statements, calculate retrocessions, and manage approvals</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload Statement</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Fees (Q1)</p>
                <p className="text-2xl font-bold text-gray-900">$370K</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retrocession</p>
                <p className="text-2xl font-bold text-gray-900">$259K</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Filter className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients Affected</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="statements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="calculations">Calculations</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="statements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Statements</CardTitle>
              <CardDescription>Manage uploaded fee statements and their processing status</CardDescription>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search statements..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statements.map((statement) => (
                  <div key={statement.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{statement.fileName}</h4>
                        <p className="text-sm text-gray-500">Uploaded: {statement.uploadDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${statement.totalFees.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total Fees</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">${statement.calculatedRetrocession.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Retrocession</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{statement.clientsAffected}</p>
                        <p className="text-xs text-gray-500">Clients</p>
                      </div>
                      <Badge className={getStatusColor(statement.status)}>
                        {statement.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retrocession Calculations</CardTitle>
              <CardDescription>Review and adjust automated calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">Calculation module coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Manage approval process from draft to final invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">Approval workflow coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Export</CardTitle>
              <CardDescription>Generate branded reports and export data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">Reports module coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeeRetrocession;
