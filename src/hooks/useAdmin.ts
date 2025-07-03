import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

type AdminPayload = {
  id: string;
  nome: string;
  email: string;
  nivel: number;
  // Campos alternativos caso o backend use formato diferente
  adminLogadoId?: string;
  adminLogadoNome?: string;
  adminLogadoNivel?: number;
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
            
            // Tentar extrair nome usando diferentes possíveis campos
            const nomeExtraido = decoded.nome || decoded.adminLogadoNome
            const idExtraido = decoded.id || decoded.adminLogadoId
            
            if (nomeExtraido && nomeExtraido !== 'undefined') {
              setAdminNome(nomeExtraido)
              setAdminId(idExtraido || "")
              
              // Atualizar cookie com o nome do token
              Cookies.set("admin_logado_nome", nomeExtraido)
              if (idExtraido) {
                Cookies.set("admin_logado_id", idExtraido)
              }
              
              console.log("Dados carregados do token e cookies atualizados")
            } else {
              console.log("Nome não encontrado no token")
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
            const nomeExtraido = decoded.nome || decoded.adminLogadoNome
            const idExtraido = decoded.id || decoded.adminLogadoId
            
            if (nomeExtraido && nomeExtraido !== 'undefined') {
              setAdminNome(nomeExtraido)
              setAdminId(idExtraido || "")
              Cookies.set("admin_logado_nome", nomeExtraido)
              if (idExtraido) {
                Cookies.set("admin_logado_id", idExtraido)
              }
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
