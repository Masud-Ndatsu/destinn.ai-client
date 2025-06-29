"use client";

import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Opportunity } from "@/types/opportunity";
import { DataTable } from "./data-table";

interface OpportunityTableProps {
  data: Opportunity[];
}

const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      const date = new Date(row.getValue("deadline")).toLocaleDateString();
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "published" ? "default" : "outline"}>
          {status}
        </Badge>
      );
    },
  },
];

export function OpportunityTable({ data }: OpportunityTableProps) {
  return (
    <Card className="p-4 w-full overflow-auto rounded-none">
      <ScrollArea className="w-full">
        <DataTable columns={columns} data={data} />
      </ScrollArea>
    </Card>
  );
}
