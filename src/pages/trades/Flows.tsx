import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Settings
} from 'lucide-react';

const Flows = () => {
  const workflowSteps = [
    { id: 1, name: 'Order Creation', status: 'completed', time: '09:30' },
    { id: 2, name: 'Risk Review', status: 'completed', time: '10:15' },
    { id: 3, name: 'Pricing Review', status: 'completed', time: '10:45' },
    { id: 4, name: 'Operations Review', status: 'in_progress', time: '11:30' },
    { id: 5, name: 'Final Approval', status: 'pending', time: '-' },
    { id: 6, name: 'Execution', status: 'pending', time: '-' },
    { id: 7, name: 'Settlement', status: 'pending', time: '-' }
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50';
      case 'in_progress': return 'border-yellow-500 bg-yellow-50';
      case 'pending': return 'border-gray-300 bg-gray-50';
      default: return 'border-red-500 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade Flows</h1>
          <p className="text-gray-600 mt-1">Monitor trade workflow and processing stages</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure Workflows
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Flow Reports
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">In various stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">End-to-end flows</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Order to execution</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Flows</TabsTrigger>
          <TabsTrigger value="templates">Flow Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Current Flow: ORD-001
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStepIcon(step.status)}
                    </div>
                    <div className={`flex-1 p-3 rounded border-2 ${getStepColor(step.status)}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{step.name}</span>
                        <span className="text-sm text-gray-600">{step.time}</span>
                      </div>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Flow Details */}
            <Card>
              <CardHeader>
                <CardTitle>Flow Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current Stage: Operations Review</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Assigned to Operations Team</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Reviewing settlement instructions and documentation requirements.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Started: 11:30 AM • SLA: 2 hours
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Operations approval (est. 30 mins)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Final approval from Head of Trading</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Trade execution</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Flow Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Elapsed Time</p>
                      <p className="font-semibold">2h 15m</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Est. Completion</p>
                      <p className="font-semibold">3h 30m</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Active Flows */}
          <Card>
            <CardHeader>
              <CardTitle>Other Active Flows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">ORD-002 - S&P 500 Auto-Callable</p>
                      <p className="text-sm text-gray-600">At Pricing Review stage</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pricing</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">ORD-003 - Gold Linked Note</p>
                      <p className="text-sm text-gray-600">Ready for execution</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium">ORD-004 - EUR/GBP Barrier</p>
                      <p className="text-sm text-gray-600">Risk review exception</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Exception</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Flow templates configuration will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                  <p className="text-gray-500">Processing Time Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bottleneck Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Risk Review</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45 mins avg</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Operations Review</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">35 mins avg</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pricing Review</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">15 mins avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Workflow configuration settings will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flows;
