'use client'
import { Dispatch, SetStateAction } from "react"
import { TiDeleteOutline } from "react-icons/ti"
import { ComentarioI } from "@/utils/types/comentarios"
import { formatarCategoriaExibicao } from "@/utils/formatarCategoria"

interface listaComentarioProps {
  comentario: ComentarioI,
  comentarios: ComentarioI[],
  setComentarios: Dispatch<SetStateAction<ComentarioI[]>>
}

function ItemComentario({ comentario, comentarios, setComentarios }: listaComentarioProps) {

  function dataDMA(data: string) {
    const novaData = new Date(data)
    return novaData.toLocaleDateString('pt-br')
  }

  async function excluirComentario() {
    if (confirm(`Confirma a exclusão do comentário?`)) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/comentarios/${comentario.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json"
          },
        },
      )

      if (response.status == 200) {
        const comentarios2 = comentarios.filter(x => x.id != comentario.id)
        setComentarios(comentarios2)
        alert("Comentário excluído com sucesso")
      } else {
        alert("Erro... Comentário não foi excluído")
      }
    }
  }

  return (
    <tr key={comentario.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        <img src={comentario.produto.imagem} alt="Imagem do Produto"
          style={{ width: 200, height: 150, objectFit: 'cover' }} />
      </th>
      <td className={"px-6 py-4"}>
        <p><strong>{comentario.produto.marca?.nome || 'Marca não informada'}</strong></p>
        <p className="text-sm text-gray-600">{comentario.produto.nome}</p>
        <p className="text-xs text-gray-500">{formatarCategoriaExibicao(comentario.produto.categoria)}</p>
      </td>
      <td className={"px-6 py-4 font-semibold text-[#845bdf]"}>
        R$ {Number(comentario.produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
      </td>
      <td className={`px-6 py-4`}>
        <p><strong>{comentario.cliente.nome}</strong></p>
        <p className="text-sm text-gray-600">{comentario.cliente.email}</p>
      </td>
      <td className={`px-6 py-4`}>
        <p className="mb-2">{comentario.texto || comentario.comentario}</p>
        <p className="text-xs text-gray-500 italic">
          Em: {dataDMA(comentario.createdAt)}
        </p>
      </td>
      <td className={`px-6 py-4`}>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            📝 Comentário
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer hover:text-red-700 transition-colors" title="Excluir"
          onClick={excluirComentario} />
      </td>
    </tr>
  )
}

export default ItemComentario