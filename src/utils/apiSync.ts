/**
 * Centralized API & Database Sync Service
 * Ensures ALL settings, products, categories, orders, and options
 * are PERMANENTLY saved to the server MySQL database / file backend,
 * so clearing browser cache or changing devices NEVER loses data.
 */

// 1. Settings
export const fetchSettingsFromDatabase = async () => {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.settings) {
        return data.settings;
      }
    }
  } catch (e) {
    // offline or static fallback
  }
  return null;
};

export const saveSettingsToDatabase = async (settings: any) => {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync settings with server database', e);
    return false;
  }
};

// 2. Products
export const fetchProductsFromDatabase = async () => {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        return data.products;
      }
    }
  } catch (e) {}
  return null;
};

export const saveSingleProductToDatabase = async (product: any) => {
  try {
    const res = await fetch('/api/products/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to save single product to server database', e);
    return false;
  }
};

export const saveProductsToDatabase = async (products: any[]) => {
  try {
    const res = await fetch('/api/products/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync products with server database', e);
    return false;
  }
};

export const deleteProductFromDatabase = async (id: string) => {
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error('Failed to delete product from server database', e);
    return false;
  }
};

// 3. Categories
export const fetchCategoriesFromDatabase = async () => {
  try {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        return data.categories;
      }
    }
  } catch (e) {}
  return null;
};

export const saveCategoriesToDatabase = async (categories: any[]) => {
  try {
    const res = await fetch('/api/categories/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync categories with server database', e);
    return false;
  }
};

export const deleteCategoryFromDatabase = async (id: string) => {
  try {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error('Failed to delete category from server database', e);
    return false;
  }
};

// 4. Brands
export const fetchBrandsFromDatabase = async () => {
  try {
    const res = await fetch('/api/brands');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.brands)) {
        return data.brands;
      }
    }
  } catch (e) {}
  return null;
};

export const saveBrandsToDatabase = async (brands: any[]) => {
  try {
    const res = await fetch('/api/brands/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brands }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync brands with server database', e);
    return false;
  }
};

export const deleteBrandFromDatabase = async (id: string) => {
  try {
    const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error('Failed to delete brand from server database', e);
    return false;
  }
};

// 5. Orders
export const fetchOrdersFromDatabase = async () => {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        return data.orders;
      }
    }
  } catch (e) {}
  return null;
};

export const saveOrdersToDatabase = async (orders: any[]) => {
  try {
    const res = await fetch('/api/orders/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orders }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync orders with server database', e);
    return false;
  }
};

// 6. Order Settings
export const fetchOrderSettingsFromDatabase = async () => {
  try {
    const res = await fetch('/api/order-settings');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.settings) {
        return data.settings;
      }
    }
  } catch (e) {}
  return null;
};

export const saveOrderSettingsToDatabase = async (settings: any) => {
  try {
    const res = await fetch('/api/order-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync order settings with server database', e);
    return false;
  }
};

// 7. Custom Pages
export const fetchCustomPagesFromDatabase = async () => {
  try {
    const res = await fetch('/api/custom-pages');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.pages) && data.pages.length > 0) {
        return data.pages;
      }
    }
  } catch (e) {}
  return null;
};

export const saveCustomPagesToDatabase = async (pages: any[]) => {
  try {
    const res = await fetch('/api/custom-pages/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pages }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync custom pages with server database', e);
    return false;
  }
};

// 8. Courier & Delivery Settings
export const fetchCourierSettingsFromDatabase = async () => {
  try {
    const res = await fetch('/api/order-settings');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.settings && data.settings.courierSettings) {
        return data.settings.courierSettings;
      }
    }
  } catch (e) {}
  return null;
};

export const saveCourierSettingsToDatabase = async (courierSettings: any) => {
  try {
    const res = await fetch('/api/order-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courierSettings }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to sync courier settings with server database', e);
    return false;
  }
};

