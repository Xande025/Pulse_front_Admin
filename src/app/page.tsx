"use client"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

import Cookies from 'js-cookie'

type Inputs = {
  email: string
  senha: string
}

export default function Home() {
  const { register, handleSubmit, setFocus } = useForm<Inputs>()
  const router = useRouter()

  useEffect(() => {
    setFocus("email")
  }, [])

  async function verificaLogin(data: Inputs) {
    console.log("Tentando fazer login com:", data)
    
    // Tentar diferentes rotas de login possíveis (baseado na estrutura do router)
    const rotasLogin = [
      '/admins',      // Router registrado em /admins (mais provável)
      '/admin',       // Router registrado em /admin
      '/admins/login',
      '/admin/login', 
      '/auth/login',
      '/auth',
      '/usuarios/login',
      '/login'
    ]
    
    for (const rota of rotasLogin) {
      try {
        console.log("Testando rota:", `${process.env.NEXT_PUBLIC_URL_API}${rota}`)
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}${rota}`, {
          method: "POST",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify({email: data.email, senha: data.senha})
        })

        console.log(`Status da resposta para ${rota}:`, response.status)
        
        if (response.status === 200) {
          const responseData = await response.json()
          console.log("Login bem-sucedido:", responseData)
          
          // Extrair dados corretamente da resposta
          const adminData = responseData.admin
          const token = responseData.token
          
          console.log("Dados do admin:", {
            id: adminData?.id,
            nome: adminData?.nome,
            token: token ? "Token presente" : "Token ausente"
          })

          // Verificar se os dados estão corretos
          if (!adminData?.id) {
            console.log("AVISO: ID do admin não encontrado na resposta")
          }
          if (!adminData?.nome) {
            console.log("AVISO: Nome do admin não encontrado na resposta")
          }
          if (!token) {
            console.log("AVISO: Token não encontrado na resposta")
          }

          // Função para salvar cookies de forma segura
          const salvarCookieSeguro = (nome: string, valor: unknown) => {
            if (valor && valor !== 'undefined' && valor !== 'null' && valor.toString().trim() !== '') {
              Cookies.set(nome, valor.toString())
              console.log(`Cookie ${nome} salvo com valor:`, valor)
            } else {
              console.log(`AVISO: Tentativa de salvar cookie ${nome} com valor inválido:`, valor)
            }
          }

          // Salvar cookies apenas se os valores forem válidos
          salvarCookieSeguro("admin_logado_id", adminData?.id)
          salvarCookieSeguro("admin_logado_nome", adminData?.nome)
          salvarCookieSeguro("admin_logado_token", token)

          // Verificar se os cookies foram salvos corretamente
          setTimeout(() => {
            console.log("Verificando cookies após salvar:")
            const cookieId = Cookies.get("admin_logado_id")
            const cookieNome = Cookies.get("admin_logado_nome")
            const cookieToken = Cookies.get("admin_logado_token")
            
            console.log("ID salvo:", cookieId)
            console.log("Nome salvo:", cookieNome)
            console.log("Token salvo:", cookieToken ? "Presente" : "Ausente")
            
            // Verificar se pelo menos o token foi salvo
            if (!cookieToken) {
              console.log("AVISO CRÍTICO: Token não foi salvo. Login pode não funcionar corretamente.")
              toast.error("Erro interno: Token não foi salvo. Tente novamente.")
              return
            }
            
            // Se não temos nome, tentar extrair do token
            if (!cookieNome && cookieToken) {
              try {
                const decoded = JSON.parse(atob(cookieToken.split('.')[1]))
                console.log("Payload do token:", decoded)
                
                if (decoded.adminLogadoNome) {
                  Cookies.set("admin_logado_nome", decoded.adminLogadoNome)
                  console.log("Nome extraído do token e salvo:", decoded.adminLogadoNome)
                } else {
                  console.log("Nome não encontrado no payload do token")
                }
              } catch (e) {
                console.log("Erro ao decodificar token:", e)
              }
            }
          }, 100)

          router.push("/principal")
          return
        } else if (response.status === 400 || response.status === 401) {
          toast.error("Erro... Login ou senha incorretos")
          return
        } else if (response.status !== 404) {
          // Se não é 404, é uma rota válida mas com outro erro
          const errorText = await response.text()
          console.log("Erro na API:", response.status, errorText)
          toast.error(`Erro na API: ${response.status}`)
          return
        }
        // Se é 404, continua testando outras rotas
      } catch (error) {
        console.log(`Erro ao testar rota ${rota}:`, error)
      }
    }
    
    // Se chegou aqui, nenhuma rota funcionou
    toast.error("Nenhuma rota de login encontrada. Verifique se a API está configurada corretamente.")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#374151] via-[#4B5563] to-[#6B7280] flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Eletron Pulse" className="h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-[#845bdf]">Eletron</span> <span className="text-[#5ce1e6]">Pulse</span>
          </h1>
          <p className="text-gray-600 mt-2">Painel Administrativo</p>
        </div>
        
        <form onSubmit={handleSubmit(verificaLogin)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#845bdf] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Digite seu e-mail"
              {...register("email")}
              required 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#845bdf] focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="Digite sua senha"
              {...register("senha")}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#845bdf] to-[#6b46c1] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#6b46c1] hover:to-[#553c9a] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Entrar no Sistema
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Sistema de Administração - Eletron Pulse
          </p>
        </div>
      </div>
    </main>
  );
}
