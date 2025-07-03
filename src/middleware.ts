import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se é uma rota que precisa de autenticação
  if (request.nextUrl.pathname.startsWith('/principal')) {
    const token = request.cookies.get('admin_logado_token')
    const nome = request.cookies.get('admin_logado_nome')
    
    console.log('Middleware - Token:', token ? 'Presente' : 'Ausente')
    console.log('Middleware - Nome:', nome?.value || 'Não encontrado')
    
    if (!token) {
      console.log('Middleware - Redirecionando para login (sem token)')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (!nome || nome.value === 'undefined' || nome.value === '') {
      console.log('Middleware - Nome inválido:', nome?.value)
      // Não redirecionar, mas logar o problema
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/principal/:path*'
}
