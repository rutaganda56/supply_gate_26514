import axios from 'axios';

/**
 * API Configuration
 * 
 * This file sets up axios (HTTP client) to communicate with the Spring Boot backend.
 * It includes:
 * - Base URL configuration
 * - Automatic authentication token injection
 * - Centralized error handling
 * - Request/response logging for debugging
 */

// Base API URL - Change this if your Spring Boot runs on a different port
// You can also set NEXT_PUBLIC_API_URL in .env.local file
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  // Don't set Content-Type by default - will be set in interceptor for requests with body
  // Timeout after 10 seconds if no response
  timeout: 10000,
});

/**
 * Request Interceptor
 * 
 * This runs BEFORE every API request.
 * It automatically adds the authentication token to all requests.
 */
api.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser (not during server-side rendering)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Only set Content-Type for requests with a body (POST, PUT, PATCH, etc.)
    // GET requests should not have Content-Type header
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH'].includes(method) && config.data !== undefined) {
      // Only set if not already set or if it's not FormData
      if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    } else if (method === 'GET' || method === 'DELETE') {
      // Remove Content-Type header for GET and DELETE requests
      delete config.headers['Content-Type'];
    }
    
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * This runs AFTER every API response.
 * It handles errors consistently across the entire application.
 */
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      const status = error.response.status;
      const errorData = error.response.data;
      
      // Log error for debugging (only in development, and only for non-network errors)
      if (process.env.NODE_ENV === 'development' && status !== 401 && status !== 403) {
        // eslint-disable-next-line no-console
        console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          error: errorData,
        });
      }
      
      // Handle specific error cases
      if (status === 401) {
        // Check if this is a login request
        const isLoginRequest = error.config?.url?.includes('/api/auth/login');
        
        if (isLoginRequest) {
          // For login requests, return the actual error message from backend
          const errorMessage = errorData?.message || errorData || 'Invalid username or password. Please check your credentials.';
          return Promise.reject({ 
            message: typeof errorMessage === 'string' ? errorMessage : 'Invalid username or password. Please check your credentials.',
            status: 401 
          });
        } else {
          // For other requests, it's a session expiration
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            // Optionally redirect to login
            // window.location.href = '/login';
          }
          return Promise.reject({ 
            message: 'Your session has expired. Please login again.',
            status: 401 
          });
        }
      }
      
      if (status === 403) {
        return Promise.reject({ 
          message: 'You do not have permission to perform this action.',
          status: 403 
        });
      }
      
      if (status === 404) {
        return Promise.reject({ 
          message: 'The requested resource was not found.',
          status: 404 
        });
      }
      
      // Return server error message or default message
      return Promise.reject({
        message: errorData?.message || `Server error (${status})`,
        ...errorData, // Include all error details
        status,
      });
    } else if (error.request) {
      // Request was made but no response received (network error, CORS, etc.)
      // Only log network errors in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[API Network Error]', {
          url: error.config?.url,
          message: 'No response from server. Is the backend running?',
        });
      }
      
      return Promise.reject({ 
        message: 'Cannot connect to server. Please check if the backend is running on ' + API_BASE_URL,
        isNetworkError: true,
      });
    } else {
      // Something else happened (request setup error)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('[API Setup Error]', error.message);
      }
      
      return Promise.reject({ 
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

// Types
export interface StoreDto {
  storeName: string;
  phoneNumber: string;
  storeEmail: string;
  userId: string;
}

export interface StoreResponseDto {
  storeId?: string;
  storeName: string;
  phoneNumber?: string;
  storeEmail?: string;
}

export interface CategoryDto {
  categoryName: string;
}

export interface CategoryResponseDto {
  categoryId?: string;
  categoryName: string;
}

export interface ProductDto {
  categoryId: string;
  storeId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  quantity: string;
}

export interface ProductResponseDto {
  productId?: string;
  productName: string;
  productDescription?: string;
  productPrice: number;
  quantity: string;
  categoryId?: string;
  categoryName?: string;
  storeId?: string;
  storeName?: string;
  imageUrls?: string[];           // Product image URLs
  supplierId?: string;            // Supplier (User) ID
  supplierName?: string;          // Supplier's full name
  supplierEmail?: string;         // Supplier's email
  isSupplierVerified?: boolean;   // Whether supplier is verified (APPROVED)
}

export interface NotificationResponseDto {
  notificationId: string;
  userId: string;
  userName: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessageResponseDto {
  messageId: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  messageContent: string;
  productId?: string;
  productName?: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
}

/**
 * Store API Functions
 * 
 * These functions communicate with the Spring Boot StoreController.
 * Endpoints:
 * - GET /api/stores/stores - Get all stores
 * - POST /api/stores/createStore - Create a new store
 * - PUT /api/stores/{id} - Update a store
 * - DELETE /api/stores/deleteStore/{id} - Delete a store
 */
export const storeApi = {
  /**
   * Get all stores (paginated with search).
   * Calls: GET http://localhost:8080/api/stores/stores?page={page}&size={size}&search={search}
   * 
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param search - Optional search term to filter stores
   */
  getAllStores: async (page: number = 0, size: number = 20, search?: string): Promise<{
    content: StoreResponseDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const response = await api.get(`/api/stores/stores?${params.toString()}`);
    return response.data;
  },

  /**
   * Create a new store
   * Calls: POST http://localhost:8080/api/stores/createStore
   * @param store - Store data (storeName, phoneNumber, storeEmail, userId)
   */
  createStore: async (store: StoreDto): Promise<StoreResponseDto> => {
    const response = await api.post<StoreResponseDto>('/api/stores/createStore', store);
    return response.data;
  },

  /**
   * Update an existing store
   * Calls: PUT http://localhost:8080/api/stores/{id}
   * @param id - Store UUID
   * @param store - Updated store data
   */
  updateStore: async (id: string, store: StoreDto): Promise<StoreResponseDto> => {
    const response = await api.put<StoreResponseDto>(`/api/stores/${id}`, store);
    return response.data;
  },

  /**
   * Delete a store
   * Calls: DELETE http://localhost:8080/api/stores/deleteStore/{id}
   * @param id - Store UUID
   */
  deleteStore: async (id: string): Promise<void> => {
    await api.delete(`/api/stores/deleteStore/${id}`);
  },
};

/**
 * Category API Functions
 * 
 * These functions communicate with the Spring Boot CategoryController.
 * Endpoints:
 * - GET /api/categories/categories - Get all categories
 * - POST /api/categories/createCategory - Create a new category
 * - PUT /api/categories/{id} - Update a category
 * - DELETE /api/categories/deleteCategory/{id} - Delete a category
 */
export const categoryApi = {
  /**
   * Get all categories (paginated with search).
   * Calls: GET http://localhost:8080/api/categories/categories?page={page}&size={size}&search={search}
   * 
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param search - Optional search term to filter categories
   */
  getAllCategories: async (page: number = 0, size: number = 20, search?: string): Promise<{
    content: CategoryResponseDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const response = await api.get(`/api/categories/categories?${params.toString()}`);
    return response.data;
  },

  /**
   * Create a new category
   * Calls: POST http://localhost:8080/api/categories/createCategory
   * @param category - Category data (categoryName)
   */
  createCategory: async (category: CategoryDto): Promise<CategoryResponseDto> => {
    const response = await api.post<CategoryResponseDto>('/api/categories/createCategory', category);
    return response.data;
  },

  /**
   * Update an existing category
   * Calls: PUT http://localhost:8080/api/categories/{id}
   * @param id - Category UUID
   * @param category - Updated category data
   */
  updateCategory: async (id: string, category: CategoryDto): Promise<CategoryResponseDto> => {
    const response = await api.put<CategoryResponseDto>(`/api/categories/${id}`, category);
    return response.data;
  },

  /**
   * Delete a category
   * Calls: DELETE http://localhost:8080/api/categories/deleteCategory/{id}
   * @param id - Category UUID
   */
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/api/categories/deleteCategory/${id}`);
  },
};

/**
 * Product API Functions
 * 
 * These functions communicate with the Spring Boot ProductController.
 * Endpoints:
 * - GET /api/products/getProducts - Get all products (paginated)
 * - POST /api/products/createAProduct - Create a new product
 * - PUT /api/products/{id} - Update a product
 * - DELETE /api/products/deleteProduct/{id} - Delete a product
 */
export const productApi = {
  /**
   * Get all products (paginated with search)
   * Calls: GET http://localhost:8080/api/products/getProducts?page={page}&size={size}&search={search}&verifiedOnly={verifiedOnly}
   * SECURITY: This is a public endpoint - no authentication required for website display.
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param search - Optional search term to filter products
   * @param verifiedOnly - Optional filter to show only products from verified suppliers (default: false - shows all products)
   */
  getAllProducts: async (page: number = 0, size: number = 10, search?: string, verifiedOnly: boolean = false): Promise<{
    content: ProductResponseDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      verifiedOnly: verifiedOnly.toString(),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    // Use axios directly for public endpoint (no auth token required)
    const response = await axios.get(
      `${API_BASE_URL}/api/products/getProducts?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Create a new product
   * Calls: POST http://localhost:8080/api/products/createAProduct
   * @param product - Product data (categoryId, storeId, productName, productDescription, productPrice, quantity)
   */
  createProduct: async (product: ProductDto): Promise<ProductResponseDto> => {
    const response = await api.post<ProductResponseDto>('/api/products/createAProduct', product);
    return response.data;
  },

  /**
   * Update an existing product
   * Calls: PUT http://localhost:8080/api/products/{id}
   * @param id - Product UUID
   * @param product - Updated product data
   */
  updateProduct: async (id: string, product: ProductDto): Promise<ProductResponseDto> => {
    const response = await api.put<ProductResponseDto>(`/api/products/${id}`, product);
    return response.data;
  },

  /**
   * Delete a product
   * Calls: DELETE http://localhost:8080/api/products/deleteProduct/{id}
   * @param id - Product UUID
   */
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/products/deleteProduct/${id}`);
  },
};

/**
 * Authentication API Functions
 * 
 * These functions handle user authentication (login, register).
 * Endpoints:
 * - POST /api/auth/login - Login user
 * - POST /api/auth/register - Register new user
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  userType: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  locationId?: string;
  companyName?: string;  // Required for industry workers
}

export interface RegisterResponse {
  username: string;
  firstname: string;
  lastname: string;
  userId?: string;
}

/**
 * Authentication response DTO.
 * Returned after successful login or token refresh.
 */
export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // seconds until access token expires
  userId: string; // UUID as string
  username: string;
  userType: string;
}

/**
 * Two-factor authentication response DTO.
 * Returned when 2FA is required after initial login.
 */
export interface TwoFactorAuthResponseDto {
  sessionId: string;
  userId: string; // UUID as string
  username: string;
  message: string;
}

export const authApi = {
  /**
   * Login user
   * Calls: POST http://localhost:8080/api/auth/login
   * @param credentials - Username and password
   * @returns AuthResponseDto with tokens, or TwoFactorAuthResponseDto if 2FA is required
   */
  login: async (credentials: LoginRequest): Promise<AuthResponseDto | TwoFactorAuthResponseDto> => {
    const response = await axios.post<AuthResponseDto | { requires2FA: boolean; sessionId: string; userId: string; username: string; message: string }>(
      `${API_BASE_URL}/api/auth/login`,
      {
        username: credentials.username,
        password: credentials.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // Increased to 30 seconds to allow time for 2FA email sending
      }
    );
    
    // Check if 2FA is required
    const data = response.data as any;
    if (data.requires2FA === true) {
      // Return as TwoFactorAuthResponseDto
      return {
        sessionId: data.sessionId,
        userId: data.userId,
        username: data.username,
        message: data.message || "Please check your email for the verification code to complete login.",
      } as TwoFactorAuthResponseDto;
    }
    
    // Normal login response (AuthResponseDto)
    return data as AuthResponseDto;
  },

  /**
   * Get current user information
   * This is used to get userId after login
   * Note: This requires authentication, so call it after storing the token
   * 
   * IMPORTANT: This is a workaround - ideally the backend should have a GET /api/auth/me endpoint
   */
  getCurrentUser: async (): Promise<{ userId?: string; username: string; firstname: string; lastname: string }> => {
    try {
      // Get all users and find the one matching the username
      // Note: This is not ideal but works until we have a "get current user" endpoint
      const response = await api.get<RegisterResponse[]>('/api/auth/getAllUsers');
      const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
      
      if (!username) {
        const error = { 
          message: 'Username not found in storage. Please login again.',
          status: 401,
          requiresLogin: true
        };
        throw error;
      }
      
      // Find user by username (assuming username is unique)
      // Note: In production, you should have a dedicated endpoint like GET /api/auth/me
      const user = response.data.find(u => u.username === username);
      
      if (!user) {
        const error = { 
          message: 'User not found. Please login again.',
          status: 401,
          requiresLogin: true
        };
        throw error;
      }
      
      return {
        ...user,
        userId: (user as any).userId, // userId might be in the response
      };
    } catch (error: any) {
      // Ensure we always have a proper error object with message
      if (error && typeof error === 'object') {
        // If error already has message and status, use it
        if (error.message && error.status) {
          throw error;
        }
        // If error has response data, extract from there
        if (error.response) {
          const status = error.response.status || error.status;
          const errorData = error.response.data;
          const message = errorData?.message || 
                         (typeof errorData === 'string' ? errorData : 'Your session has expired. Please login again.');
          throw {
            message,
            status: status || 401,
            requiresLogin: true,
            response: error.response,
            originalError: error
          };
        }
        // If error is from axios interceptor (already formatted)
        if (error.status) {
          throw {
            message: error.message || 'Your session has expired. Please login again.',
            status: error.status,
            requiresLogin: error.requiresLogin !== false,
            originalError: error
          };
        }
      }
      
      // Fallback: create a proper error object
      throw {
        message: 'Failed to get user information. Please login again.',
        status: 401,
        requiresLogin: true,
        originalError: error
      };
    }
  },

  /**
   * Helper function to get or fetch userId
   * This ensures we always have userId available
   */
  getUserId: async (): Promise<string> => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot access localStorage on server');
    }

    // First, try to get from localStorage
    let userId = localStorage.getItem('userId');
    
    if (userId) {
      return userId;
    }

    // If not found, fetch from API
    try {
      const userInfo = await authApi.getCurrentUser();
      if (userInfo.userId) {
        localStorage.setItem('userId', userInfo.userId);
        return userInfo.userId;
      }
      
      // If userId is still not available, we need to get it from the user list
      // This is a fallback - ideally backend should return userId in login response
      throw new Error('User ID not available. Please login again.');
    } catch (error) {
      throw new Error('Could not retrieve user ID. Please login again.');
    }
  },

  /**
   * Register new user
   * Calls: POST http://localhost:8080/api/auth/register
   * @param userData - User registration data
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/api/auth/register`,
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  /**
   * Request password reset (forgot password).
   * SECURITY: This is a public endpoint - no authentication required.
   * 
   * @param email - User's registered email address
   * @returns Success message (doesn't reveal if email exists)
   */
  forgotPassword: async (email: string): Promise<string> => {
    // Use axios directly without the api instance to avoid token requirement
    const response = await axios.post<string>(
      `${API_BASE_URL}/api/auth/forgot-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Reset password using token.
   * SECURITY: This is a public endpoint - no authentication required.
   * 
   * @param token - Password reset token from email
   * @param newPassword - New password (minimum 6 characters)
   * @returns Success message
   */
  resetPassword: async (token: string, newPassword: string): Promise<string> => {
    // Use axios directly without the api instance to avoid token requirement
    const response = await axios.post<string>(
      `${API_BASE_URL}/api/auth/reset-password`,
      { token, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Validate password reset token.
   * SECURITY: This is a public endpoint - no authentication required.
   * 
   * @param token - Password reset token to validate
   * @returns Validation result with status
   */
  validateResetToken: async (token: string): Promise<{ valid: boolean; status: string }> => {
    // Use axios directly without the api instance to avoid token requirement
    const response = await axios.get<{ valid: boolean; status: string }>(
      `${API_BASE_URL}/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Verify 2FA code and complete login.
   * SECURITY: This is a public endpoint - no authentication required.
   * 
   * @param sessionId - 2FA session ID from login response
   * @param code - 6-digit verification code
   * @returns AuthResponseDto with tokens and user info
   */
  verify2FA: async (sessionId: string, code: string): Promise<AuthResponseDto> => {
    // Use axios directly without the api instance to avoid token requirement
    const response = await axios.post<AuthResponseDto>(
      `${API_BASE_URL}/api/auth/verify-2fa`,
      { sessionId, code },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Resend 2FA verification code.
   * SECURITY: This is a public endpoint - no authentication required.
   * 
   * @param sessionId - 2FA session ID
   * @returns Success message with new session ID
   */
  resend2FACode: async (sessionId: string): Promise<{ message: string; sessionId: string }> => {
    // Use axios directly without the api instance to avoid token requirement
    const response = await axios.post<{ message: string; sessionId: string }>(
      `${API_BASE_URL}/api/auth/resend-2fa-code`,
      { sessionId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Validate 2FA session.
   * SECURITY: This is a public endpoint - no authentication required.
   * 
   * @param sessionId - 2FA session ID to validate
   * @returns Validation result with status
   */
  validate2FASession: async (sessionId: string): Promise<{ valid: boolean; status: string }> => {
    // Use axios directly without the api instance to avoid token requirement
    const response = await axios.get<{ valid: boolean; status: string }>(
      `${API_BASE_URL}/api/auth/validate-2fa-session?sessionId=${encodeURIComponent(sessionId)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },
};

/**
 * Location API Functions
 * 
 * These functions handle Rwanda administrative structure (District → Sector → Cell → Village).
 * Endpoints:
 * - GET /api/location/getGovernmentStructures - Get all locations
 * - GET /api/location/getGovernmentStructureByStructureCode - Get location by code
 */
export interface LocationResponse {
  structureId: string;
  structureCode: string;
  structureName: string;
  structureType: 'PROVINCE' | 'DISTRICT' | 'SECTOR' | 'CELL' | 'VILLAGE';
  parent?: LocationResponse;
}

export const locationApi = {
  /**
   * Get all government structures (locations)
   * Calls: GET http://localhost:8080/api/location/getGovernmentStructures
   * 
   * Note: This endpoint should be accessible without authentication for registration pages.
   * If you see 401 errors, make sure SecurityConfig allows "/api/location/**" in permitAll.
   * 
   * @returns Array of all locations
   */
  getAllLocations: async (): Promise<LocationResponse[]> => {
    // Use axios directly (not the api instance) to avoid auth token requirement
    // This is needed for registration pages where users aren't logged in yet
    const response = await axios.get<LocationResponse[]>(
      `${API_BASE_URL}/api/location/getGovernmentStructures`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },

  /**
   * Get location by structure code
   * Calls: GET http://localhost:8080/api/location/getGovernmentStructureByStructureCode?structureCode={code}
   * @param structureCode - The structure code to search for
   */
  getLocationByCode: async (structureCode: string): Promise<LocationResponse> => {
    const response = await api.get<LocationResponse>(
      `/api/location/getGovernmentStructureByStructureCode?structureCode=${structureCode}`
    );
    return response.data;
  },
};

/**
 * Notification API Functions
 * 
 * These functions communicate with the Spring Boot NotificationController.
 * Endpoints:
 * - GET /api/notifications - Get all notifications (paginated)
 * - GET /api/notifications/all - Get all notifications (non-paginated)
 * - GET /api/notifications/unread - Get unread notifications
 * - GET /api/notifications/unread-count - Get unread notification count
 * - PUT /api/notifications/{id}/read - Mark notification as read
 * - PUT /api/notifications/read-all - Mark all notifications as read
 */
export const notificationApi = {
  /**
   * Get all notifications for the authenticated user (paginated with search).
   * Requires authentication.
   * 
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param search - Optional search term to filter notifications
   */
  getAll: async (page: number = 0, size: number = 20, search?: string): Promise<{
    content: NotificationResponseDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response.data;
  },

  /**
   * Get all notifications for the authenticated user (non-paginated).
   * Requires authentication.
   */
  getAllNotifications: async (): Promise<NotificationResponseDto[]> => {
    const response = await api.get<NotificationResponseDto[]>('/api/notifications/all');
    return response.data;
  },

  /**
   * Get unread notifications for the authenticated user.
   * Requires authentication.
   */
  getUnread: async (): Promise<NotificationResponseDto[]> => {
    const response = await api.get<NotificationResponseDto[]>('/api/notifications/unread');
    return response.data;
  },

  /**
   * Get unread notification count for the authenticated user.
   * Requires authentication.
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<number>('/api/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a notification as read.
   * Requires authentication.
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.put(`/api/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read for the authenticated user.
   * Requires authentication.
   */
  markAllAsRead: async (): Promise<void> => {
    await api.put('/api/notifications/read-all');
  },

  /**
   * Get sender email for a message notification.
   * Requires authentication.
   * 
   * @param notificationId Notification ID
   * @returns Sender email if found
   */
  getSenderEmail: async (notificationId: string): Promise<string> => {
    const response = await api.get<string>(`/api/notifications/${notificationId}/sender-email`);
    return response.data;
  },
};

/**
 * Message API Functions
 * 
 * These functions communicate with the Spring Boot MessageController.
 * Endpoints:
 * - POST /api/messages/send - Send a message to a supplier (public)
 * - GET /api/messages/my-messages - Get all messages for authenticated supplier
 * - GET /api/messages/unread - Get unread messages
 * - GET /api/messages/unread-count - Get unread message count
 * - PUT /api/messages/{id}/read - Mark message as read
 */
export const messageApi = {
  /**
   * Send a message to a supplier.
   * SECURITY: This is a public endpoint - no authentication required.
   */
  sendMessage: async (message: {
    supplierId: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    subject: string;
    messageContent: string;
    productId?: string;
    productName?: string;
  }): Promise<MessageResponseDto> => {
    // Use axios directly for public endpoint
    const response = await axios.post<MessageResponseDto>(
      `${API_BASE_URL}/api/messages/send`,
      message,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    return response.data;
  },

  /**
   * Get all messages for the authenticated supplier (paginated with search).
   * Requires authentication.
   * 
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param search - Optional search term to filter messages
   */
  getMyMessages: async (page: number = 0, size: number = 20, search?: string): Promise<{
    content: MessageResponseDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const response = await api.get(`/api/messages/my-messages?${params.toString()}`);
    return response.data;
  },

  /**
   * Get unread messages for the authenticated supplier.
   * Requires authentication.
   */
  getUnreadMessages: async (): Promise<MessageResponseDto[]> => {
    const response = await api.get<MessageResponseDto[]>('/api/messages/unread');
    return response.data;
  },

  /**
   * Get unread message count for the authenticated supplier.
   * Requires authentication.
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<number>('/api/messages/unread-count');
    return response.data;
  },

  /**
   * Mark a message as read.
   * Requires authentication.
   */
  markAsRead: async (messageId: string): Promise<void> => {
    await api.put(`/api/messages/${messageId}/read`);
  },
};

/**
 * Verification API Functions
 * 
 * These functions communicate with the Spring Boot VerificationController.
 * Endpoints:
 * - GET /api/verification - Get all verifications
 * - POST /api/verification/submit - Submit verification documents
 * - GET /api/verification/my-verification - Get current user's verification
 * - POST /api/verification/{id}/review - Review verification (approve/reject)
 */
export const verificationApi = {
  /**
   * Get all verifications (paginated with search).
   * Requires authentication.
   * 
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @param search - Optional search term to filter verifications
   */
  getAll: async (page: number = 0, size: number = 20, search?: string): Promise<{
    content: VerificationResponseDto[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    const response = await api.get(`/api/verification?${params.toString()}`);
    return response.data;
  },

  /**
   * Get current user's verification.
   * Requires authentication.
   */
  getMyVerification: async (): Promise<VerificationResponseDto | null> => {
    try {
      const response = await api.get<VerificationResponseDto>('/api/verification/my-verification');
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  /**
   * Submit verification documents.
   * Requires authentication (supplier role).
   */
  submit: async (data: {
    companyName: string;
    businessLicense?: File;
    taxCertificate?: File;
    bankStatement?: File;
    identityProof?: File;
  }): Promise<VerificationResponseDto> => {
    const formData = new FormData();
    formData.append('companyName', data.companyName);
    if (data.businessLicense) formData.append('businessLicense', data.businessLicense);
    if (data.taxCertificate) formData.append('taxCertificate', data.taxCertificate);
    if (data.bankStatement) formData.append('bankStatement', data.bankStatement);
    if (data.identityProof) formData.append('identityProof', data.identityProof);

    const response = await api.post<VerificationResponseDto>('/api/verification/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Review verification (approve or reject).
   * Requires authentication (industry worker role).
   */
  review: async (
    verificationId: string,
    reviewData: {
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
      reviewedBy?: string; // Optional - for backward compatibility, but backend gets from security context
    }
  ): Promise<VerificationResponseDto> => {
    const response = await api.post<VerificationResponseDto>(
      `/api/verification/${verificationId}/review`,
      reviewData
    );
    return response.data;
  },
};

export interface VerificationResponseDto {
  verificationId: string;
  userId: string;
  supplierName: string;
  email: string;
  businessType?: string;
  status: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  businessLicenseUrl?: string;
  taxCertificateUrl?: string;
  bankStatementUrl?: string;
  identityProofUrl?: string;
  submittedDate?: string;
  lastUpdatedDate?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  companyName?: string;
}

/**
 * Dashboard API Functions
 * 
 * These functions communicate with the Spring Boot DashboardController.
 * Endpoints:
 * - GET /api/dashboard/supplier - Get supplier dashboard stats
 * - GET /api/dashboard/industry - Get industry dashboard stats
 */
export const dashboardApi = {
  /**
   * Get supplier dashboard statistics.
   * Requires authentication.
   * 
   * @returns DashboardStatsDto with real-time stats
   */
  getSupplierStats: async (): Promise<{
    totalFollowers: number;
    totalCustomers: number;
    totalImpressions: number;
    totalNotifications: number;
    followersChange: number;
    customersChange: number;
    impressionsChange: number;
    notificationsChange: number;
  }> => {
    const response = await api.get('/api/dashboard/supplier');
    return response.data;
  },

  /**
   * Get industry dashboard statistics.
   * Requires authentication.
   * 
   * @returns DashboardStatsDto with verification-related stats
   */
  getIndustryStats: async (): Promise<{
    totalFollowers: number;
    totalCustomers: number;
    totalImpressions: number;
    totalNotifications: number;
    followersChange: number;
    customersChange: number;
    impressionsChange: number;
    notificationsChange: number;
  }> => {
    const response = await api.get('/api/dashboard/industry');
    return response.data;
  },
};

/**
 * Global Search API Functions
 * 
 * Provides unified search across multiple entities.
 * Endpoints:
 * - GET /api/search?q={query}&limit={limit} - Global search
 */
export const globalSearchApi = {
  /**
   * Perform global search across products, stores, categories, verifications, and messages.
   * 
   * @param query Search query string
   * @param limit Maximum results per category (default: 5, max: 10)
   * @returns GlobalSearchResultDto with categorized results
   */
  search: async (query: string, limit: number = 5): Promise<{
    products: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      url: string;
      metadata: string;
    }>;
    stores: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      url: string;
      metadata: string;
    }>;
    categories: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      url: string;
      metadata: string;
    }>;
    verifications: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      url: string;
      metadata: string;
    }>;
    messages: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      url: string;
      metadata: string;
    }>;
    totalResults: number;
  }> => {
    const safeLimit = Math.min(Math.max(limit, 1), 10);
    const params = new URLSearchParams({
      q: query,
      limit: safeLimit.toString(),
    });
    
    const response = await api.get(`/api/search?${params.toString()}`);
    return response.data;
  },
};

export default api;

