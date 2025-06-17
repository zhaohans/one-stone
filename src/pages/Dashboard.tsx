
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Eye
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();

  // KPI Data with navigation handlers
  const kpiData = [
    { 
      title: 'Total AUM', 
      value: '$847.2M', 
      change: '+5.2%', 
      icon: TrendingUp, 
      color: 'bg-green-500',
      status: 'positive',
      path: '/accounts',
      filter: 'aum'
    },
    { 
      title: '# Clients', 
      value: '1,247', 
      change: '+12', 
      icon: Users, 
      color: 'bg-blue-500',
      status: 'positive',
      path: '/clients'
    },
    { 
      title: '# Accounts', 
      value: '2,891', 
      change: '+24', 
      icon: Building2, 
      color: 'bg-purple-500',
      status: 'positive',
      path: '/accounts'
    },
    { 
      title: 'YTD Retrocession', 
      value: '$12.4M', 
      change: '+8.7%', 
      icon: DollarSign, 
      color: 'bg-emerald-500',
      status: 'positive',
      path: '/fees',
      filter: 'ytd'
    },
    { 
      title: 'Open Tasks', 
      value: '23', 
      change: '-5', 
      icon: FileText, 
      color: 'bg-orange-500',
      status: 'attention',
      path: '/compliance',
      filter: 'pending'
    },
  ];

  // Asset Allocation Data - now clickable
  const assetAllocationData = [
    { name: 'Fixed Income', value: 45.2, color: '#3B82F6', count: 1234 },
    { name: 'Equities', value: 28.7, color: '#10B981', count: 892 },
    { name: 'Alternatives', value: 15.3, color: '#F59E0B', count: 456 },
    { name: 'Cash', value: 10.8, color: '#8B5CF6', count: 234 },
  ];

  // AUM Trend Data - enhanced
  const aumTrendData = [
    { month: 'Jan', aum: 742, retrocession: 8.2, clients: 1180 },
    { month: 'Feb', aum: 758, retrocession: 8.7, clients: 1195 },
    { month: 'Mar', aum: 771, retrocession: 9.1, clients: 1210 },
    { month: 'Apr', aum: 786, retrocession: 9.8, clients: 1225 },
    { month: 'May', aum: 812, retrocession: 10.5, clients: 1235 },
    { month: 'Jun', aum: 834, retrocession: 11.2, clients: 1240 },
    { month: 'Jul', aum: 847, retrocession: 12.4, clients: 1247 },
  ];

  // Fee/Retrocession Trend Data
  const feeRetroData = [
    { period: 'Q1', fees: 15.2, retrocession: 8.2, netFees: 7.0 },
    { period: 'Q2', fees: 18.5, retrocession: 9.8, netFees: 8.7 },
    { period: 'Q3', fees: 22.1, retrocession: 12.4, netFees: 9.7 },
    { period: 'Q4', fees: 19.8, retrocession: 11.2, netFees: 8.6 },
  ];

  // Recent Activities - now fully interactive
  const recentActivities = [
    {
      id: 1,
      type: 'onboarding',
      title: 'New Client Onboarding',
      description: 'John Matthews - KYC documents submitted',
      time: '2 hours ago',
      status: 'pending',
      priority: 'high',
      clientId: 'C-1248',
      link: '/clients/C-1248'
    },
    {
      id: 2,
      type: 'compliance',
      title: 'Compliance Review Due',
      description: 'Client ID: C-1247 - Annual review required',
      time: '4 hours ago',
      status: 'pending',
      priority: 'medium',
      clientId: 'C-1247',
      link: '/compliance/review/C-1247'
    },
    {
      id: 3,
      type: 'trade',
      title: 'Large Trade Executed',
      description: '$2.5M equity purchase for Portfolio A',
      time: '6 hours ago',
      status: 'completed',
      priority: 'low',
      tradeId: 'T-9876',
      link: '/trades/T-9876'
    },
    {
      id: 4,
      type: 'task',
      title: 'Fee Calculation Complete',
      description: 'Q3 retrocession fees calculated and ready for review',
      time: '1 day ago',
      status: 'completed',
      priority: 'low',
      reportId: 'R-456',
      link: '/fees/R-456'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Risk Threshold Alert',
      description: 'Portfolio B-445 exceeded 85% equity allocation',
      time: '1 day ago',
      status: 'pending',
      priority: 'high',
      accountId: 'A-445',
      link: '/accounts/A-445'
    }
  ];

  // Chart configurations
  const pieChartConfig = {
    "Fixed Income": { label: "Fixed Income", color: "#3B82F6" },
    "Equities": { label: "Equities", color: "#10B981" },
    "Alternatives": { label: "Alternatives", color: "#F59E0B" },
    "Cash": { label: "Cash", color: "#8B5CF6" },
  };

  const lineChartConfig = {
    aum: { label: "AUM ($M)", color: "#3B82F6" },
    retrocession: { label: "Retrocession ($M)", color: "#10B981" },
  };

  const barChartConfig = {
    fees: { label: "Gross Fees ($M)", color: "#3B82F6" },
    retrocession: { label: "Retrocession ($M)", color: "#F59E0B" },
    netFees: { label: "Net Fees ($M)", color: "#10B981" },
  };

  // Navigation handlers
  const handleKPIClick = (item: typeof kpiData[0]) => {
    const params = new URLSearchParams();
    if (item.filter) {
      params.set('filter', item.filter);
    }
    const url = item.filter ? `${item.path}?${params.toString()}` : item.path;
    navigate(url);
    toast.success(`Navigating to ${item.title}`);
  };

  const handleAssetClick = (data: any) => {
    navigate(`/accounts?assetClass=${encodeURIComponent(data.name)}`);
    toast.info(`Filtering accounts by ${data.name}`);
  };

  const handleActivityClick = (activity: typeof recentActivities[0]) => {
    if (activity.link) {
      navigate(activity.link);
    }
  };

  const handleActivityAction = (activity: typeof recentActivities[0], action: string) => {
    switch (action) {
      case 'complete':
        toast.success(`${activity.title} marked as complete`);
        break;
      case 'approve':
        toast.success(`${activity.title} approved`);
        break;
      case 'review':
        navigate(activity.link || '/compliance');
        break;
      default:
        toast.info(`Action ${action} for ${activity.title}`);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'onboarding': return Users;
      case 'compliance': return FileText;
      case 'trade': return TrendingUp;
      case 'task': return CheckCircle;
      case 'alert': return AlertTriangle;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string, priority: string) => {
    if (status === 'pending') {
      switch (priority) {
        case 'high': return 'border-l-red-500 bg-red-50';
        case 'medium': return 'border-l-yellow-500 bg-yellow-50';
        default: return 'border-l-blue-500 bg-blue-50';
      }
    }
    return 'border-l-green-500 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, here's your portfolio overview</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" onClick={() => navigate('/clients?action=new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      {/* Clickable KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiData.map((kpi, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105"
            onClick={() => handleKPIClick(kpi)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-medium ${
                      kpi.status === 'positive' ? 'text-green-600' : 
                      kpi.status === 'attention' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <ArrowUpRight className={`w-3 h-3 ${
                      kpi.status === 'positive' ? 'text-green-600' : 
                      kpi.status === 'attention' ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
                <div className={`${kpi.color} p-3 rounded-full group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Pie Chart - Clickable */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Asset Allocation</span>
            </CardTitle>
            <CardDescription>Current portfolio distribution across asset classes (click segments to filter)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-48 h-48">
                <ChartContainer config={pieChartConfig}>
                  <RechartsPieChart>
                    <Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      onClick={handleAssetClick}
                      className="cursor-pointer"
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-gray-600">{data.value}% (${(data.count * 1000).toLocaleString()}M)</p>
                              <p className="text-xs text-blue-600 mt-1">Click to filter accounts</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ChartContainer>
              </div>
              <div className="space-y-3 flex-1">
                {assetAllocationData.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    onClick={() => handleAssetClick(item)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{item.value}%</span>
                      <p className="text-xs text-gray-500">${item.count}M</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AUM Trend Line Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>AUM & Retrocession Trend</span>
            </CardTitle>
            <CardDescription>7-month performance overview (hover for details)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer config={lineChartConfig}>
                <LineChart data={aumTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded shadow-lg">
                            <p className="font-medium">{label}</p>
                            <div className="space-y-1">
                              <p className="text-sm">AUM: ${payload[0]?.value}M</p>
                              <p className="text-sm">Retrocession: ${payload[1]?.value}M</p>
                              <p className="text-sm">Clients: {payload[0]?.payload?.clients}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aum" 
                    stroke="var(--color-aum)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-aum)', strokeWidth: 2, r: 4 }}
                    className="hover:stroke-width-4"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="retrocession" 
                    stroke="var(--color-retrocession)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-retrocession)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee/Retrocession Trend Bar Chart */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Fee & Retrocession Trend</span>
          </CardTitle>
          <CardDescription>Quarterly fee analysis with interactive legend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer config={barChartConfig}>
              <BarChart data={feeRetroData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg">
                          <p className="font-medium">{label}</p>
                          <div className="space-y-1">
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: ${entry.value}M
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="fees" fill="var(--color-fees)" />
                <Bar dataKey="retrocession" fill="var(--color-retrocession)" />
                <Bar dataKey="netFees" fill="var(--color-netFees)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity & Pending Tasks</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/compliance')}>
              View All Tasks
            </Button>
          </CardTitle>
          <CardDescription>Recent actions, onboarding tasks, and compliance alerts (all clickable)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div 
                  key={activity.id} 
                  className={`p-4 rounded-lg border-l-4 ${getStatusColor(activity.status, activity.priority)} hover:shadow-md transition-all cursor-pointer`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-white rounded-full">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivityAction(activity, 'review');
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivityAction(activity, activity.type === 'compliance' ? 'approve' : 'complete');
                            }}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {activity.type === 'compliance' ? 'Approve' : 'Complete'}
                          </Button>
                        </>
                      )}
                      {activity.status === 'completed' && (
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
