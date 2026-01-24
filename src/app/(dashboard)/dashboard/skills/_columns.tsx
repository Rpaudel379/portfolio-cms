"use client";

import { SkillSchemaDTO } from "@/schema/skill.schema";

import { Button } from "@/components/ui/button";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ColumnProps = {
  onEdit: (skill: SkillSchemaDTO) => void;
  onDelete: (id: string) => void;
  onVisibilityChange: (skill: SkillSchemaDTO) => void;
};

const columnHelper = createColumnHelper<SkillSchemaDTO>();

export const getSkillColumns = ({
  onEdit,
  onDelete,
  onVisibilityChange,
}: ColumnProps): ColumnDef<SkillSchemaDTO, never>[] => {
  const columns = [
    columnHelper.accessor("name", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-5 font-semibold"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium p-5">{row.getValue("name")}</div>
      ),
    }),

    columnHelper.accessor("visible", {
      header: "Visible",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Checkbox
            className="cursor-pointer "
            checked={item.visible}
            onCheckedChange={(checked) => {
              onVisibilityChange({ ...item, visible: checked as boolean });
            }}
            aria-label={`Toggle visibility for ${item.name}`}
          />
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-5 font-semibold"
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return <div className="p-5">{date.toLocaleDateString()}</div>;
      },
    }),
    columnHelper.accessor("updatedAt", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-5 font-semibold"
          >
            Updated At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("updatedAt") as Date;
        return <div className="p-5">{date.toLocaleDateString()}</div>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit(item)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item.id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  return columns;
};
