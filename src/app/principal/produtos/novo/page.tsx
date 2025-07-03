'use client'
import { useForm } from "react-hook-form"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { MarcaI } from "@/utils/types/marcas"

type Inputs = {
  nome: string
  marcaId: number
  categoria: string
  preco: number
  estoque: number
  imagem: string
  descricao?: string
  destaque?: boolean
}

function NovoProduto() {
  const [marcas, setMarcas] = useState<MarcaI[]>([])
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      nome: "",
      marcaId: 0,
      categoria: "",
      preco: 0,
      estoque: 0,
      imagem: "",
      descricao: "",
      destaque: false
    }
  })

  useEffect(() => {
    async function getMarcas() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/marcas`)
      const dados = await response.json()
      setMarcas(dados)
    }
    getMarcas()
    setFocus("nome")
  }, [])

  const optionsMarca = marcas.map(marca => (
    <option key={marca.id} value={marca.id}>{marca.nome}</option>
  ))

  async function incluirProduto(data: Inputs) {
    console.log("Dados recebidos do formulário:", data)
    
    // Validação básica
    if (!data.nome || !data.marcaId || !data.categoria || !data.preco || !data.estoque || !data.imagem) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const novoProduto = {
      nome: data.nome,
      marcaId: Number(data.marcaId),
      categoria: data.categoria.toUpperCase(), // Normalizar para maiúscula
      preco: Number(data.preco),
      estoque: Number(data.estoque),
      imagem: data.imagem,
      descricao: data.descricao || null,
      destaque: data.destaque || false
    }

    console.log("Dados que serão enviados:", novoProduto)
    console.log("Token de autenticação:", Cookies.get("admin_logado_token"))
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/produtos`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + Cookies.get("admin_logado_token") as string
        },
        body: JSON.stringify(novoProduto)
      })

      console.log("Status da resposta:", response.status)
      
      if (response.status == 201) {
        toast.success("Ok! Produto cadastrado com sucesso")
        reset()
      } else {
        // Tentar obter mais informações sobre o erro
        const errorText = await response.text()
        console.error("Erro na API:", response.status, errorText)
        
        if (response.status === 400) {
          toast.error("Dados inválidos. Verifique os campos e tente novamente.")
        } else if (response.status === 401) {
          toast.error("Token de autenticação inválido. Faça login novamente.")
        } else if (response.status === 403) {
          toast.error("Acesso negado. Você não tem permissão para cadastrar produtos.")
        } else {
          toast.error(`Erro no cadastro: ${response.status} - ${errorText}`)
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      toast.error("Erro de conexão com a API")
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white me-56">
        Inclusão de Produtos Eletrônicos
      </h1>

      <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirProduto)}>
        <div className="mb-3">
          <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nome do Produto</label>
          <input type="text" id="nome"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#845bdf] focus:border-[#845bdf] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]" required
            {...register("nome", { 
              required: "Nome do produto é obrigatório",
              minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" }
            })}
          />
          {errors.nome && <span className="text-red-500 text-sm">{errors.nome.message}</span>}
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="marcaId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Marca</label>
            <select id="marcaId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#845bdf] focus:border-[#845bdf] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]" required
              {...register("marcaId", { 
                required: "Selecione uma marca",
                valueAsNumber: true,
                validate: (value) => value > 0 || "Selecione uma marca válida"
              })}
            >
              <option value="">Selecione uma marca</option>
              {optionsMarca}
            </select>
            {errors.marcaId && <span className="text-red-500 text-sm">{errors.marcaId.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Categoria</label>
            <select id="categoria"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#845bdf] focus:border-[#845bdf] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]" required
              {...register("categoria", { 
                required: "Selecione uma categoria"
              })}
            >
              <option value="">Selecione a categoria</option>
              <option value="SMARTPHONE">Smartphone</option>
              <option value="NOTEBOOK">Notebook</option>
              <option value="TABLET">Tablet</option>
              <option value="TELEVISAO">Televisão</option>
              <option value="SMARTWATCH">Smartwatch</option>
              <option value="FONE_DE_OUVIDO">Fone de Ouvido</option>
              <option value="CAMERA">Câmera</option>
              <option value="CONSOLE">Console</option>
              <option value="ACESSORIO">Acessório</option>
            </select>
            {errors.categoria && <span className="text-red-500 text-sm">{errors.categoria.message}</span>}
          </div>
        </div>
        <div className="grid gap-6 mb-3 md:grid-cols-2">
          <div className="mb-3">
            <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Preço R$</label>
            <input type="number" step="0.01" min="0" id="preco"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#845bdf] focus:border-[#845bdf] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]" required
              {...register("preco", { 
                required: "Preço é obrigatório",
                valueAsNumber: true,
                min: { value: 0.01, message: "Preço deve ser maior que zero" }
              })}
            />
            {errors.preco && <span className="text-red-500 text-sm">{errors.preco.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="estoque" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Estoque</label>
            <input type="number" min="0" id="estoque"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#845bdf] focus:border-[#845bdf] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]" required
              {...register("estoque", { 
                required: "Estoque é obrigatório",
                valueAsNumber: true,
                min: { value: 0, message: "Estoque deve ser maior ou igual a zero" }
              })}
            />
            {errors.estoque && <span className="text-red-500 text-sm">{errors.estoque.message}</span>}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="imagem" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            URL da Imagem</label>
          <input type="url" id="imagem"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#845bdf] focus:border-[#845bdf] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]" required
            {...register("imagem", { 
              required: "URL da imagem é obrigatória",
              pattern: {
                value: /^https?:\/\/.+/,
                message: "URL deve começar com http:// ou https://"
              }
            })}
          />
          {errors.imagem && <span className="text-red-500 text-sm">{errors.imagem.message}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Descrição</label>
          <textarea id="descricao" rows={3}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-[#845bdf] focus:border-[#845bdf] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#845bdf] dark:focus:border-[#845bdf]"
            placeholder="Descrição geral do produto..."
            {...register("descricao")}></textarea>
        </div>
        <div className="mb-3">
          <label className="inline-flex items-center">
            <input type="checkbox" 
              className="rounded border-gray-300 text-[#845bdf] shadow-sm focus:ring-[#845bdf] focus:ring-offset-0"
              {...register("destaque")}
            />
            <span className="ml-2 text-sm text-gray-900 dark:text-white">
              Produto em destaque
            </span>
          </label>
        </div>

        <button type="submit" className="text-white bg-[#845bdf] hover:bg-[#6b46c1] focus:ring-4 focus:outline-none focus:ring-[#845bdf]/50 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-200">
          Incluir Produto</button>
      </form>
    </>
  )
}

export default NovoProduto