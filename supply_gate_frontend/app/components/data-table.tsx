"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";

interface Column {
  key: string;
  header: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: Record<string, string | number>[];
  createButtonLabel: string;
  onOpenDialog?: () => void;
}

export function DataTable({
  title,
  columns,
  data,
  createButtonLabel,
  onOpenDialog,
}: DataTableProps) {

  const handleUpdate = (row: Record<string, string | number>) => {
    console.log("Updating row:", row);
    // Here you would typically open an edit dialog or navigate to an edit page
    alert(`Update functionality for ${title}. Row ID: ${row.id || 'N/A'}`);
  };

  const handleDelete = (row: Record<string, string | number>) => {
    if (confirm(`Are you sure you want to delete this item from ${title}?`)) {
      console.log("Deleting row:", row);
      // Here you would typically make an API call to delete the item
      alert(`Delete functionality for ${title}. Row ID: ${row.id || 'N/A'}`);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <Button
          onClick={onOpenDialog || (() => {})}
          className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white text-sm px-4 py-2 h-auto font-medium"
        >
          {createButtonLabel}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                      onClick={() => handleUpdate(row)}
                      className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                    >
                      update
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(row)}
                      className="bg-red-600 hover:bg-red-700 text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
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
