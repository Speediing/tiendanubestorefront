import { type NextRequest, NextResponse } from "next/server"

const API_CONFIG = {
  access_token: process.env.TIENDANUBE_ACCESS_TOKEN,
  user_id: process.env.TIENDANUBE_USER_ID,
  base_url: "https://api.tiendanube.com/v1",
}

function validateConfig() {
  if (!API_CONFIG.access_token) {
    throw new Error("TIENDANUBE_ACCESS_TOKEN environment variable is required")
  }
  if (!API_CONFIG.user_id) {
    throw new Error("TIENDANUBE_USER_ID environment variable is required")
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("=== PRODUCTS API DEBUG START ===")
    console.log("Environment:", process.env.NODE_ENV)
    console.log("All env vars available:", Object.keys(process.env).filter(key => key.includes('TIENDA')))
    console.log("TIENDANUBE_ACCESS_TOKEN exists:", !!process.env.TIENDANUBE_ACCESS_TOKEN)
    console.log("TIENDANUBE_USER_ID exists:", !!process.env.TIENDANUBE_USER_ID)
    
    if (process.env.TIENDANUBE_ACCESS_TOKEN) {
      console.log("Token first 10 chars:", process.env.TIENDANUBE_ACCESS_TOKEN.substring(0, 10))
      console.log("Token last 10 chars:", process.env.TIENDANUBE_ACCESS_TOKEN.substring(-10))
    }
    
    validateConfig()
    
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"
    const per_page = searchParams.get("per_page") || "50"
    const category_id = searchParams.get("category_id")

    let apiUrl = `${API_CONFIG.base_url}/${API_CONFIG.user_id}/products?page=${page}&per_page=${per_page}`
    
    const headers = {
      Authentication: `bearer ${API_CONFIG.access_token}`,
      "User-Agent": "TiendaNube Storefront (storefront@example.com)",
      "Content-Type": "application/json",
    }

    console.log("API URL:", apiUrl)
    console.log("Headers being sent:", {
      ...headers,
      Authentication: `bearer ${headers.Authentication.substring(0, 20)}...`
    })

    const response = await fetch(apiUrl, { headers })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error(`TiendaNube API error: ${response.status} ${response.statusText}`)
      const responseText = await response.text();
      console.error("Error response body:", responseText);
      
      const debugInfo = {
        error: `API error: ${response.status} ${response.statusText}`,
        details: responseText,
        debugInfo: {
          environment: process.env.NODE_ENV,
          tokenConfigured: !!API_CONFIG.access_token,
          userIdConfigured: !!API_CONFIG.user_id,
          tokenLength: API_CONFIG.access_token?.length || 0,
          userId: API_CONFIG.user_id || 'No configurado',
          apiUrl: apiUrl,
          timestamp: new Date().toISOString(),
          vercelEnv: process.env.VERCEL_ENV || 'No disponible'
        }
      };
      
      if (response.status === 401) {
        console.error("401 UNAUTHORIZED - Possible causes:")
        console.error("1. Invalid or expired access token")
        console.error("2. Incorrect user_id")
        console.error("3. Token doesn't have required permissions")
        console.error("4. Incorrect authentication header format")
        
        debugInfo.debugInfo.possibleCauses = [
          "Invalid or expired access token",
          "Incorrect user_id",
          "Token doesn't have required permissions",
          "Incorrect authentication header format"
        ];
      }
      
      console.log("=== PRODUCTS API DEBUG END ===")
      return NextResponse.json(debugInfo, { status: response.status })
    }

    const data = await response.json()
    
    console.log("Products API success - data type:", typeof data)
    console.log("Products API success - is array:", Array.isArray(data))
    console.log("Products API success - data keys:", Object.keys(data))
    console.log("Products count:", Array.isArray(data) ? data.length : (data.products?.length || 0))
    
    // Si la respuesta tiene una estructura anidada, extraer el array de productos
    const products = Array.isArray(data) ? data : (data.products || data.results || [])
    
    const processedProducts = products.map(product => {
      console.log(`Product ${product.id} categories:`, product.categories)
      
      // TiendaNube puede devolver categorías en diferentes formatos
      let categories = [];
      
      if (product.categories && Array.isArray(product.categories)) {
        // Si categories es un array de objetos con id
        categories = product.categories.map(cat => 
          typeof cat === 'object' && cat.id ? cat.id : cat
        );
      } else if (product.category_id) {
        // Si solo tiene category_id
        categories = [product.category_id];
      } else if (product.category && product.category.id) {
        // Si tiene un objeto category con id
        categories = [product.category.id];
      }
      
      console.log(`Product ${product.id} processed categories:`, categories)
      
      return {
        ...product,
        categories: categories
      };
    });
    
    let filteredProducts = processedProducts;
    if (category_id) {
      const categoryIdNum = parseInt(category_id);
      filteredProducts = processedProducts.filter(product => 
        product.categories && product.categories.includes(categoryIdNum)
      );
      console.log(`Filtered products for category ${category_id}:`, filteredProducts.length);
    }
    
    console.log("=== PRODUCTS API DEBUG END ===")
    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error("=== PRODUCTS API ERROR ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.log("=== PRODUCTS API DEBUG END ===")
    
    return NextResponse.json({ 
      error: "Failed to fetch products from TiendaNube API", 
      details: error.message,
      debugInfo: {
        errorType: error.constructor.name,
        tokenConfigured: !!process.env.TIENDANUBE_ACCESS_TOKEN,
        userIdConfigured: !!process.env.TIENDANUBE_USER_ID,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}
