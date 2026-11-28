const normalizar = texto => String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const nomeProfissional = nome => normalizar(nome).replace(/^fred santos$/, 'fred');

export function profissionaisDoServico(servico, funcionarios) {
  const categoria = normalizar(servico.categoria);
  const apenasCorte = /^corte\b/.test(normalizar(servico.titulo)) && !/barba/.test(normalizar(servico.titulo));
  return funcionarios.filter(funcionario => {
    if (funcionario.status !== 'Ativo') return false;
    if (nomeProfissional(funcionario.nome) === nomeProfissional(servico.profissional)) return true;
    return (funcionario.especialidades || []).some(especialidade => {
      const nome = normalizar(especialidade);
      if (apenasCorte || categoria === 'cortes & penteados') return /cort|pentead|finaliza/.test(nome);
      if (categoria === 'cor & tratamentos') return /color|mecha|tratament|hidrata/.test(nome);
      if (categoria === 'barba & combos') return /barba|visagismo/.test(nome);
      return nome === categoria || nome === normalizar(servico.titulo);
    });
  });
}
