'use client'
import { useEffect, useState } from "react"
import Link from 'next/link'

import ItemProduto from '@/components/ItemProduto'
import { ProdutoI } from "@/utils/types/produtos"

function CadProdutos() {
  const [produtos, setProdutos] = useState<ProdutoI[]>([])

  useEffect(() => {
    async function getProdutos() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`)
      const dados = await response.json()
      setProdutos(dados)
    }
    getProdutos()
  }, [])

  const listaProdutos = produtos.map(produto => (
    <ItemProduto key={produto.id} produto={produto} produtos={produtos} setProdutos={setProdutos} />
  ))

  return (
    <div className='m-4 mt-24'>
      <div className='flex justify-between'>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          Cadastro de Produtos Eletrônicos
        </h1>
        <Link href="produtos/novo" 
          className="text-white bg-[#845bdf] hover:bg-[#6b46c1] focus:ring-4 focus:ring-[#845bdf]/50 font-bold rounded-lg text-md px-5 py-2.5 me-2 mb-2 transition-colors duration-200 focus:outline-none">
          Novo Produto
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Foto
              </th>
              <th scope="col" className="px-6 py-3">
                Nome do Produto
              </th>
              <th scope="col" className="px-6 py-3">
                Marca
              </th>
              <th scope="col" className="px-6 py-3">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3">
                Preço R$
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {listaProdutos}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CadProdutos