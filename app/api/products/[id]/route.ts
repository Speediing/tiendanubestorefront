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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("=== SINGLE PRODUCT API DEBUG START ===")
    console.log("Product ID:", params.id)
    
    validateConfig()
    
    const apiUrl = `${API_CONFIG.base_url}/${API_CONFIG.user_id}/products/${params.id}`
    
    const headers = {
      Authentication: `bearer ${API_CONFIG.access_token}`,
      "User-Agent": "TiendaNube Storefront (storefront@example.com)",
      "Content-Type": "application/json",
    }

    console.log("API URL:", apiUrl)

    const response = await fetch(apiUrl, { headers })

    console.log("Response status:", response.status)

    if (!response.ok) {
      console.error(`TiendaNube API error: ${response.status} ${response.statusText}`)
      const responseText = await response.text();
      console.error("Error response body:", responseText);
      
      return NextResponse.json({ 
        error: `Product not found: ${response.status} ${response.statusText}`,
        details: responseText
      }, { status: response.status })
    }

    const product = await response.json()
    
    console.log("Single product API success - product ID:", product.id)
    console.log("=== SINGLE PRODUCT API DEBUG END ===")
    
    return NextResponse.json(product)
  } catch (error) {
    console.error("=== SINGLE PRODUCT API ERROR ===")
    console.error("Error message:", error.message)
    console.log("=== SINGLE PRODUCT API DEBUG END ===")
    
    return NextResponse.json({ 
      error: "Failed to fetch product from TiendaNube API", 
      details: error.message
    }, { status: 500 })
  }
}
