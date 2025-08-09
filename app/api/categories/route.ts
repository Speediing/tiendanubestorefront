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
    console.log("=== CATEGORIES API DEBUG START ===")
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

    const apiUrl = `${API_CONFIG.base_url}/${API_CONFIG.user_id}/categories?page=${page}&per_page=${per_page}`
    const headers = {
      "Authentication": `bearer ${API_CONFIG.access_token}`,
      "Content-Type": "application/json",
      "User-Agent": "TiendaNube Storefront (storefront@example.com)",
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
      
      console.log("=== CATEGORIES API DEBUG END ===")
      return NextResponse.json(debugInfo, { status: response.status })
    }

    const data = await response.json()
    
    console.log("Categories API success - data type:", typeof data)
    console.log("Categories API success - is array:", Array.isArray(data))
    console.log("Categories API success - data keys:", Object.keys(data))
    console.log("Categories count:", Array.isArray(data) ? data.length : (data.categories?.length || 0))
    
    // Si la respuesta tiene una estructura anidada, extraer el array de categorías
    let categories = Array.isArray(data) ? data : (data.categories || data.results || [])
    
    // Agregar logs para ver la estructura de cada categoría y obtener productos para calcular el contador
    console.log("Sample category structure:", categories[0])
    
    // Obtener productos para calcular el contador de productos por categoría
    try {
      const productsUrl = `${API_CONFIG.base_url}/${API_CONFIG.user_id}/products?per_page=200`
      const productsResponse = await fetch(productsUrl, { headers })
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        const products = Array.isArray(productsData) ? productsData : (productsData.products || productsData.results || [])
        
        console.log("Products fetched for counting:", products.length)
        
        // Calcular el contador de productos para cada categoría
        categories = categories.map(category => {
          const categoryProducts = products.filter(product => {
            // Verificar si el producto pertenece a esta categoría
            if (product.category_id === category.id) return true
            if (product.categories && Array.isArray(product.categories)) {
              return product.categories.some(cat => cat.id === category.id || cat === category.id)
            }
            if (product.categories && product.categories.includes(category.id)) return true
            return false
          })
          
          const productsCount = categoryProducts.length
          console.log(`Category "${category.name}" has ${productsCount} products`)
          
          return {
            ...category,
            products_count: productsCount
          }
        })
      } else {
        console.log("Could not fetch products for counting, using original products_count")
      }
    } catch (error) {
      console.log("Error fetching products for counting:", error.message)
    }
    
    console.log("=== CATEGORIES API DEBUG END ===")
    return NextResponse.json(categories)
  } catch (error) {
    console.error("=== CATEGORIES API ERROR ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.log("=== CATEGORIES API DEBUG END ===")
    
    return NextResponse.json({ 
      error: "Failed to fetch categories from TiendaNube API", 
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
