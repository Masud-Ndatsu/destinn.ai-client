"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateOpportunityModal } from "./CreateOpportunityModal";
import {
  useAdminOpportunities,
  useApproveOpportunity,
  useRejectOpportunity,
  useBulkOpportunityAction,
  useCategories,
} from "@/lib/queries/useAdminOpportunities";

export function ManageOpportunities() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Prepare filters for API call
  const apiParams = {
    page: currentPage,
    perPage,
    search: searchTerm || undefined,
    status: statusFilter !== "all-status" ? statusFilter : undefined,
  };

  const {
    data: opportunitiesData,
    isLoading: opportunitiesLoading,
    error: opportunitiesError,
  } = useAdminOpportunities(apiParams);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const approveOpportunity = useApproveOpportunity();
  const rejectOpportunity = useRejectOpportunity();
  const bulkAction = useBulkOpportunityAction();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleApprove = async (id: string) => {
    await approveOpportunity.mutateAsync(id);
  };

  const handleReject = async (id: string) => {
    await rejectOpportunity.mutateAsync(id);
  };

  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedItems.length === 0) return;
    await bulkAction.mutateAsync({ ids: selectedItems, action });
    setSelectedItems([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && (opportunitiesData as any)?.opportunities) {
      setSelectedItems(
        (opportunitiesData as any).opportunities.map((o: any) => o.id)
      );
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (opportunitiesError) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load opportunities data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Opportunities
        </h1>
        <CreateOpportunityModal />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search opportunities..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedItems.length} item(s) selected
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("approve")}
                  disabled={bulkAction.isPending}
                >
                  {bulkAction.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : null}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("reject")}
                  disabled={bulkAction.isPending}
                >
                  {bulkAction.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : null}
                  Reject
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  disabled={bulkAction.isPending}
                >
                  {bulkAction.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : null}
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      (opportunitiesData as any)?.opportunities &&
                      selectedItems.length ===
                        (opportunitiesData as any).opportunities.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunitiesLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Loading opportunities...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (opportunitiesData as any)?.opportunities?.length ? (
                (opportunitiesData as any).opportunities.map(
                  (opportunity: any) => (
                    <TableRow key={opportunity.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(opportunity.id)}
                          onCheckedChange={(checked) =>
                            handleSelectItem(opportunity.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {opportunity.title}
                      </TableCell>
                      <TableCell>
                        {opportunity.category?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(opportunity.is_approved)}
                        >
                          {opportunity.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(opportunity.created_at)}
                      </TableCell>
                      <TableCell>
                        {opportunity.created_by?.first_name ||
                          opportunity.created_by?.email ||
                          "AI Generated"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {!opportunity.is_approved ? (
                              <DropdownMenuItem
                                onClick={() => handleApprove(opportunity.id)}
                                disabled={approveOpportunity.isPending}
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleReject(opportunity.id)}
                                disabled={rejectOpportunity.isPending}
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No opportunities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {opportunitiesData &&
        opportunitiesData.pagination &&
        opportunitiesData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(
                currentPage * perPage,
                opportunitiesData.pagination.total
              )}{" "}
              of {opportunitiesData.pagination.total} opportunities
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {opportunitiesData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(opportunitiesData.pagination.totalPages, prev + 1)
                  )
                }
                disabled={
                  currentPage === opportunitiesData.pagination.totalPages
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
