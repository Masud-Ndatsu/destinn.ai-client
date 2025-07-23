"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
  Settings,
  Timer,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { http } from "@/lib/http";

interface CrawlerJob {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  status: "running" | "completed" | "failed" | "queued" | "paused";
  startedAt: string;
  completedAt?: string;
  foundOpportunities: number;
  processedOpportunities: number;
  errors: string[];
  duration?: number; // in seconds
  progress?: number; // percentage
}

interface JobControlState {
  isRunning: boolean;
  activeJobs: number;
  queuedJobs: number;
  lastRun?: string;
  nextRun?: string;
  totalJobsToday: number;
  successRate: number;
}

export function CrawlerJobControl() {
  const { toast } = useToast();

  const [jobs, setJobs] = useState<CrawlerJob[]>([]);
  const [controlState, setControlState] = useState<JobControlState>({
    isRunning: false,
    activeJobs: 0,
    queuedJobs: 0,
    totalJobsToday: 0,
    successRate: 95,
  });
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState<any[]>([]);

  // Load job data
  const loadJobData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsRes, sourcesRes, statsRes] = await Promise.all([
        http.get("/admin/crawling/jobs"),
        http.get("/admin/crawling/sources"),
        http.get("/admin/crawling/stats"),
      ]);

      // Use real job data from the API
      let transformedJobs: CrawlerJob[] = [];
      if (jobsRes.data.success) {
        const jobsData = jobsRes.data.data;
        const apiJobs = jobsData.data || jobsData || [];

        // Transform API jobs to match our interface
        transformedJobs = apiJobs.map(
          (job: any): CrawlerJob => ({
            id: job.id,
            sourceId: job.sourceId,
            sourceName: job.sourceName,
            sourceUrl: job.sourceUrl || "Unknown URL",
            status: job.status as
              | "running"
              | "completed"
              | "failed"
              | "queued"
              | "paused",
            startedAt: job.startedAt,
            completedAt: job.completedAt,
            foundOpportunities: job.foundOpportunities || 0,
            processedOpportunities: job.processedOpportunities || 0,
            errors: job.errors || [],
            duration: job.duration,
            progress: job.progress,
          })
        );
        setJobs(transformedJobs);
      }

      console.log("sourcesRes:", sourcesRes.data);

      if (sourcesRes.data.success) {
        // Handle the different response structure from /admin/crawling/sources
        const sourcesData = sourcesRes.data.data;
        if (sourcesData.data) {
          setSources(sourcesData.data);
        } else if (Array.isArray(sourcesData)) {
          setSources(sourcesData);
        } else {
          setSources([]);
        }
      }

      // Use real stats from the API and current job data
      let controlStateData = {
        isRunning: false,
        activeJobs: 0,
        queuedJobs: 0,
        lastRun: undefined as string | undefined,
        nextRun: new Date(Date.now() + 600000).toISOString(), // Next run in 10 minutes (from cron schedule)
        totalJobsToday: 0,
        successRate: 95,
      };

      if (statsRes.data.success) {
        const stats = statsRes.data.data;
        controlStateData = {
          ...controlStateData,
          isRunning: (stats.activeSources || 0) > 0,
          totalJobsToday: stats.totalJobs || 0,
          successRate:
            (stats.totalJobs || 0) > 0 && (stats.successfulJobs || 0) > 0
              ? ((stats.successfulJobs || 0) / (stats.totalJobs || 1)) * 100
              : 95,
        };
      }

      // Calculate job-specific stats from the loaded jobs
      if (transformedJobs.length > 0) {
        const runningJobs = transformedJobs.filter(
          (job) => job.status === "running"
        );
        const queuedJobs = transformedJobs.filter(
          (job) => job.status === "queued"
        );
        const completedJobs = transformedJobs.filter(
          (job) => job.status === "completed"
        );

        controlStateData = {
          ...controlStateData,
          activeJobs: runningJobs.length,
          queuedJobs: queuedJobs.length,
          isRunning: runningJobs.length > 0,
          lastRun:
            completedJobs.length > 0
              ? completedJobs[completedJobs.length - 1].completedAt
              : undefined,
        };
      }

      setControlState(controlStateData);
    } catch (error: any) {
      console.error("Failed to load job data:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load job data",
        variant: "destructive",
      });

      // Set fallback state when API calls fail
      setControlState((prev) => ({
        ...prev,
        isRunning: false,
        activeJobs: 0,
        queuedJobs: 0,
        totalJobsToday: 0,
        successRate: 0,
      }));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Start all crawling jobs
  const startAllJobs = useCallback(async () => {
    try {
      await http.post("/admin/crawling/start-all");
      toast({
        title: "Success",
        description: "All crawling jobs started successfully",
      });
      loadJobData();
    } catch (error: any) {
      console.error("Failed to start all crawling jobs:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to start crawling jobs",
        variant: "destructive",
      });
    }
  }, [toast, loadJobData]);

  // Stop all crawling jobs
  const stopAllJobs = useCallback(async () => {
    try {
      await http.post("/admin/crawling/stop-all");
      toast({
        title: "Success",
        description: "All crawling jobs stopped successfully",
      });
      loadJobData();
    } catch (error: any) {
      console.error("Failed to stop all crawling jobs:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to stop crawling jobs",
        variant: "destructive",
      });
    }
  }, [toast, loadJobData]);

  // Start specific job
  const startJob = useCallback(
    async (sourceId: string) => {
      try {
        await http.post(`/admin/crawling/sources/${sourceId}/start`);
        toast({
          title: "Success",
          description: "Crawling job started",
        });
        loadJobData();
      } catch (error: any) {
        console.error("Failed to start job:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to start job",
          variant: "destructive",
        });
      }
    },
    [toast, loadJobData]
  );

  // Stop specific job
  const stopJob = useCallback(
    async (sourceId: string) => {
      try {
        await http.post(`/admin/crawling/sources/${sourceId}/stop`);
        toast({
          title: "Success",
          description: "Crawling job stopped",
        });
        loadJobData();
      } catch (error: any) {
        console.error("Failed to stop job:", error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to stop job",
          variant: "destructive",
        });
      }
    },
    [toast, loadJobData]
  );

  // Trigger manual crawl
  const triggerManualCrawl = useCallback(
    async (sourceId?: string) => {
      try {
        if (sourceId) {
          // Start specific source
          await http.post(`/admin/crawling/sources/${sourceId}/start`);
          toast({
            title: "Success",
            description: "Manual crawl triggered for source",
          });
        } else {
          // Start all sources
          await http.post("/admin/crawling/start-all");
          toast({
            title: "Success",
            description: "Manual crawl triggered for all sources",
          });
        }

        // Reload data to reflect changes
        loadJobData();
      } catch (error: any) {
        console.error("Failed to trigger manual crawl:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to trigger manual crawl",
          variant: "destructive",
        });
      }
    },
    [toast, loadJobData]
  );

  useEffect(() => {
    loadJobData();
    // Set up polling to refresh job data every 30 seconds
    const interval = setInterval(loadJobData, 30000);
    return () => clearInterval(interval);
  }, [loadJobData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading job control...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Crawler Job Control
          </h1>
          <p className="text-gray-600">
            Monitor and control automated crawling jobs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={loadJobData}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => triggerManualCrawl()}
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Manual Trigger</span>
          </Button>
        </div>
      </div>

      {/* Important Information Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>How the crawling system works:</strong> The system
          automatically crawls active sources every 10 minutes via a cron job.
          Sources are automatically deactivated after each successful crawl. Use
          the controls below to manage source activation and monitor job
          progress.
        </AlertDescription>
      </Alert>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Crawler Status</span>
              <Badge variant={controlState.isRunning ? "default" : "secondary"}>
                {controlState.isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Jobs</span>
              <span className="text-sm font-bold text-green-600">
                {controlState.activeJobs}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Queued Jobs</span>
              <span className="text-sm font-bold text-orange-600">
                {controlState.queuedJobs}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm font-bold text-blue-600">
                {controlState.successRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="w-5 h-5" />
              <span>Schedule Info</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Last Run</span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {controlState.lastRun
                    ? new Date(controlState.lastRun).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Next Scheduled Run</span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {controlState.nextRun
                    ? new Date(controlState.nextRun).toLocaleString()
                    : "Not scheduled"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Current Schedule</span>
              <Badge variant="outline">Every 10 minutes (Cron Job)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {controlState.isRunning ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop All Jobs
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Stop All Crawling Jobs</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will stop all currently running crawling jobs. Jobs
                      in progress will be terminated. Are you sure you want to
                      continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={stopAllJobs}>
                      Stop All Jobs
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={startAllJobs} className="w-full">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start All Jobs
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => triggerManualCrawl()}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Trigger Manual Run
            </Button>

            <Button variant="outline" onClick={loadJobData} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Active & Recent Jobs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Found/Processed</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Activity className="w-8 h-8 text-gray-400" />
                      <p className="text-gray-500">No crawling jobs found</p>
                      <p className="text-sm text-gray-400">
                        Jobs will appear here when crawling sources are active
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{job.sourceName}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {job.sourceUrl}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "running"
                            ? "default"
                            : job.status === "completed"
                            ? "secondary"
                            : job.status === "failed"
                            ? "destructive"
                            : "outline"
                        }
                        className="flex items-center space-x-1 w-fit"
                      >
                        {job.status === "running" && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        {job.status === "completed" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {job.status === "failed" && (
                          <XCircle className="w-3 h-3" />
                        )}
                        {job.status === "queued" && (
                          <Clock className="w-3 h-3" />
                        )}
                        <span className="capitalize">{job.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.status === "running" && job.progress ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {job.progress}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium text-green-600">
                          {job.foundOpportunities}
                        </span>
                        <span className="text-gray-400"> / </span>
                        <span className="font-medium text-blue-600">
                          {job.processedOpportunities}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {job.duration
                          ? `${Math.floor(job.duration / 60)}m ${
                              job.duration % 60
                            }s`
                          : job.status === "running"
                          ? "Running..."
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {job.status === "running" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => stopJob(job.sourceId)}
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startJob(job.sourceId)}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <AlertCircle className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Job Details: {job.sourceName}
                              </DialogTitle>
                              <DialogDescription>
                                Detailed information about this crawling job
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium">Job ID:</p>
                                <p className="text-sm text-gray-600">
                                  {job.id}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Source URL:
                                </p>
                                <p className="text-sm text-gray-600 break-all">
                                  {job.sourceUrl}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Started At:
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(job.startedAt).toLocaleString()}
                                </p>
                              </div>
                              {job.errors.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-red-600">
                                    Errors:
                                  </p>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {job.errors.map((error, index) => (
                                      <li key={index}>{error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
