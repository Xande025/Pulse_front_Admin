'use client'
import { useEffect, useState } from "react"
import { ClienteI } from "@/utils/types/clientes"
import Cookies from "js-cookie"

export default function Clientes() {
  const [clientes, setClientes] = useState<ClienteI[]>([])
  const [clienteEditando, setClienteEditando] = useState<ClienteI | null>(null)
  const [nomeEdicao, setNomeEdicao] = useState("")
  const [emailEdicao, setEmailEdicao] = useState("")

  useEffect(() => {
    async function getClientes() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`)
        const dados = await response.json()
        setClientes(dados)
      } catch (error) {
        console.error("Erro ao buscar clientes:", error)
      }
    }
    getClientes()
  }, [])

  async function excluirCliente(id: string, nome: string) {
    if (confirm(`Confirma a exclusão do cliente ${nome}?`)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${id}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
          }
        })

        if (response.status === 200) {
          const clientesAtualizados = clientes.filter(cliente => cliente.id !== id)
          setClientes(clientesAtualizados)
          alert("Cliente excluído com sucesso!")
        } else {
          const errorText = await response.text()
          console.error("Erro ao excluir:", response.status, errorText)
          alert(`Erro ao excluir cliente: ${response.status}`)
        }
      } catch (error) {
        console.error("Erro na requisição:", error)
        alert("Erro de conexão ao excluir cliente")
      }
    }
  }

  function iniciarEdicao(cliente: ClienteI) {
    setClienteEditando(cliente)
    setNomeEdicao(cliente.nome)
    setEmailEdicao(cliente.email)
  }

  function cancelarEdicao() {
    setClienteEditando(null)
    setNomeEdicao("")
    setEmailEdicao("")
  }

  async function salvarEdicao() {
    if (!clienteEditando) return

    if (!nomeEdicao.trim() || !emailEdicao.trim()) {
      alert("Nome e email são obrigatórios!")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${clienteEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
        body: JSON.stringify({
          nome: nomeEdicao.trim(),
          email: emailEdicao.trim()
        })
      })

      if (response.status === 200) {
        const clientesAtualizados = clientes.map(cliente => 
          cliente.id === clienteEditando.id 
            ? { ...cliente, nome: nomeEdicao.trim(), email: emailEdicao.trim() }
            : cliente
        )
        setClientes(clientesAtualizados)
        cancelarEdicao()
        alert("Cliente atualizado com sucesso!")
      } else {
        const errorText = await response.text()
        console.error("Erro ao editar:", response.status, errorText)
        alert(`Erro ao editar cliente: ${response.status}`)
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      alert("Erro de conexão ao editar cliente")
    }
  }

  return (
    <div className="m-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-[#845bdf]">Controle de Clientes</span>
        </h1>
        <p className="text-gray-600 mt-2">Gerencie os clientes da loja Eletron Pulse</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#845bdf] to-[#6b46c1] px-6 py-4">
          <h2 className="text-xl font-bold text-white">Clientes Cadastrados</h2>
          {clienteEditando && (
            <p className="text-sm text-white opacity-90 mt-1">
              Editando cliente: {clienteEditando.nome}
            </p>
          )}
        </div>
        
        <div className="p-6">
          {clientes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">Nenhum cliente encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente, index) => (
                    <tr key={cliente.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {cliente.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clienteEditando?.id === cliente.id ? (
                          <input
                            type="text"
                            value={nomeEdicao}
                            onChange={(e) => setNomeEdicao(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#845bdf]"
                          />
                        ) : (
                          cliente.nome
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {clienteEditando?.id === cliente.id ? (
                          <input
                            type="email"
                            value={emailEdicao}
                            onChange={(e) => setEmailEdicao(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#845bdf]"
                          />
                        ) : (
                          cliente.email
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {clienteEditando?.id === cliente.id ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={salvarEdicao}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                            >
                              Salvar
                            </button>
                            <button 
                              onClick={cancelarEdicao}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => iniciarEdicao(cliente)}
                              className="text-[#845bdf] hover:text-[#6b46c1] transition-colors"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => excluirCliente(cliente.id, cliente.nome)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas de Clientes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-[#845bdf] to-[#6b46c1] p-4 rounded-lg text-white">
            <h4 className="text-sm font-medium opacity-90">Total de Clientes</h4>
            <p className="text-2xl font-bold">{clientes.length}</p>
          </div>
          <div className="bg-gradient-to-r from-[#06b6d4] to-[#0891b2] p-4 rounded-lg text-white">
            <h4 className="text-sm font-medium opacity-90">Clientes Ativos</h4>
            <p className="text-2xl font-bold">{clientes.length}</p>
          </div>
          <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-4 rounded-lg text-white">
            <h4 className="text-sm font-medium opacity-90">Novos este Mês</h4>
            <p className="text-2xl font-bold">-</p>
          </div>
        </div>
      </div>
    </div>
  )
}
