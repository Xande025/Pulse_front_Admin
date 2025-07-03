'use client'
import './page.css'
import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel, VictoryTheme } from "victory";
import { formatarCategoriaExibicao } from "@/utils/formatarCategoria";

interface graficoProdutoMarcaItf {
  marca: string
  num: number
}

interface graficoProdutoCategoriaItf {
  categoria: string
  num: number
}

interface geralDadosI {
  clientes: number
  produtos: number
  comentarios: number
  marcas: number
}

export default function Principal() {
  const [produtosMarca, setProdutosMarca] = useState<graficoProdutoMarcaItf[]>([])
  const [produtosCategoria, setProdutosCategoria] = useState<graficoProdutoCategoriaItf[]>([])
  const [dados, setDados] = useState<geralDadosI>({} as geralDadosI)

  useEffect(() => {
    async function getDadosGerais() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/gerais`)
      const dados = await response.json()
      setDados(dados)
    }
    getDadosGerais()

    async function getDadosGraficoMarca() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/produtosMarca`)
      const dados = await response.json()
      setProdutosMarca(dados)
    }
    getDadosGraficoMarca()

    async function getDadosGraficoCategoria() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dashboard/produtosCategoria`)
      const dados = await response.json()
      setProdutosCategoria(dados)
    }
    getDadosGraficoCategoria()

  }, [])

  // Função para agrupar categorias duplicadas
  const agruparCategorias = (categorias: graficoProdutoCategoriaItf[]) => {
    const categoriaMap = new Map<string, number>()
    
    categorias.forEach(item => {
      const categoriaNormalizada = item.categoria.toUpperCase()
      const valorExistente = categoriaMap.get(categoriaNormalizada) || 0
      categoriaMap.set(categoriaNormalizada, valorExistente + item.num)
    })
    
    return Array.from(categoriaMap.entries()).map(([categoria, num]) => ({ categoria, num }))
  }

  const listaProdutosMarca = produtosMarca.map((item: graficoProdutoMarcaItf) => (
    { x: item.marca, y: item.num }
  ))

  const listaProdutosCategoria = agruparCategorias(produtosCategoria).map((item) => {
    return { x: formatarCategoriaExibicao(item.categoria), y: item.num }
  })

  return (
    <div className="container mt-24">
      <h2 className="text-3xl mb-4 font-bold">Visão Geral do Sistema</h2>

      <div className="w-full flex justify-between mx-auto mb-5 gap-4">
        <div className="border-[#845bdf] border-2 rounded p-6 flex-1">
          <span className="bg-[#845bdf]/10 text-[#845bdf] text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.clientes}</span>
          <p className="font-bold mt-2 text-center">Nº Clientes</p>
        </div>
        <div className="border-[#5ce1e6] border-2 rounded p-6 flex-1">
          <span className="bg-[#5ce1e6]/10 text-[#5ce1e6] text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded">
            {dados.produtos}</span>
          <p className="font-bold mt-2 text-center">Nº Produtos</p>
        </div>
        <div className="border-green-600 border-2 rounded p-6 flex-1">
          <span className="bg-green-100 text-green-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-green-900 dark:text-green-300">
            {dados.comentarios}</span>
          <p className="font-bold mt-2 text-center">Nº Comentários</p>
        </div>
        <div className="border-orange-600 border-2 rounded p-6 flex-1">
          <span className="bg-orange-100 text-orange-800 text-xl text-center font-bold mx-auto block px-2.5 py-5 rounded dark:bg-orange-900 dark:text-orange-300">
            {dados.marcas}</span>
          <p className="font-bold mt-2 text-center">Nº Marcas</p>
        </div>
      </div>

      <div className="div-graficos">
        <svg viewBox="30 55 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={listaProdutosMarca}
            innerRadius={50}
            labelRadius={80}
            theme={VictoryTheme.clean}
            style={{
              labels: {
                fontSize: 10,
                fill: "#fff",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#845bdf",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Produtos", "por Marca"]}
          />
        </svg>

        <svg viewBox="30 55 400 400">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={listaProdutosCategoria}
            innerRadius={50}
            labelRadius={80}
            theme={VictoryTheme.clean}
            style={{
              labels: {
                fontSize: 10,
                fill: "#fff",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#5ce1e6",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Produtos", "por Categoria"]}
          />
        </svg>

      </div>
    </div>
  )
}