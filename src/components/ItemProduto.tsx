'use client'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar, FaStar } from "react-icons/fa"
import Cookies from "js-cookie"
import { ProdutoI } from "@/utils/types/produtos"

import { formatarCategoriaExibicao } from "@/utils/formatarCategoria"
import { jwtDecode } from "jwt-decode"

interface listaProdutoProps {
  produto: ProdutoI,
  produtos: ProdutoI[],
  setProdutos: Dispatch<SetStateAction<ProdutoI[]>>
}

type AdminPayload = {
  adminLogadoId: string;
  adminLogadoNome: string;
  adminLogadoNivel: number;
};

function ItemProduto({ produto, produtos, setProdutos }: listaProdutoProps) {
  const [admin, setAdmin] = useState<AdminPayload | null>(null);

  useEffect(() => {
    const token = Cookies.get("admin_logado_token");
    if (!token) return;

    try {
      const decoded = jwtDecode<AdminPayload>(token);
      setAdmin(decoded);
      // console.log("Usuário logado:", decoded); // Log removido para evitar spam
    } catch {
      alert("Token inválido");
    }
  }, []);

  async function excluirProduto() {
    if (!admin || admin.adminLogadoNivel != 1) {
      alert("Você não tem permissão para excluir produtos");
      return;
    }

    if (confirm(`Confirma a exclusão do produto ${produto.nome}?`)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/${produto.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
            },
          },
        )

        console.log("Status DELETE:", response.status)

        if (response.status == 200) {
          const produtos2 = produtos.filter(x => x.id != produto.id)
          setProdutos(produtos2)
          alert("Produto excluído com sucesso")
        } else {
          const errorText = await response.text()
          console.error("Erro DELETE:", response.status, errorText)
          alert(`Erro na exclusão: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        console.error("Erro na requisição DELETE:", error)
        alert("Erro de conexão ao excluir produto")
      }
    }
  }

  async function alterarDestaque() {
    console.log("Produto atual:", produto)
    
    // Como não há rota específica para destacar, vamos usar PUT para atualizar o produto
    const produtoAtualizado = {
      nome: produto.nome,
      categoria: produto.categoria.toUpperCase(), // Normalizar categoria
      descricao: produto.descricao || null,
      preco: Number(produto.preco),
      estoque: Number(produto.estoque) || 0,
      imagem: produto.imagem,
      destaque: !produto.destaque,
      marcaId: Number(produto.marcaId)
    }

    console.log("Dados que serão enviados:", produtoAtualizado)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/${produto.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
        body: JSON.stringify(produtoAtualizado)
      })

      console.log("Status da resposta:", response.status)

      if (response.status == 200) {
        const produtos2 = produtos.map(x => {
          if (x.id == produto.id) {
            return { ...x, destaque: !x.destaque }
          }
          return x
        })
        setProdutos(produtos2)
        alert("Destaque alterado com sucesso!")
      } else {
        const errorText = await response.text()
        console.error("Erro na API:", response.status, errorText)
        alert(`Erro ao alterar destaque: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      alert("Erro de conexão ao alterar destaque")
    }
  }

  return (
    <tr key={produto.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={produto.imagem} alt="Imagem do Produto"
          style={{ width: 200, height: 150, objectFit: 'cover' }} />
      </th>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.nome}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {produto.marca?.nome || 'Marca não informada'}
      </td>
      <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
        {formatarCategoriaExibicao(produto.categoria)}
      </td>
      <td className={`px-6 py-4 font-semibold text-[#845bdf] ${produto.destaque ? "font-extrabold text-lg" : ""}`}>
        R$ {Number(produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-700 transition-colors" title="Excluir"
          onClick={excluirProduto} />&nbsp;
        {produto.destaque ? (
          <FaStar className="text-3xl text-[#845bdf] inline-block cursor-pointer hover:text-[#9370db] transition-colors" title="Remover destaque"
            onClick={alterarDestaque} />
        ) : (
          <FaRegStar className="text-3xl text-[#5ce1e6] inline-block cursor-pointer hover:text-[#845bdf] transition-colors" title="Destacar"
            onClick={alterarDestaque} />
        )}
      </td>
    </tr>
  )
}

export default ItemProduto