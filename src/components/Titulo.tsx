'use client'
import Cookies from "js-cookie"
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi"
import { jwtDecode } from "jwt-decode"

type AdminPayload = {
  adminLogadoId: string;
  adminLogadoNome: string;
  adminLogadoNivel: number;
};

export function Titulo() {
  const [adminNome, setAdminNome] = useState<string>("")

  useEffect(() => {
    console.log("=== DEBUG TITULO ===");
    
    // Verificar todos os cookies primeiro
    const allCookies = document.cookie;
    console.log("Todos os cookies:", allCookies);
    
    // Primeiro, tenta pegar o nome do cookie direto
    const nomeNoCookie = Cookies.get("admin_logado_nome");
    console.log("Nome no cookie (js-cookie):", nomeNoCookie);
    
    // Verificar se o cookie existe de forma manual
    const cookieValue = allCookies
      .split('; ')
      .find(row => row.startsWith('admin_logado_nome='))
      ?.split('=')[1];
    console.log("Nome no cookie (manual):", cookieValue);
    
    if (nomeNoCookie && nomeNoCookie !== 'undefined') {
      setAdminNome(nomeNoCookie);
      console.log("Nome definido via cookie:", nomeNoCookie);
      return;
    }
    
    // Se não tem no cookie, tenta pegar do token JWT
    const token = Cookies.get("admin_logado_token");
    console.log("Token encontrado:", token ? "SIM" : "NÃO");
    
    if (token) {
      console.log("Token completo:", token.substring(0, 50) + "...");
      try {
        const decoded = jwtDecode<AdminPayload>(token);
        console.log("Token decodificado:", decoded);
        console.log("Nome do admin no token:", decoded.adminLogadoNome);
        
        if (decoded.adminLogadoNome && decoded.adminLogadoNome !== 'undefined') {
          setAdminNome(decoded.adminLogadoNome);
          console.log("Nome definido via token:", decoded.adminLogadoNome);
        } else {
          console.log("ERRO: adminLogadoNome não encontrado no token!");
          setAdminNome("Admin");
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        setAdminNome("Admin");
      }
    } else {
      console.log("Nenhum token encontrado!");
      setAdminNome("Admin");
    }
    console.log("Estado final adminNome:", adminNome);
    console.log("=== FIM DEBUG ===");
  }, [])

  return (
    <nav className="bg-[#374151] border-gray-200 dark:bg-gray-900 flex flex-wrap justify-between fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="flex flex-wrap justify-between max-w-screen-xl p-4">
        <Link href="/principal" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo2.png" className="h-16" alt="Eletron Pulse" />
          <span className="self-center text-3xl font-semibold whitespace-nowrap text-white">
            <span className="text-[#845bdf]">Eletron</span> <span className="text-[#5ce1e6]">Pulse</span> <span className="text-gray-300">Admin</span>
          </span>
        </Link>
      </div>
      <div className="flex me-4 items-center font-bold text-white">
        <FiUsers className="mr-2 text-[#5ce1e6]" />
        <span className="text-[#5ce1e6]">
          {adminNome || "Admin"}
        </span>
      </div>
    </nav>
  )
}