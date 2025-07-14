
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

const engagementData = [
  { month: "Jan", sessions: 4200, bounceRate: 42, avgDuration: 185 },
  { month: "Feb", sessions: 5100, bounceRate: 38, avgDuration: 205 },
  { month: "Mar", sessions: 6800, bounceRate: 35, avgDuration: 220 },
  { month: "Apr", sessions: 7200, bounceRate: 32, avgDuration: 240 },
  { month: "May", sessions: 8500, bounceRate: 30, avgDuration: 260 },
  { month: "Jun", sessions: 9200, bounceRate: 28, avgDuration: 280 },
];

const categoryData = [
  { name: "Technology", value: 35, color: "#3b82f6" },
  { name: "Healthcare", value: 22, color: "#10b981" },
  { name: "Finance", value: 18, color: "#f59e0b" },
  { name: "Marketing", value: 15, color: "#ef4444" },
  { name: "Design", value: 10, color: "#8b5cf6" },
];

const botUsageData = [
  { day: "Mon", interactions: 340, recommendations: 120 },
  { day: "Tue", interactions: 450, recommendations: 180 },
  { day: "Wed", interactions: 520, recommendations: 210 },
  { day: "Thu", interactions: 480, recommendations: 190 },
  { day: "Fri", interactions: 620, recommendations: 240 },
  { day: "Sat", interactions: 380, recommendations: 150 },
  { day: "Sun", interactions: 290, recommendations: 110 },
];

const topQuestions = [
  { question: "How to find remote jobs?", count: 145 },
  { question: "Software engineering career path", count: 132 },
  { question: "Best companies for internships", count: 98 },
  { question: "Resume tips for new graduates", count: 87 },
  { question: "Salary negotiation advice", count: 76 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">41,200</div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4:38</div>
            <p className="text-xs text-muted-foreground">+18s from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Interactions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,240</div>
            <p className="text-xs text-muted-foreground">+12% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">-4% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Engagement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>User Engagement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CareerBot Usage */}
        <Card>
          <CardHeader>
            <CardTitle>CareerBot Usage (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={botUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interactions" fill="#3b82f6" name="Interactions" />
                <Bar dataKey="recommendations" fill="#10b981" name="Recommendations" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device & Region Stats */}
        <Card>
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Device Breakdown */}
              <div>
                <h4 className="text-sm font-medium mb-3">Device Usage</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Desktop</span>
                    </div>
                    <span className="text-sm font-medium">58%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Mobile</span>
                    </div>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                </div>
              </div>

              {/* Top Regions */}
              <div>
                <h4 className="text-sm font-medium mb-3">Top Regions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">United States</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Canada</span>
                    </div>
                    <span className="text-sm font-medium">22%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">United Kingdom</span>
                    </div>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Asked Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Most Asked Questions (CareerBot)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{item.question}</span>
                <span className="text-sm text-gray-500">{item.count} times</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
