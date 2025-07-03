import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

type AdminPayload = {
  adminLogadoId: string;
  adminLogadoNome: string;
  adminLogadoNivel: number;
}

export function useAdmin() {
  const [adminNome, setAdminNome] = useState<string>("")
  const [adminId, setAdminId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAdminData = () => {
      try {
        console.log("=== useAdmin Hook ===")
        
        // Verificar todos os cookies
        const allCookies = document.cookie
        console.log("Todos os cookies:", allCookies)
        
        // Tentar pegar dados dos cookies
        const cookieId = Cookies.get("admin_logado_id")
        const cookieNome = Cookies.get("admin_logado_nome")
        const cookieToken = Cookies.get("admin_logado_token")
        
        console.log("Cookie ID:", cookieId)
        console.log("Cookie Nome:", cookieNome)
        console.log("Cookie Token:", cookieToken ? "Presente" : "Ausente")
        
        // Se tem nome válido no cookie, usar ele
        if (cookieNome && cookieNome !== 'undefined' && cookieNome !== '') {
          setAdminNome(cookieNome)
          setAdminId(cookieId || "")
          setIsLoading(false)
          console.log("Dados carregados do cookie")
          return
        }
        
        // Se não tem nome válido no cookie, tentar do token
        if (cookieToken && cookieToken !== 'undefined') {
          try {
            const decoded = jwtDecode<AdminPayload>(cookieToken)
            console.log("Token decodificado:", decoded)
            
            if (decoded.adminLogadoNome && decoded.adminLogadoNome !== 'undefined') {
              setAdminNome(decoded.adminLogadoNome)
              setAdminId(decoded.adminLogadoId || "")
              
              // Atualizar cookie com o nome do token
              Cookies.set("admin_logado_nome", decoded.adminLogadoNome)
              Cookies.set("admin_logado_id", decoded.adminLogadoId)
              
              console.log("Dados carregados do token e cookies atualizados")
            } else {
              console.error("Nome não encontrado no token")
              setError("Nome do admin não encontrado no token")
              setAdminNome("Admin")
            }
          } catch (tokenError) {
            console.error("Erro ao decodificar token:", tokenError)
            setError("Token inválido")
            setAdminNome("Admin")
          }
        } else {
          console.error("Nenhum token encontrado")
          setError("Token não encontrado")
          setAdminNome("Admin")
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error("Erro no useAdmin:", err)
        setError("Erro ao carregar dados do admin")
        setAdminNome("Admin")
        setIsLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const refreshAdminData = () => {
    setIsLoading(true)
    setError(null)
    // Recarregar dados
    const loadAdminData = () => {
      try {
        const cookieId = Cookies.get("admin_logado_id")
        const cookieNome = Cookies.get("admin_logado_nome")
        const cookieToken = Cookies.get("admin_logado_token")
        
        if (cookieNome && cookieNome !== 'undefined' && cookieNome !== '') {
          setAdminNome(cookieNome)
          setAdminId(cookieId || "")
        } else if (cookieToken && cookieToken !== 'undefined') {
          try {
            const decoded = jwtDecode<AdminPayload>(cookieToken)
            if (decoded.adminLogadoNome && decoded.adminLogadoNome !== 'undefined') {
              setAdminNome(decoded.adminLogadoNome)
              setAdminId(decoded.adminLogadoId || "")
              Cookies.set("admin_logado_nome", decoded.adminLogadoNome)
              Cookies.set("admin_logado_id", decoded.adminLogadoId)
            } else {
              setAdminNome("Admin")
            }
          } catch {
            setAdminNome("Admin")
          }
        } else {
          setAdminNome("Admin")
        }
        
        setIsLoading(false)
      } catch {
        setError("Erro ao recarregar dados")
        setAdminNome("Admin")
        setIsLoading(false)
      }
    }

    loadAdminData()
  }

  return {
    adminNome,
    adminId,
    isLoading,
    error,
    refreshAdminData
  }
}
