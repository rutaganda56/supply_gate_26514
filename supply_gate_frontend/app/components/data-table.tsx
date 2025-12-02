"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import AddProductDialog from "../dashboard/store/components/addProduct";

interface Column {
  key: string;
  header: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: Record<string, string | number>[];
  createButtonLabel: string;
}

export function DataTable({
  title,
  columns,
  data,
  createButtonLabel,
}: DataTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-800 font-medium">{title}</h3>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white text-sm px-4 py-1.5 h-auto"
        >
          {createButtonLabel}
        </Button>
        <AddProductDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1a3a3a] text-white text-sm">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2 text-left font-medium">
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-2 text-left font-medium">action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 text-sm">
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white border-none text-xs px-3 py-1 h-auto"
                    >
                      update
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white border-none text-xs px-3 py-1 h-auto"
                    >
                      delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
