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
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useAdminDashboard } from "@/lib/queries/useAdminDashboard";
import { usePendingOpportunities } from "@/lib/queries/useAdminOpportunities";
import {
  useApproveOpportunity,
  useRejectOpportunity,
} from "@/lib/queries/useAdminOpportunities";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  {
    title: "Software Engineering Internship",
    views: 2400,
    ctr: "12.5%",
    time: "3:45",
  },
  { title: "Marketing Associate Role", views: 1800, ctr: "8.2%", time: "2:30" },
  { title: "Data Science Position", views: 3200, ctr: "15.1%", time: "4:20" },
  { title: "UX Designer Opening", views: 1500, ctr: "6.8%", time: "2:15" },
];

const pendingDrafts = [
  { title: "Remote Frontend Developer", source: "TechCorp", status: "pending" },
  { title: "Product Manager - SaaS", source: "StartupHub", status: "pending" },
  {
    title: "Digital Marketing Specialist",
    source: "AgencyPro",
    status: "pending",
  },
];

export function DashboardOverview() {
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useAdminDashboard();
  const {
    data: pendingData,
    isLoading: pendingLoading,
    error: pendingError,
  } = usePendingOpportunities({ perPage: 3 });
  const approveOpportunity = useApproveOpportunity();
  const rejectOpportunity = useRejectOpportunity();

  const handleApprove = async (id: string) => {
    await approveOpportunity.mutateAsync(id);
  };

  const handleReject = async (id: string) => {
    await rejectOpportunity.mutateAsync(id);
  };

  if (dashboardError || pendingError) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {dashboardData?.totalUsers?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData?.recentUsers || 0} new this week
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {dashboardData?.totalOpportunities || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.approvedOpportunities || 0} approved
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {dashboardData?.metrics?.opportunityApprovalRate?.toFixed(
                    1
                  ) || 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  Opportunity approval rate
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {dashboardData?.pendingOpportunities || 0}
                </div>
                <p className="text-xs text-muted-foreground">Requires review</p>
              </>
            )}
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
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
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
                <p className="text-sm text-gray-400">
                  United States: 45% | Canada: 22% | UK: 18%
                </p>
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
                  <TableHead>
                    <Eye className="w-4 h-4 inline mr-1" />
                    Views
                  </TableHead>
                  <TableHead>
                    <MousePointer className="w-4 h-4 inline mr-1" />
                    CTR
                  </TableHead>
                  <TableHead>
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time
                  </TableHead>
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
              {pendingLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading pending drafts...</span>
                </div>
              ) : pendingData?.data?.length ? (
                <>
                  {pendingData.data.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{opportunity.title}</p>
                        <p className="text-sm text-gray-500">
                          Source:{" "}
                          {opportunity.created_by?.first_name ||
                            opportunity.created_by?.email ||
                            "AI Generated"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {opportunity.location} •{" "}
                          {new Date(
                            opportunity.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(opportunity.id)}
                          disabled={approveOpportunity.isPending}
                        >
                          {approveOpportunity.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(opportunity.id)}
                          disabled={rejectOpportunity.isPending}
                        >
                          {rejectOpportunity.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="w-full">
                    View All Pending Drafts →
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <FileText className="w-8 h-8 mr-2" />
                  <span>No pending drafts</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
