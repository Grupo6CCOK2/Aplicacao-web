const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export function validarServico(servico, catalogo) {
  if (!servico.titulo?.trim() || !servico.descricao?.trim() || !servico.categoria?.trim() || !servico.profissional?.trim()) return 'Preencha nome, descrição, categoria e profissional.';
  if (catalogo.some(item => item.id !== servico.id && normalizar(item.titulo) === normalizar(servico.titulo))) return 'Já existe um serviço com esse nome.';
  if (!Number.isInteger(Number(servico.minutos)) || Number(servico.minutos) < 15 || Number(servico.minutos) > 420) return 'Informe uma duração entre 15 e 420 minutos.';
  if (String(servico.valor).trim() === '' || !Number.isFinite(Number(servico.valor)) || Number(servico.valor) < 0) return 'Informe um preço válido.';
  if (!/^(https?:\/\/|data:image\/(png|jpeg|webp);base64,)/i.test(servico.imagem || '')) return 'Escolha uma foto JPG, PNG ou WebP, ou informe um link http/https.';
  return '';
}

export function montarServico(formulario) {
  return {
    id: formulario.id || crypto.randomUUID(),
    titulo: formulario.titulo.trim(),
    descricao: formulario.descricao.trim(),
    categoria: formulario.categoria.trim(),
    profissional: formulario.profissional.trim(),
    duracao: `${Number(formulario.minutos)} min`,
    preco: Number(formulario.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    imagem: formulario.imagem,
    destaque: formulario.destaque,
    ativo: formulario.ativo !== false,
    cargo: 'Cabeleireiro',
    iniciais: formulario.profissional.trim().split(/\s+/).map(parte => parte[0]).slice(0, 2).join(''),
  };
}
