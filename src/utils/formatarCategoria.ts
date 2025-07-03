// Função para formatar nomes de categoria para exibição
export const formatarCategoriaExibicao = (categoria: string) => {
  if (!categoria) return '';
  
  const categoriaFormatada = categoria.toLowerCase();
  switch (categoriaFormatada) {
    case 'smartphone':
      return 'Smartphone';
    case 'notebook':
      return 'Notebook';
    case 'tablet':
      return 'Tablet';
    case 'televisao':
      return 'Televisão';
    case 'smartwatch':
      return 'Smartwatch';
    case 'fone_de_ouvido':
      return 'Fone de Ouvido';
    case 'camera':
      return 'Câmera';
    case 'console':
      return 'Console';
    case 'acessorio':
      return 'Acessório';
    default:
      return categoria;
  }
};
