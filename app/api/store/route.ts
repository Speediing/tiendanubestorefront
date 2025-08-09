import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[SERVER]=== STORE API DEBUG START ===');
    
    const userId = process.env.TIENDANUBE_USER_ID;
    const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;
    
    console.log('[SERVER]User ID:', userId);
    console.log('[SERVER]Access Token length:', accessToken?.length || 0);
    
    if (!userId || !accessToken) {
      console.log('[SERVER]Missing environment variables');
      return NextResponse.json(
        { error: 'Missing environment variables' },
        { status: 500 }
      );
    }
    
    const url = `https://api.tiendanube.com/v1/${userId}/store`;
    console.log('[SERVER]Fetching store from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'User-Agent': 'TiendaNubeTemplate (example@email.com)',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('[SERVER]Response status:', response.status);
    console.log('[SERVER]Response headers:', JSON.stringify(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('[SERVER]Error response:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch store: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('[SERVER]Store API success - data type:', typeof data);
    console.log('[SERVER]Store name:', data.name);
    console.log('[SERVER]=== STORE API DEBUG END ===');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[SERVER]Error fetching store:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}
