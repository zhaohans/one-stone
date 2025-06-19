import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Search,
  Filter,
  Tag,
  Eye,
  Download,
  FolderOpen,
} from "lucide-react";
import DocumentUpload from "../components/DocumentUpload";
import DocumentsTable from "../components/DocumentsTable";

const DocumentVault = () => {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Client_Onboarding_Form_JohnDoe.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2024-03-15",
      tags: ["KYC", "Onboarding", "Client"],
      linkedTo: "John Doe - ACC001",
      version: "1.0",
      status: "Active",
    },
    {
      id: 2,
      name: "Risk_Assessment_Report_Q1.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadDate: "2024-03-12",
      tags: ["Risk", "Compliance", "Quarterly"],
      linkedTo: "Portfolio Risk Review",
      version: "2.1",
      status: "Active",
    },
    {
      id: 3,
      name: "Bank_Statement_March_2024.xlsx",
      type: "XLSX",
      size: "5.2 MB",
      uploadDate: "2024-03-10",
      tags: ["Banking", "Statement", "March"],
      linkedTo: "Bank A - Custodian",
      version: "1.0",
      status: "Archived",
    },
  ]);

  const getFileIcon = (type: string) => {
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-gray-600">
            Secure document storage with search, tagging, and version control
          </p>
        </div>
        <DocumentUpload />
      </div>
      <div className="mt-8">
        <DocumentsTable />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
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
                <p className="text-sm font-medium text-gray-600">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900">2.4GB</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FolderOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tags</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Recent Uploads
                </p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>
                Search, filter, and manage all documents
              </CardDescription>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search documents by name, tags, or content..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {doc.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-500">
                            {doc.size} • {doc.uploadDate}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm text-gray-500">
                            v{doc.version}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {doc.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Linked to:
                        </p>
                        <p className="text-xs text-gray-500">{doc.linkedTo}</p>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recently Added</CardTitle>
              <CardDescription>
                Documents uploaded in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Recent documents view coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>KYC Documents</CardTitle>
              <CardDescription>
                Know Your Customer documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">
                  KYC document view coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>
                Regulatory and compliance documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Compliance document view coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Archived Documents</CardTitle>
              <CardDescription>
                Documents that have been archived
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Archived document view coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentVault;
