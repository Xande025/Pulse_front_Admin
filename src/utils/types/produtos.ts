import { MarcaI } from "./marcas"

export interface ProdutoI {
  id: string
  nome: string
  categoria: string
  preco: number
  estoque: number
  destaque: boolean
  imagem: string
  descricao?: string
  marcaId: number
  marca?: MarcaI // Tornando opcional para casos onde a API não popula
  createdAt?: string
  updatedAt?: string
}