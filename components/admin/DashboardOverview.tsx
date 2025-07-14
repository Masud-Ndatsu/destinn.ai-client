
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  FileText,
  Download,
  Eye,
  MousePointer,
  Clock
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const visitData = [
  { name: "Mon", visits: 1200 },
  { name: "Tue", visits: 1900 },
  { name: "Wed", visits: 3000 },
  { name: "Thu", visits: 2800 },
  { name: "Fri", visits: 3900 },
  { name: "Sat", visits: 4800 },
  { name: "Sun", visits: 3800 },
];

const opportunityPerformance = [
  { title: "Software Engineering Internship", views: 2400, ctr: "12.5%", time: "3:45" },
  { title: "Marketing Associate Role", views: 1800, ctr: "8.2%", time: "2:30" },
  { title: "Data Science Position", views: 3200, ctr: "15.1%", time: "4:20" },
  { title: "UX Designer Opening", views: 1500, ctr: "6.8%", time: "2:15" },
];

const pendingDrafts = [
  { title: "Remote Frontend Developer", source: "TechCorp", status: "pending" },
  { title: "Product Manager - SaaS", source: "StartupHub", status: "pending" },
  { title: "Digital Marketing Specialist", source: "AgencyPro", status: "pending" },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,589</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+8 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.7%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Visits Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Site Visits (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Regions Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Top Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600">Interactive map coming soon</p>
                <p className="text-sm text-gray-400">United States: 45% | Canada: 22% | UK: 18%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunity Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead><Eye className="w-4 h-4 inline mr-1" />Views</TableHead>
                  <TableHead><MousePointer className="w-4 h-4 inline mr-1" />CTR</TableHead>
                  <TableHead><Clock className="w-4 h-4 inline mr-1" />Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunityPerformance.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.views.toLocaleString()}</TableCell>
                    <TableCell>{item.ctr}</TableCell>
                    <TableCell>{item.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Draft Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Draft Approval Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDrafts.map((draft, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{draft.title}</p>
                    <p className="text-sm text-gray-500">Source: {draft.source}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
              <Button variant="link" className="w-full">
                View All Pending Drafts →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
