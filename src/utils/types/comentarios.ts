import { ProdutoI } from "./produtos"

export interface ClienteI {
  id: string
  nome: string
  email: string
  senha?: string
  createdAt?: string
  updatedAt?: string
}

export interface ComentarioI {
  id: string
  comentario: string
  texto?: string // Para compatibilidade com a API que usa 'texto'
  resposta?: string
  clienteId: string
  produtoId: string
  cliente: ClienteI
  produto: ProdutoI
  createdAt: string
  updatedAt?: string
}
