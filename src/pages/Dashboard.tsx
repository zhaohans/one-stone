import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Building2,
  PieChart,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Activity,
  Settings,
  Eye,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  // KPI Data
  const kpiData = [
    {
      title: "Total AUM",
      value: "$847.2M",
      change: "+5.2%",
      icon: TrendingUp,
      color: "bg-green-500",
      status: "positive",
    },
    {
      title: "Clients",
      value: "1,247",
      change: "+12",
      icon: Users,
      color: "bg-blue-500",
      status: "positive",
    },
    {
      title: "Accounts",
      value: "2,891",
      change: "+24",
      icon: Building2,
      color: "bg-purple-500",
      status: "positive",
    },
    {
      title: "YTD Retrocession",
      value: "$12.4M",
      change: "+8.7%",
      icon: DollarSign,
      color: "bg-emerald-500",
      status: "positive",
    },
    {
      title: "Open Tasks",
      value: "23",
      change: "-5",
      icon: FileText,
      color: "bg-orange-500",
      status: "attention",
    },
  ];

  // Asset Allocation Data
  const assetAllocationData = [
    { name: "Fixed Income", value: 45.2, color: "#3B82F6" },
    { name: "Equities", value: 28.7, color: "#10B981" },
    { name: "Alternatives", value: 15.3, color: "#F59E0B" },
    { name: "Cash", value: 10.8, color: "#8B5CF6" },
  ];

  // AUM Trend Data
  const aumTrendData = [
    { month: "Jan", aum: 742, retrocession: 8.2 },
    { month: "Feb", aum: 758, retrocession: 8.7 },
    { month: "Mar", aum: 771, retrocession: 9.1 },
    { month: "Apr", aum: 786, retrocession: 9.8 },
    { month: "May", aum: 812, retrocession: 10.5 },
    { month: "Jun", aum: 834, retrocession: 11.2 },
    { month: "Jul", aum: 847, retrocession: 12.4 },
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: "onboarding",
      title: "New Client Onboarding",
      description: "John Matthews - KYC documents submitted",
      time: "2 hours ago",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      type: "compliance",
      title: "Compliance Review Due",
      description: "Client ID: C-1247 - Annual review required",
      time: "4 hours ago",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      type: "trade",
      title: "Large Trade Executed",
      description: "$2.5M equity purchase for Portfolio A",
      time: "6 hours ago",
      status: "completed",
      priority: "low",
    },
    {
      id: 4,
      type: "task",
      title: "Fee Calculation Complete",
      description: "Q3 retrocession fees calculated and ready for review",
      time: "1 day ago",
      status: "completed",
      priority: "low",
    },
    {
      id: 5,
      type: "alert",
      title: "Risk Threshold Alert",
      description: "Portfolio B-445 exceeded 85% equity allocation",
      time: "1 day ago",
      status: "pending",
      priority: "high",
    },
  ];

  // Chart configurations
  const pieChartConfig = {
    "Fixed Income": { label: "Fixed Income", color: "#3B82F6" },
    Equities: { label: "Equities", color: "#10B981" },
    Alternatives: { label: "Alternatives", color: "#F59E0B" },
    Cash: { label: "Cash", color: "#8B5CF6" },
  };

  const lineChartConfig = {
    aum: { label: "AUM ($M)", color: "#3B82F6" },
    retrocession: { label: "Retrocession ($M)", color: "#10B981" },
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "onboarding":
        return Users;
      case "compliance":
        return FileText;
      case "trade":
        return TrendingUp;
      case "task":
        return CheckCircle;
      case "alert":
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string, priority: string) => {
    if (status === "pending") {
      switch (priority) {
        case "high":
          return "border-l-red-500 bg-red-50";
        case "medium":
          return "border-l-yellow-500 bg-yellow-50";
        default:
          return "border-l-blue-500 bg-blue-50";
      }
    }
    return "border-l-green-500 bg-green-50";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, here's your portfolio overview
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiData.map((kpi, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {kpi.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span
                      className={`text-sm font-medium ${
                        kpi.status === "positive"
                          ? "text-green-600"
                          : kpi.status === "attention"
                            ? "text-orange-600"
                            : "text-red-600"
                      }`}
                    >
                      {kpi.change}
                    </span>
                    <ArrowUpRight
                      className={`w-3 h-3 ${
                        kpi.status === "positive"
                          ? "text-green-600"
                          : kpi.status === "attention"
                            ? "text-orange-600"
                            : "text-red-600"
                      }`}
                    />
                  </div>
                </div>
                <div
                  className={`${kpi.color} p-3 rounded-full group-hover:scale-110 transition-transform`}
                >
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Asset Allocation</span>
            </CardTitle>
            <CardDescription>
              Current portfolio distribution across asset classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
              <div
                className="w-full md:w-64 aspect-square h-auto"
                style={{ minWidth: 0, minHeight: 0 }}
              >
                <ChartContainer
                  config={pieChartConfig}
                  className="w-full h-full"
                >
                  <RechartsPieChart width={undefined} height={undefined}>
                    <Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ChartContainer>
              </div>
              <div className="space-y-3 flex-1 w-full">
                {assetAllocationData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AUM Trend Line Chart */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>AUM & Retrocession Trend</span>
            </CardTitle>
            <CardDescription>7-month performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ChartContainer config={lineChartConfig}>
                <LineChart
                  data={aumTrendData}
                  width={undefined}
                  height={undefined}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="aum"
                    stroke="var(--color-aum)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-aum)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="retrocession"
                    stroke="var(--color-retrocession)"
                    strokeWidth={3}
                    dot={{
                      fill: "var(--color-retrocession)",
                      strokeWidth: 2,
                      r: 4,
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity & Tasks</span>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
          <CardDescription>
            Recent actions, onboarding tasks, and compliance alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border-l-4 ${getStatusColor(activity.status, activity.priority)} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-full">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                        </>
                      )}
                      {activity.status === "completed" && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
