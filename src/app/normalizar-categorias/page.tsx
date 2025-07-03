'use client'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

export default function NormalizarCategorias() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultado, setResultado] = useState('')

  const normalizarCategorias = async () => {
    setIsLoading(true)
    setResultado('')
    
    try {
      // Primeiro, vamos buscar todos os produtos
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`)
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos')
      }
      
      const produtos = await response.json()
      console.log('Produtos encontrados:', produtos.length)
      
      // Mapear categorias que precisam ser normalizadas
      const categoriasNormalizadas = {
        'smartphone': 'SMARTPHONE',
        'Smartphone': 'SMARTPHONE',
        'notebook': 'NOTEBOOK',
        'Notebook': 'NOTEBOOK',
        'tablet': 'TABLET',
        'Tablet': 'TABLET',
        'televisao': 'TELEVISAO',
        'Televisao': 'TELEVISAO',
        'Televisão': 'TELEVISAO',
        'smartwatch': 'SMARTWATCH',
        'Smartwatch': 'SMARTWATCH',
        'fone_de_ouvido': 'FONE_DE_OUVIDO',
        'Fone de Ouvido': 'FONE_DE_OUVIDO',
        'camera': 'CAMERA',
        'Camera': 'CAMERA',
        'Câmera': 'CAMERA',
        'console': 'CONSOLE',
        'Console': 'CONSOLE',
        'acessorio': 'ACESSORIO',
        'Acessorio': 'ACESSORIO',
        'Acessório': 'ACESSORIO'
      }
      
      let produtosAtualizados = 0
      let erros = 0
      
      // Atualizar produtos que precisam de normalização
      for (const produto of produtos) {
        const categoriaAtual = produto.categoria
        const categoriaNormalizada = categoriasNormalizadas[categoriaAtual] || categoriaAtual.toUpperCase()
        
        if (categoriaAtual !== categoriaNormalizada) {
          try {
            const produtoAtualizado = {
              nome: produto.nome,
              categoria: categoriaNormalizada,
              descricao: produto.descricao,
              preco: produto.preco,
              estoque: produto.estoque || 0,
              imagem: produto.imagem,
              destaque: produto.destaque || false,
              marcaId: produto.marcaId
            }
            
            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos/${produto.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get("admin_logado_token")}`
              },
              body: JSON.stringify(produtoAtualizado)
            })
            
            if (updateResponse.ok) {
              produtosAtualizados++
              console.log(`Produto ${produto.nome}: ${categoriaAtual} → ${categoriaNormalizada}`)
            } else {
              erros++
              console.error(`Erro ao atualizar produto ${produto.nome}:`, updateResponse.status)
            }
          } catch (error) {
            erros++
            console.error(`Erro ao atualizar produto ${produto.nome}:`, error)
          }
        }
      }
      
      const mensagem = `Normalização concluída!
Produtos encontrados: ${produtos.length}
Produtos atualizados: ${produtosAtualizados}
Erros: ${erros}`
      
      setResultado(mensagem)
      
      if (erros === 0) {
        toast.success('Categorias normalizadas com sucesso!')
      } else {
        toast.warning(`Normalização concluída com ${erros} erros`)
      }
      
    } catch (error) {
      console.error('Erro na normalização:', error)
      setResultado(`Erro: ${error}`)
      toast.error('Erro ao normalizar categorias')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Normalizar Categorias</h1>
      
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">⚠️ Atenção</h2>
        <p className="text-sm text-gray-700">
          Esta operação irá normalizar todas as categorias dos produtos para maiúscula (ex: "Smartphone" → "SMARTPHONE").
          Isso resolve o problema de categorias duplicadas no gráfico do dashboard.
        </p>
      </div>
      
      <div className="mb-4">
        <button 
          onClick={normalizarCategorias} 
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Normalizando...' : 'Normalizar Categorias'}
        </button>
      </div>

      {resultado && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Resultado:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {resultado}
          </pre>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Categorias que serão normalizadas:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>smartphone, Smartphone → SMARTPHONE</li>
          <li>notebook, Notebook → NOTEBOOK</li>
          <li>tablet, Tablet → TABLET</li>
          <li>televisao, Televisao, Televisão → TELEVISAO</li>
          <li>smartwatch, Smartwatch → SMARTWATCH</li>
          <li>fone_de_ouvido, Fone de Ouvido → FONE_DE_OUVIDO</li>
          <li>camera, Camera, Câmera → CAMERA</li>
          <li>console, Console → CONSOLE</li>
          <li>acessorio, Acessorio, Acessório → ACESSORIO</li>
        </ul>
      </div>
    </div>
  )
}
