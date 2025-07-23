"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
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
  Bot,
  Globe,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Activity,
  CheckCircle,
  Clock,
  Loader2,
  ExternalLink,
  AlertCircle,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { http } from "@/lib/http";
import { CrawlerJobControl } from "./CrawlerJobControl";

interface CrawlTarget {
  id: string;
  url: string;
  platform?: string;
  label?: string;
  is_active: boolean;
  frequency?: string;
  last_scraped_at?: string;
  created_at: string;
  updated_at: string;
}

interface CrawlTargetFormData {
  url: string;
  label: string;
  platform: string;
}

interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

interface CrawlTargetsResponse {
  data: CrawlTarget[];
  meta: PaginationMeta;
}

const PLATFORM_OPTIONS = [
  { value: "web", label: "General Web" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "indeed", label: "Indeed" },
  { value: "glassdoor", label: "Glassdoor" },
  { value: "jobscom", label: "Jobs.com" },
  { value: "monster", label: "Monster" },
  { value: "ziprecruiter", label: "ZipRecruiter" },
  { value: "careerbuilder", label: "CareerBuilder" },
  { value: "dice", label: "Dice" },
  { value: "stackoverflow", label: "Stack Overflow Jobs" },
  { value: "github", label: "GitHub Jobs" },
  { value: "angellist", label: "AngelList" },
  { value: "other", label: "Other" },
];

export function AICrawlingManager() {
  const { toast } = useToast();

  const [targets, setTargets] = useState<CrawlTarget[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    perPage: 10,
  });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTarget, setEditingTarget] = useState<CrawlTarget | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("sources");

  // Load targets
  const loadTargets = useCallback(
    async (page = 1, perPage = 10) => {
      try {
        setLoading(true);
        const response = await http.get(
          `/crawl-target?page=${page}&perPage=${perPage}`
        );

        if (response.data.success) {
          setTargets(response.data.data.data);
          setPagination(response.data.data.meta);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load crawling targets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Create target
  const createTarget = useCallback(
    async (data: CrawlTargetFormData) => {
      try {
        const response = await http.post("/crawl-target", {
          url: data.url.trim(),
          label: data.label.trim() || undefined,
          platform: data.platform || "web",
        });

        if (response.data.success) {
          toast({
            title: "Success",
            description: "Crawling target created successfully",
          });
          loadTargets(currentPage);
          return true;
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message || "Failed to create crawling target";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
      return false;
    },
    [toast, loadTargets, currentPage]
  );

  // Toggle target active status
  const toggleTarget = useCallback(
    async (id: string) => {
      try {
        const response = await http.post(`/crawl-target/${id}/toggle`);

        if (response.data.success) {
          toast({
            title: "Success",
            description: response.data.message,
          });
          loadTargets(currentPage);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to toggle target status",
          variant: "destructive",
        });
      }
    },
    [toast, loadTargets, currentPage]
  );

  // Delete target
  const deleteTarget = useCallback(
    async (id: string) => {
      try {
        const response = await http.delete(`/crawl-target/${id}`);

        if (response.data.success) {
          toast({
            title: "Success",
            description: "Crawling target deleted successfully",
          });
          loadTargets(currentPage);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to delete crawling target",
          variant: "destructive",
        });
      }
    },
    [toast, loadTargets, currentPage]
  );

  // Load targets on mount and page change
  useEffect(() => {
    loadTargets(currentPage);
  }, [loadTargets, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && targets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading crawling targets...</span>
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
            AI Crawling Manager
          </h1>
          <p className="text-gray-600">
            Manage websites and sources for automated opportunity discovery
          </p>
        </div>
        {activeTab === "sources" && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => loadTargets(currentPage)}
              className="flex items-center space-x-2"
              disabled={loading}
            >
              <RotateCcw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Source</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Crawling Source</DialogTitle>
                  <DialogDescription>
                    Configure a new website or platform for automated
                    opportunity crawling
                  </DialogDescription>
                </DialogHeader>
                <CreateSourceForm
                  onClose={() => setIsCreating(false)}
                  onSubmit={createTarget}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sources" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Crawling Sources</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Job Control</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Sources
                    </p>
                    <p className="text-2xl font-bold">{pagination.total}</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Sources
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {targets.filter((t) => t.is_active).length}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Inactive Sources
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {targets.filter((t) => !t.is_active).length}
                    </p>
                  </div>
                  <Pause className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold text-orange-600">95%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Targets Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Crawling Targets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {targets.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No crawling targets
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get started by adding your first crawling source
                  </p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Source
                  </Button>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Crawled</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {targets.map((target) => (
                        <TableRow key={target.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">
                                  {target.label || "Unnamed Source"}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    window.open(target.url, "_blank")
                                  }
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 truncate max-w-md">
                                {target.url}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {target.platform || "web"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  target.is_active ? "default" : "secondary"
                                }
                                className="flex items-center space-x-1"
                              >
                                {target.is_active ? (
                                  <Activity className="w-3 h-3" />
                                ) : (
                                  <Pause className="w-3 h-3" />
                                )}
                                <span>
                                  {target.is_active ? "Active" : "Inactive"}
                                </span>
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {target.last_scraped_at
                                  ? new Date(
                                      target.last_scraped_at
                                    ).toLocaleDateString()
                                  : "Never"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {new Date(target.created_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant={
                                  target.is_active ? "outline" : "default"
                                }
                                onClick={() => toggleTarget(target.id)}
                                className="flex items-center space-x-1"
                              >
                                {target.is_active ? (
                                  <>
                                    <Pause className="w-3 h-3" />
                                    <span>Pause</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3" />
                                    <span>Start</span>
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTarget(target)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Crawling Target
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {target.label || target.url}"? This action
                                      cannot be undone and will stop all
                                      crawling for this source.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteTarget(target.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t">
                      <div className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * pagination.perPage + 1} to{" "}
                        {Math.min(
                          currentPage * pagination.perPage,
                          pagination.total
                        )}{" "}
                        of {pagination.total} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1
                          )
                            .filter(
                              (page) =>
                                page === 1 ||
                                page === pagination.totalPages ||
                                Math.abs(page - currentPage) <= 1
                            )
                            .map((page, index, array) => (
                              <div key={page} className="flex items-center">
                                {index > 0 && array[index - 1] !== page - 1 && (
                                  <span className="px-2 text-gray-400">
                                    ...
                                  </span>
                                )}
                                <Button
                                  variant={
                                    page === currentPage ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                  className="w-8 h-8 p-0"
                                >
                                  {page}
                                </Button>
                              </div>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          {editingTarget && (
            <Dialog
              open={!!editingTarget}
              onOpenChange={() => setEditingTarget(null)}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Crawling Source</DialogTitle>
                  <DialogDescription>
                    Update the configuration for this crawling source
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Target URL</Label>
                      <Input value={editingTarget.url} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Source Label</Label>
                      <Input value={editingTarget.label || ""} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform Type</Label>
                      <Input value={editingTarget.platform || "web"} disabled />
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Note: Edit functionality requires additional API endpoints
                      to be implemented on the backend. Currently, you can only
                      toggle the active status or delete sources.
                    </AlertDescription>
                  </Alert>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditingTarget(null)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="jobs">
          <CrawlerJobControl />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Create Source Form Component
function CreateSourceForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: CrawlTargetFormData) => Promise<boolean>;
}) {
  const [formData, setFormData] = useState<CrawlTargetFormData>({
    url: "",
    label: "",
    platform: "web",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CrawlTargetFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<CrawlTargetFormData> = {};

    if (!formData.url.trim()) {
      newErrors.url = "URL is required";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      onClose();
      setFormData({ url: "", label: "", platform: "web" });
      setErrors({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Target URL *</Label>
          <Input
            id="url"
            placeholder="https://example.com/jobs"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            className={errors.url ? "border-red-500" : ""}
          />
          {errors.url && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.url}</span>
            </p>
          )}
          <p className="text-xs text-gray-500">
            The full URL of the webpage to crawl for opportunities
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="label">Source Label</Label>
          <Input
            id="label"
            placeholder="e.g., LinkedIn Tech Jobs, Indeed Remote Positions"
            value={formData.label}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, label: e.target.value }))
            }
          />
          <p className="text-xs text-gray-500">
            A friendly name to identify this source (optional)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform Type</Label>
          <Select
            value={formData.platform}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, platform: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            The type of platform for better categorization and parsing
          </p>
        </div>
      </div>

      <Alert>
        <Bot className="h-4 w-4" />
        <AlertDescription>
          The AI crawler will automatically discover and extract job
          opportunities from this URL. Make sure the URL contains job listings
          and is publicly accessible.
        </AlertDescription>
      </Alert>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Source...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Source
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
