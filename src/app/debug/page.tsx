'use client'
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

type AdminPayload = {
  adminLogadoId: string;
  adminLogadoNome: string;
  adminLogadoNivel: number;
};

type DebugInfo = {
  allCookies?: string;
  admin_logado_id?: string;
  admin_logado_nome?: string;
  admin_logado_token?: string;
  tokenDecoded?: AdminPayload;
  tokenDecodeError?: Error;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({})

  useEffect(() => {
    const info: DebugInfo = {}
    
    // Pegar todos os cookies
    const allCookies = document.cookie
    info.allCookies = allCookies
    
    // Pegar cookies específicos
    info.admin_logado_id = Cookies.get("admin_logado_id")
    info.admin_logado_nome = Cookies.get("admin_logado_nome")
    info.admin_logado_token = Cookies.get("admin_logado_token")
    
    // Tentar decodificar o token
    if (info.admin_logado_token) {
      try {
        const decoded = jwtDecode<AdminPayload>(info.admin_logado_token)
        info.tokenDecoded = decoded
      } catch (error) {
        info.tokenDecodeError = error instanceof Error ? error : new Error('Erro desconhecido')
      }
    }
    
    setDebugInfo(info)
  }, [])

  async function testarLogin() {
    try {
      console.log("Testando login...")
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/admins`, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
          email: "admin@teste.com", // Substitua por um email válido
          senha: "123456" // Substitua por uma senha válida
        })
      })
      
      console.log("Status:", response.status)
      
      if (response.status === 200) {
        const admin = await response.json()
        console.log("Resposta do login:", admin)
        
        // Salvar cookies
        Cookies.set("admin_logado_id", admin.id)
        Cookies.set("admin_logado_nome", admin.nome)
        Cookies.set("admin_logado_token", admin.token)
        
        // Atualizar debug info
        window.location.reload()
      } else {
        const errorText = await response.text()
        console.error("Erro:", response.status, errorText)
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
    }
  }

  async function simularLogin() {
    // Simular um login bem-sucedido com dados fictícios
    const adminSimulado = {
      id: "1",
      nome: "Admin Teste",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbkxvZ2Fkb0lkIjoiMSIsImFkbWluTG9nYWRvTm9tZSI6IkFkbWluIFRlc3RlIiwiYWRtaW5Mb2dhZG9OaXZlbCI6MX0.dummy_token"
    }
    
    console.log("Simulando login com:", adminSimulado)
    
    // Limpar cookies existentes
    Cookies.remove("admin_logado_id")
    Cookies.remove("admin_logado_nome")
    Cookies.remove("admin_logado_token")
    
    // Salvar novos cookies
    Cookies.set("admin_logado_id", adminSimulado.id)
    Cookies.set("admin_logado_nome", adminSimulado.nome)
    Cookies.set("admin_logado_token", adminSimulado.token)
    
    console.log("Cookies salvos, recarregando...")
    window.location.reload()
  }

  function limparCookies() {
    Cookies.remove("admin_logado_id")
    Cookies.remove("admin_logado_nome")
    Cookies.remove("admin_logado_token")
    console.log("Cookies limpos")
    window.location.reload()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Debug - Informações do Admin</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Todos os Cookies</h2>
          <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
            {debugInfo.allCookies || "Nenhum cookie encontrado"}
          </pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Cookies Específicos</h2>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded border">
              <strong>admin_logado_id:</strong> {debugInfo.admin_logado_id || "Não encontrado"}
            </div>
            <div className="bg-white p-3 rounded border">
              <strong>admin_logado_nome:</strong> {debugInfo.admin_logado_nome || "Não encontrado"}
            </div>
            <div className="bg-white p-3 rounded border">
              <strong>admin_logado_token:</strong> {debugInfo.admin_logado_token ? "Existe" : "Não encontrado"}
            </div>
          </div>
        </div>
        
        {debugInfo.admin_logado_token && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Token Decodificado</h2>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
              {debugInfo.tokenDecoded ? 
                JSON.stringify(debugInfo.tokenDecoded, null, 2) : 
                "Erro ao decodificar"}
            </pre>
            {debugInfo.tokenDecodeError && (
              <div className="mt-2 text-red-600">
                <strong>Erro:</strong> {debugInfo.tokenDecodeError.message}
              </div>
            )}
          </div>
        )}
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Teste de Login</h2>
          <div className="space-x-4">
            <button 
              onClick={testarLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Testar Login Real
            </button>
            <button 
              onClick={simularLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Simular Login
            </button>
            <button 
              onClick={limparCookies}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Limpar Cookies
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Certifique-se de ajustar email e senha no código antes de testar o login real
          </p>
        </div>
      </div>
    </div>
  )
}
