import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Se requieren items válidos para crear un checkout" },
        { status: 400 }
      );
    }

    // Obtener las variables de entorno
    const userId = process.env.TIENDANUBE_USER_ID;
    const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;

    if (!userId || !accessToken) {
      console.error("Faltan variables de entorno: TIENDANUBE_USER_ID o TIENDANUBE_ACCESS_TOKEN");
      return NextResponse.json(
        { error: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    const apiUrl = `https://api.tiendanube.com/v1/${userId}/orders`;

    const orderData = {
      gateway: "offline", // Método de pago offline por defecto
      payment_status: "pending",
      status: "open",
      shipping_pickup_type: "ship",
      shipping: "not-provided",
      shipping_option: "Envío estándar",
      shipping_cost_customer: "0.00",
      products: items.map((item: any) => ({
        variant_id: item.id, // This is now the actual variant ID
        quantity: item.quantity,
        price: item.price
      })),
      customer: {
        name: "Cliente",
        email: "cliente@ejemplo.com",
        phone: "+54 11 1234-5678"
      },
      billing_address: {
        first_name: "Cliente",
        last_name: "Apellido",
        address: "Dirección",
        number: "123",
        city: "Ciudad",
        province: "Provincia",
        zipcode: "1234",
        country: "AR"
      },
      shipping_address: {
        first_name: "Cliente",
        last_name: "Apellido", 
        address: "Dirección",
        number: "123",
        city: "Ciudad",
        province: "Provincia",
        zipcode: "1234",
        country: "AR"
      }
    };

    console.log("Creando orden en TiendaNube:", {
      url: apiUrl,
      userId: userId,
      tokenLength: accessToken?.length,
      itemsCount: items.length
    });

    // Crear la orden en TiendaNube
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authentication": `bearer ${accessToken}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al crear la orden en TiendaNube:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return NextResponse.json(
        { 
          error: "Error al crear el checkout",
          details: `Status: ${response.status}, Error: ${errorText}`
        },
        { status: response.status }
      );
    }

    const orderData_response = await response.json();
    console.log("Orden creada exitosamente:", orderData_response);
    
    const checkoutUrl = `https://${userId}.mitiendanube.com/checkout/v3/start/${orderData_response.id}/${orderData_response.token}`;

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Error al procesar el checkout:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el checkout" },
      { status: 500 }
    );
  }
}
