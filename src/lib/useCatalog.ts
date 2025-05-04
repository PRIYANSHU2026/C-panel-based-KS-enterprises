import { useState, useEffect } from 'react';
import type { Product } from './types';
import { products as fallbackProducts } from './data';

interface UseCatalogOptions {
  fallbackToLocal?: boolean;
  category?: string;
  subcategory?: string;
  id?: string;
}

interface UseCatalogResult {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// This is the base API URL - update this to match your cPanel hosting domain
const API_BASE_URL = '/api';

export function useCatalog(options: UseCatalogOptions = {}): UseCatalogResult {
  const { fallbackToLocal = true, category, subcategory, id } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey(prevKey => prevKey + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let apiUrl = `${API_BASE_URL}/get-catalog.php`;
        const params = new URLSearchParams();

        if (id) {
          params.append('id', id);
        } else if (category) {
          params.append('category', category);
        } else if (subcategory) {
          params.append('subcategory', subcategory);
        }

        // Add params to URL if they exist
        if (params.toString()) {
          apiUrl += `?${params.toString()}`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          if (id && data.product) {
            if (isMounted) setProduct(data.product);
          } else if (data.products) {
            if (isMounted) setProducts(data.products);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch catalog data');
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);

        if (fallbackToLocal) {
          if (id) {
            const foundProduct = fallbackProducts.find(p => p.id === id) || null;
            if (isMounted) setProduct(foundProduct);
          } else if (category) {
            const filteredProducts = fallbackProducts.filter(p => p.category === category);
            if (isMounted) setProducts(filteredProducts);
          } else if (subcategory) {
            const filteredProducts = fallbackProducts.filter(p => p.subcategory === subcategory);
            if (isMounted) setProducts(filteredProducts);
          } else {
            if (isMounted) setProducts(fallbackProducts);
          }
        } else {
          if (isMounted) setError((err as Error).message || 'Failed to fetch catalog data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fallbackToLocal, category, subcategory, id, refreshKey]);

  return { products, product, loading, error, refetch };
}

export default useCatalog;
