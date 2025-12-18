"use client";

import { Sidebar } from "@/app/components/sidebar";
import { DataTable } from "@/app/components/data-table";
import { Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { StoreDialog } from "@/app/components/store-dialog";
import { CategoryDialog } from "@/app/components/category-dialog";
import { ProductDialog } from "@/app/components/product-dialog";
import { storeApi, categoryApi, productApi, StoreResponseDto, CategoryResponseDto, ProductResponseDto } from "@/app/lib/api";
import { TableSearch } from "@/app/components/table-search";
import { TablePagination } from "@/app/components/table-pagination";
import { Button } from "@/app/components/ui/button";

const storeColumns = [
  { key: "storeId", header: "store id" },
  { key: "storeName", header: "store name" },
  { key: "phoneNumber", header: "phone number" },
  { key: "storeEmail", header: "store email" },
];

const categoryColumns = [
  { key: "categoryId", header: "category id" },
  { key: "categoryName", header: "category name" },
];

const productColumns = [
  { key: "productId", header: "product id" },
  { key: "productName", header: "product name" },
  { key: "categoryName", header: "category" },
  { key: "storeName", header: "store name" },
  { key: "productPrice", header: "price" },
  { key: "quantity", header: "quantity" },
];

export default function StorePage() {
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);

  // Edit state - track which item is being edited
  const [editingStore, setEditingStore] = useState<StoreResponseDto | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductResponseDto | null>(null);

  // Stores state
  const [stores, setStores] = useState<StoreResponseDto[]>([]);
  const [storesPage, setStoresPage] = useState(0);
  const [storesPageSize, setStoresPageSize] = useState(20);
  const [storesTotalPages, setStoresTotalPages] = useState(0);
  const [storesTotalElements, setStoresTotalElements] = useState(0);
  const [storesSearch, setStoresSearch] = useState("");
  
  // Categories state
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [categoriesPage, setCategoriesPage] = useState(0);
  const [categoriesPageSize, setCategoriesPageSize] = useState(20);
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(0);
  const [categoriesTotalElements, setCategoriesTotalElements] = useState(0);
  const [categoriesSearch, setCategoriesSearch] = useState("");
  
  // Products state
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [productsPage, setProductsPage] = useState(0);
  const [productsPageSize, setProductsPageSize] = useState(20);
  const [productsTotalPages, setProductsTotalPages] = useState(0);
  const [productsTotalElements, setProductsTotalElements] = useState(0);
  const [productsSearch, setProductsSearch] = useState("");
  
  // Loading and error states
  const [loading, setLoading] = useState({
    stores: false,
    categories: false,
    products: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Get userId from localStorage safely (client-side only)
  // If not found, try to fetch it from the API
  useEffect(() => {
    const loadUserId = async () => {
      if (typeof window !== 'undefined') {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          // Try to fetch userId if we have a token
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const { authApi } = await import("@/app/lib/api");
              const userId = await authApi.getUserId();
              setUserId(userId);
            } catch (err) {
              // If we can't get userId, that's okay - user can still login
              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn('Could not fetch userId:', err);
              }
            }
          }
        }
      }
    };
    loadUserId();
  }, []);

  // Fetch stores when pagination/search changes
  useEffect(() => {
    fetchStores();
  }, [storesPage, storesPageSize, storesSearch]);

  // Fetch categories when pagination/search changes
  useEffect(() => {
    fetchCategories();
  }, [categoriesPage, categoriesPageSize, categoriesSearch]);

  // Fetch products when pagination/search changes
  useEffect(() => {
    fetchProducts();
  }, [productsPage, productsPageSize, productsSearch]);

  /**
   * Fetch stores from the backend (paginated with search)
   * This function calls the Spring Boot API endpoint: GET /api/stores/stores?page={page}&size={size}&search={search}
   */
  const fetchStores = async () => {
    setLoading((prev) => ({ ...prev, stores: true }));
    setError(null);
    try {
      const data = await storeApi.getAllStores(storesPage, storesPageSize, storesSearch);
      setStores(data.content);
      setStoresTotalPages(data.totalPages);
      setStoresTotalElements(data.totalElements);
    } catch (err: any) {
      // Error is already formatted by the API interceptor
      const errorMessage = err.message || "Failed to fetch stores";
      setError(errorMessage);
      
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error fetching stores:", err);
      }
    } finally {
      setLoading((prev) => ({ ...prev, stores: false }));
    }
  };

  /**
   * Fetch categories from the backend (paginated with search)
   * This function calls the Spring Boot API endpoint: GET /api/categories/categories?page={page}&size={size}&search={search}
   */
  const fetchCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    setError(null);
    try {
      const data = await categoryApi.getAllCategories(categoriesPage, categoriesPageSize, categoriesSearch);
      setCategories(data.content);
      setCategoriesTotalPages(data.totalPages);
      setCategoriesTotalElements(data.totalElements);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch categories";
      setError(errorMessage);
      
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error fetching categories:", err);
      }
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  /**
   * Fetch products from the backend (paginated with search)
   * This function calls the Spring Boot API endpoint: GET /api/products/getProducts?page={page}&size={size}&search={search}
   */
  const fetchProducts = async () => {
    setLoading((prev) => ({ ...prev, products: true }));
    setError(null);
    try {
      const response = await productApi.getAllProducts(productsPage, productsPageSize, productsSearch);
      setProducts(response.content);
      setProductsTotalPages(response.totalPages);
      setProductsTotalElements(response.totalElements);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch products";
      setError(errorMessage);
      
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error("Error fetching products:", err);
      }
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const handleStoreSubmit = async (data: {
    storeName: string;
    phoneNumber: string;
    storeEmail: string;
    userId?: string;
  }) => {
    try {
      setError(null);
      
      if (editingStore && editingStore.storeId) {
        // Update existing store
        await storeApi.updateStore(editingStore.storeId, {
          storeName: data.storeName,
          phoneNumber: data.phoneNumber,
          storeEmail: data.storeEmail,
          userId: userId || "",
        });
        alert("Store updated successfully!");
      } else {
        // Create new store
        const currentUserId = userId || data.userId || "";
        if (!currentUserId) {
          setError("User ID is required. Please login again.");
          return;
        }
        
        await storeApi.createStore({
          ...data,
          userId: currentUserId,
        });
        alert("Store created successfully!");
      }
      
      // Refresh stores list
      await fetchStores();
      setStoreDialogOpen(false);
      setEditingStore(null);
    } catch (err: any) {
      const errorMessage = err.message || err.storeName || (editingStore ? "Failed to update store" : "Failed to create store");
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleCategorySubmit = async (data: { categoryName: string }) => {
    try {
      setError(null);
      
      if (editingCategory && editingCategory.categoryId) {
        // Update existing category
        await categoryApi.updateCategory(editingCategory.categoryId, data);
        alert("Category updated successfully!");
      } else {
        // Create new category
        await categoryApi.createCategory(data);
        alert("Category created successfully!");
      }
      
      // Refresh categories list
      await fetchCategories();
      setCategoryDialogOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      const errorMessage = err.message || err.categoryName || (editingCategory ? "Failed to update category" : "Failed to create category");
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleProductSubmit = async (data: {
    categoryId: string;
    storeId: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    quantity: string;
    images?: File[];
  }) => {
    try {
      setError(null);
      
      if (editingProduct && editingProduct.productId) {
        // Update existing product
        await productApi.updateProduct(editingProduct.productId, {
          categoryId: data.categoryId,
          storeId: data.storeId,
          productName: data.productName,
          productDescription: data.productDescription,
          productPrice: data.productPrice,
          quantity: data.quantity,
        });
        alert("Product updated successfully!");
      } else {
        // Create new product
        await productApi.createProduct({
          categoryId: data.categoryId,
          storeId: data.storeId,
          productName: data.productName,
          productDescription: data.productDescription,
          productPrice: data.productPrice,
          quantity: data.quantity,
        });
        alert("Product created successfully!");
      }
      
      // Refresh products list
      await fetchProducts();
      setProductDialogOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      const errorMessage = err.message || err.productName || (editingProduct ? "Failed to update product" : "Failed to create product");
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  // Handlers to open dialogs in edit mode
  const handleEditStore = (store: StoreResponseDto) => {
    setEditingStore(store);
    setStoreDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryResponseDto) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleEditProduct = (product: ProductResponseDto) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  // Handlers to open dialogs in create mode
  const handleCreateStore = () => {
    setEditingStore(null);
    setStoreDialogOpen(true);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductDialogOpen(true);
  };

  // Handlers to close dialogs and reset edit state
  const handleCloseStoreDialog = () => {
    setStoreDialogOpen(false);
    setEditingStore(null);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 h-full">
      <Sidebar />

      <main className="flex-1 p-8 min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Store</h1>
          <div className="flex items-center gap-4">
            {/* Connection Test Button - Only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={async () => {
                  try {
                    const test = await storeApi.getAllStores(0, 10);
                    alert(`✅ Backend is connected! Found ${test.totalElements} stores.`);
                  } catch (err: any) {
                    alert(`❌ Connection failed: ${err.message || 'Unknown error'}`);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                Test Connection
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">12, July 2025</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Store Info Table */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Store info</h3>
            <Button
              onClick={handleCreateStore}
              className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white text-sm px-4 py-2 h-auto font-medium"
            >
              create store
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <TableSearch
              placeholder="Search stores by name, email, or phone..."
              onSearch={(search) => {
                setStoresSearch(search);
                setStoresPage(0); // Reset to first page when searching
              }}
              className="max-w-md"
            />
          </div>

          {loading.stores ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#1e4d5c]" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {storeColumns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {col.header}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.length === 0 ? (
                      <tr>
                        <td colSpan={storeColumns.length + 1} className="text-center py-8 text-gray-500">
                          {storesSearch ? "No stores found matching your search" : "No stores yet"}
                        </td>
                      </tr>
                    ) : (
                      stores.map((store) => (
                        <tr key={store.storeId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-700 text-sm">{store.storeId || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{store.storeName || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{store.phoneNumber || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{store.storeEmail || ""}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStore(store)}
                                className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                              >
                                update
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this store?")) {
                                    storeApi.deleteStore(store.storeId || "").then(() => fetchStores()).catch(console.error);
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                              >
                                delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <TablePagination
                currentPage={storesPage}
                totalPages={storesTotalPages}
                totalElements={storesTotalElements}
                pageSize={storesPageSize}
                onPageChange={setStoresPage}
                onPageSizeChange={(size) => {
                  setStoresPageSize(size);
                  setStoresPage(0);
                }}
                loading={loading.stores}
              />
            </>
          )}
        </div>

        {/* Category Info Table */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Category info</h3>
            <Button
              onClick={handleCreateCategory}
              className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white text-sm px-4 py-2 h-auto font-medium"
            >
              create category
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <TableSearch
              placeholder="Search categories by name..."
              onSearch={(search) => {
                setCategoriesSearch(search);
                setCategoriesPage(0); // Reset to first page when searching
              }}
              className="max-w-md"
            />
          </div>

          {loading.categories ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#1e4d5c]" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {categoryColumns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {col.header}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={categoryColumns.length + 1} className="text-center py-8 text-gray-500">
                          {categoriesSearch ? "No categories found matching your search" : "No categories yet"}
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.categoryId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-700 text-sm">{category.categoryId || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{category.categoryName || ""}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                                className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                              >
                                update
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this category?")) {
                                    categoryApi.deleteCategory(category.categoryId || "").then(() => fetchCategories()).catch(console.error);
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                              >
                                delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <TablePagination
                currentPage={categoriesPage}
                totalPages={categoriesTotalPages}
                totalElements={categoriesTotalElements}
                pageSize={categoriesPageSize}
                onPageChange={setCategoriesPage}
                onPageSizeChange={(size) => {
                  setCategoriesPageSize(size);
                  setCategoriesPage(0);
                }}
                loading={loading.categories}
              />
            </>
          )}
        </div>

        {/* Product Info Table */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">product info</h3>
            <Button
              onClick={handleCreateProduct}
              className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white text-sm px-4 py-2 h-auto font-medium"
            >
              create product
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <TableSearch
              placeholder="Search products by name, category, store, or description..."
              onSearch={(search) => {
                setProductsSearch(search);
                setProductsPage(0); // Reset to first page when searching
              }}
              className="max-w-md"
            />
          </div>

          {loading.products ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#1e4d5c]" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {productColumns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          {col.header}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={productColumns.length + 1} className="text-center py-8 text-gray-500">
                          {productsSearch ? "No products found matching your search" : "No products yet"}
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.productId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-700 text-sm">{product.productId || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{product.productName || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{product.categoryName || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{product.storeName || ""}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{product.productPrice || 0}</td>
                          <td className="px-4 py-3 text-gray-700 text-sm">{product.quantity || ""}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="bg-[#1a3a3a] hover:bg-[#2a4a4a] text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                              >
                                update
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this product?")) {
                                    productApi.deleteProduct(product.productId || "").then(() => fetchProducts()).catch(console.error);
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white border-none text-xs px-3 py-1.5 h-auto font-medium"
                              >
                                delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <TablePagination
                currentPage={productsPage}
                totalPages={productsTotalPages}
                totalElements={productsTotalElements}
                pageSize={productsPageSize}
                onPageChange={setProductsPage}
                onPageSizeChange={(size) => {
                  setProductsPageSize(size);
                  setProductsPage(0);
                }}
                loading={loading.products}
              />
            </>
          )}
        </div>

        {/* Dialogs */}
        <StoreDialog
          open={storeDialogOpen}
          onClose={handleCloseStoreDialog}
          onSubmit={handleStoreSubmit}
          storeId={editingStore?.storeId}
          initialData={editingStore ? {
            storeName: editingStore.storeName || "",
            phoneNumber: editingStore.phoneNumber || "",
            storeEmail: editingStore.storeEmail || "",
          } : undefined}
        />
        <CategoryDialog
          open={categoryDialogOpen}
          onClose={handleCloseCategoryDialog}
          onSubmit={handleCategorySubmit}
          categoryId={editingCategory?.categoryId}
          initialData={editingCategory ? {
            categoryName: editingCategory.categoryName || "",
          } : undefined}
        />
        <ProductDialog
          open={productDialogOpen}
          onClose={handleCloseProductDialog}
          onSubmit={handleProductSubmit}
          productId={editingProduct?.productId}
          initialData={editingProduct ? {
            categoryId: editingProduct.categoryId || "",
            storeId: editingProduct.storeId || "",
            productName: editingProduct.productName || "",
            productDescription: editingProduct.productDescription || "",
            productPrice: editingProduct.productPrice || 0,
            quantity: editingProduct.quantity || "",
            imageUrls: editingProduct.imageUrls || [],
          } : undefined}
          categories={categories.map((cat) => ({
            id: cat.categoryId?.toString() || "",
            name: cat.categoryName || "",
          }))}
          stores={stores.map((store) => ({
            id: store.storeId?.toString() || "",
            name: store.storeName || "",
          }))}
        />
      </main>
    </div>
  );
}

