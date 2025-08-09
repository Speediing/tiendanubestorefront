export async function GET() {
  const userId = process.env.TIENDANUBE_USER_ID;
  const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN;
  
  // Información segura para debugging (no muestra el token completo)
  const debugInfo = {
    environment: process.env.NODE_ENV,
    userId: userId || 'No configurado',
    tokenConfigured: accessToken ? 'Configurado (primeros 4 caracteres: ' + accessToken.substring(0, 4) + '...)' : 'No configurado',
    tokenLength: accessToken ? accessToken.length : 0,
    vercelEnv: process.env.VERCEL_ENV || 'No disponible',
    allTiendaEnvKeys: Object.keys(process.env).filter(key => key.includes('TIENDA')),
    timestamp: new Date().toISOString()
  };
  
  return Response.json(debugInfo);
}
