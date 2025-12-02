import { Sidebar } from "@/app/components/sidebar";
import { DataTable } from "@/app/components/data-table";
import { Calendar } from "lucide-react";

const storeColumns = [
  { key: "id", header: "store id" },
  { key: "name", header: "store name" },
  { key: "phone", header: "phone number" },
  { key: "email", header: "store_email" },
];

const storeData = [
  {
    id: "1",
    name: "new store",
    phone: "+250788862012",
    email: "vale@gmail.com",
  },
];

const categoryColumns = [
  { key: "id", header: "category id" },
  { key: "name", header: "category name" },
  { key: "products", header: "products" },
];

const categoryData = [{ id: "1", name: "food", products: "10" }];

const productColumns = [
  { key: "id", header: "product id" },
  { key: "name", header: "product name" },
  { key: "category", header: "category" },
  { key: "storeName", header: "store name" },
];

const productData = [
  { id: "1", name: "nike", category: "shoes", storeName: "new store" },
];

export default function StorePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Store</h1>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Calendar className="w-4 h-4" />
            <span>12, July 2025</span>
          </div>
        </div>

        {/* Store Info Table */}
        <div className="mb-6">
          <DataTable
            title="Store info"
            columns={storeColumns}
            data={storeData}
            createButtonLabel="create store"
          />
        </div>

        {/* Category Info Table */}
        <div className="mb-6">
          <DataTable
            title="Category info"
            columns={categoryColumns}
            data={categoryData}
            createButtonLabel="create category"
          />
        </div>

        {/* Product Info Table */}
        <div className="mb-6">
          <DataTable
            title="product info"
            columns={productColumns}
            data={productData}
            createButtonLabel="create product"
          />
        </div>
      </main>
    </div>
  );
}
