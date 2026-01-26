import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
  CategoryWithCreator,
  DigitalProduct,
  DigitalProductResponse,
  PhysicalProduct,
  PhysicalProductResponse,
  ProductsResponse,
} from '@/types/product';
import { Product } from '@/types/org';

interface ProductState {
  products: Product[];
  product: Product | null;
  digital_products: DigitalProduct[];
  digital_products_count: number;
  physical_products: PhysicalProduct[];
  physical_products_count: number;

  category: CategoryWithCreator | null;
  categories: CategoryWithCreator[];

  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  digital_products: [],
  digital_products_count: 0,
  physical_products: [],
  physical_products_count: 0,

  categories: [],
  category: null,

  count: 0,
  loading: false,
  error: null,
};

/**
 * Fetch products by organization (general products)
 */
export const fetchProductsByOrganization = createAsyncThunk<
  ProductsResponse,
  {
    page?: number;
    limit?: number;
    q?: string;
    business_id?: string;
    type?: string;
    min_price?: number;
    max_price?: number;
    currency?: string;
  },
  { rejectValue: string }
>(
  'product/fetchProductsByOrganization',
  async (
    { page, limit, q, business_id, type, min_price, max_price, currency },
    { rejectWithValue },
  ) => {
    const params: Record<string, any> = {};

    if (page) params['pagination[page]'] = page;
    if (limit) params['pagination[limit]'] = limit;
    if (q) params.q = q;
    if (type) params.type = type;
    if (min_price) params.min_price = min_price;
    if (max_price) params.max_price = max_price;
    if (currency) params.currency = currency;

    try {
      const { data } = await api.get<ProductsResponse>(
        `/product-general/organization/${business_id}`,
        { params },
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products',
      );
    }
  },
);

/**
 * Fetch a single public product by ID
 */
export const fetchPublicProduct = createAsyncThunk<
  { statusCode: number; data: Product },
  { product_id: string; currency?: string },
  { rejectValue: string }
>(
  'product/fetchPublicProduct',
  async (
    { product_id, currency }: { product_id: string; currency?: string },
    { rejectWithValue },
  ) => {
    const params: Record<string, any> = {};

    if (currency) params.currency = currency;

    try {
      const { data } = await api.get<{
        statusCode: number;
        data: Product;
      }>(`/product-general/public/${product_id}`, {
        params,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product',
      );
    }
  },
);

/**
 * Fetch paginated digital products
 */
export const fetchDigitalProducts = createAsyncThunk<
  { digital_products: DigitalProduct[]; count: number },
  {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  },
  { rejectValue: string }
>(
  'product/fetchDigitalProducts',
  async (
    { page, limit, q, startDate, endDate, business_id },
    { rejectWithValue },
  ) => {
    const params: Record<string, any> = {};
    if (page) params['pagination[page]'] = page;
    if (limit) params['pagination[limit]'] = limit;
    if (q) params.q = q;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.get<DigitalProductResponse>(
        '/product-digital-crud',
        { params, headers },
      );
      return { digital_products: data.data, count: data.count };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch digital products',
      );
    }
  },
);

/**
 * Fetch paginated physical products
 */
export const fetchPhysicalProducts = createAsyncThunk<
  { physical_products: PhysicalProduct[]; count: number },
  {
    page?: number;
    limit?: number;
    q?: string;
    startDate?: string;
    endDate?: string;
    business_id?: string;
  },
  { rejectValue: string }
>(
  'product/fetchPhysicalProducts',
  async (
    { page, limit, q, startDate, endDate, business_id },
    { rejectWithValue },
  ) => {
    const params: Record<string, any> = {};
    if (page) params['pagination[page]'] = page;
    if (limit) params['pagination[limit]'] = limit;
    if (q) params.q = q;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.get<PhysicalProductResponse>(
        '/product-physical-crud',
        { params, headers },
      );
      return { physical_products: data.data, count: data.count };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch physical products',
      );
    }
  },
);

/**
 * Create product category
 */
export const createProductCategory = createAsyncThunk<
  any,
  {
    credentials: {
      name: string;
      description?: string;
      multimedia_id?: string;
      business_id: string;
    };
  },
  { rejectValue: string }
>(
  'product/createProductCategory',
  async (
    {
      credentials,
    }: {
      credentials: {
        name: string;
        description?: string;
        multimedia_id?: string;
        business_id: string;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post<any>(
        `/product-category/create`,
        credentials,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product category',
      );
    }
  },
);

/**
 * Edit product category
 */
export const editProductCategory = createAsyncThunk<
  any,
  {
    category_id: string;
    credentials: {
      name?: string;
      description?: string;
      multimedia_id?: string;
    };
  },
  { rejectValue: string }
>(
  'product/editProductCategory',
  async (
    {
      category_id,
      credentials,
    }: {
      category_id: string;
      credentials: {
        name?: string;
        description?: string;
        multimedia_id?: string;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch<any>(
        `/product-category/${category_id}`,
        credentials,
      );
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to edit product category',
      );
    }
  },
);

export const fetchProductCategoryById = createAsyncThunk<
  { statusCode: number; data: CategoryWithCreator },
  { category_id: string; business_id?: string },
  { rejectValue: string }
>(
  'product/fetchProductCategoryById',
  async (
    { category_id, business_id }: { category_id: string; business_id?: string },
    { rejectWithValue },
  ) => {
    const headers: Record<string, string> = {};
    if (business_id) headers['Business-Id'] = business_id;

    try {
      const { data } = await api.get<{
        statusCode: number;
        data: CategoryWithCreator;
      }>(`/product-category/${category_id}`, {
        headers,
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product category',
      );
    }
  },
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchProductsByOrganization
      .addCase(fetchProductsByOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByOrganization.fulfilled,
        (state, action: PayloadAction<ProductsResponse>) => {
          state.loading = false;
          state.products = action.payload.data;
          state.count = action.payload.count;
        },
      )
      .addCase(fetchProductsByOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching products';
      })

      // fetchPublicProduct
      .addCase(fetchPublicProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPublicProduct.fulfilled,
        (
          state,
          action: PayloadAction<{ statusCode: number; data: Product }>,
        ) => {
          state.loading = false;
          state.product = action.payload.data;
        },
      )
      .addCase(fetchPublicProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching product';
      })

      // fetchDigitalProducts
      .addCase(fetchDigitalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDigitalProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            digital_products: DigitalProduct[];
            count: number;
          }>,
        ) => {
          state.loading = false;
          state.digital_products = action.payload.digital_products;
          state.digital_products_count = action.payload.count;
        },
      )
      .addCase(fetchDigitalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching digital products';
      })

      // fetchPhysicalProducts
      .addCase(fetchPhysicalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPhysicalProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            physical_products: PhysicalProduct[];
            count: number;
          }>,
        ) => {
          state.loading = false;
          state.physical_products = action.payload.physical_products;
          state.physical_products_count = action.payload.count;
        },
      )
      .addCase(fetchPhysicalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching physical products';
      })
      .addCase(createProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can push the new category to a categories array if maintained
      })
      .addCase(createProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating product category';
      })
      .addCase(editProductCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProductCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can update the category in a categories array if maintained
      })
      .addCase(editProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error editing product category';
      })
      .addCase(fetchProductCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductCategoryById.fulfilled,
        (
          state,
          action: PayloadAction<{
            statusCode: number;
            data: CategoryWithCreator;
          }>,
        ) => {
          state.loading = false;
          state.category = action.payload.data;
          // Optionally, you can set the fetched category to a state property if maintained
        },
      )
      .addCase(fetchProductCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching product category';
      });
  },
});

export default productSlice.reducer;
