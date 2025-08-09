import Storefront from "@/components/storefront"

interface Product {
  id: number
  name: { [key: string]: string } | string
  price: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  variants: Array<{
    id: number
    price: string
  }>
  categories?: number[]
}

interface Category {
  id: number
  name: { [key: string]: string } | string
  handle: string
  parent?: number
  subcategories?: Category[]
  products_count?: number
}

interface StoreInfo {
  name: { [key: string]: string } | string
  description?: { [key: string]: string } | string
  country?: string
  logo?: string
}

function getBaseUrl() {
  return "";  // Usar rutas relativas en lugar de absolutas
}

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = `/api/products`;
    
    console.log("Fetching products from:", apiUrl);
    
    const response = await fetch(apiUrl, { 
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch products:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Products fetched successfully:", Array.isArray(data) ? data.length : 0, "items");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const apiUrl = `/api/categories`;
    
    console.log("Fetching categories from:", apiUrl);
    
    const response = await fetch(apiUrl, { 
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Categories fetched successfully:", Array.isArray(data) ? data.length : 0, "items");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Home() {
  const { GET: getProductsApi } = await import("@/app/api/products/route");
  const { GET: getCategoriesApi } = await import("@/app/api/categories/route");
  const { GET: getStoreApi } = await import("@/app/api/store/route");
  
  const productsRequest = new Request("http://localhost:3000/api/products");
  const categoriesRequest = new Request("http://localhost:3000/api/categories");
  const storeRequest = new Request("http://localhost:3000/api/store");
  
  try {
    const productsResponse = await getProductsApi(productsRequest);
    const categoriesResponse = await getCategoriesApi(categoriesRequest);
    const storeResponse = await getStoreApi(storeRequest);
    
    const products = await productsResponse.json();
    const categories = await categoriesResponse.json();
    const storeInfo = await storeResponse.json();
    
    // Extraer el nombre de la tienda
    const storeName = typeof storeInfo.name === "string" 
      ? storeInfo.name 
      : storeInfo.name?.es || Object.values(storeInfo.name || {})[0] || "Mi Tienda";
    
    return <Storefront 
      initialProducts={products} 
      initialCategories={categories} 
      storeName={storeName}
    />;
  } catch (error) {
    console.error("Error loading data:", error);
    return <Storefront initialProducts={[]} initialCategories={[]} storeName="Mi Tienda" />;
  }
}
