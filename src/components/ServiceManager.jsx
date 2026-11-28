import { useState } from 'react';
import { duracaoEmMinutos } from '../utils/agenda';
import { montarServico, validarServico } from '../utils/servicos';
import { profissionaisDoServico } from '../utils/profissionais';
import './ServiceManager.css';

export default function ServiceManager({ servicos, aoSalvar, funcionarios }) {
  const [editando, setEditando] = useState(undefined);
  const [aviso, setAviso] = useState('');
  const salvar = (servico) => {
    const existe = servicos.some(item => item.id === servico.id);
    const resultado = aoSalvar(existe ? servicos.map(item => item.id === servico.id ? servico : item) : [...servicos, servico]);
    if (resultado.ok) { setEditando(undefined); setAviso(existe ? 'Serviço atualizado.' : 'Serviço cadastrado e disponível no site.'); }
    return resultado;
  };
  const alternar = (servico) => {
    if (servico.ativo !== false && servicos.filter(item => item.ativo !== false).length === 1) { setAviso('Mantenha pelo menos um serviço disponível para agendamento.'); return; }
    const resultado = salvar({ ...servico, ativo: servico.ativo === false });
    if (!resultado.ok) setAviso(resultado.erro);
    else setAviso(servico.ativo === false ? 'Serviço ativado.' : 'Serviço pausado. Os agendamentos existentes foram mantidos.');
  };
  return <section className="service-manager">
    <header><div><span className="section-eyebrow">CATÁLOGO DO SALÃO</span><h1>Serviços</h1><p>Cadastre seus atendimentos e escolha quais aparecem na página inicial.</p></div><button className="btn-burgundy" onClick={() => { setEditando(null); setAviso(''); }}>Novo serviço</button></header>
    <p className="service-local-note">Nesta versão, o catálogo fica salvo somente neste navegador.</p>
    {aviso && <p className="agenda-notice" role="status">{aviso}</p>}
    {editando !== undefined ? <ServiceForm key={editando?.id || 'novo'} servico={editando} servicos={servicos} funcionarios={funcionarios} aoSalvar={salvar} aoVoltar={() => setEditando(undefined)} /> :
      <div className="service-admin-grid">{servicos.map(servico => <article className="service-admin-card" key={servico.id}>
        <img src={servico.imagem} alt={servico.titulo} />
        <div><span className="service-category">{servico.categoria}</span><h2>{servico.titulo}</h2><p>{servico.descricao}</p><strong>{servico.preco} · {servico.duracao}</strong><p>{servico.profissional}</p><small>{servico.ativo === false ? 'Pausado' : 'Disponível'}{servico.destaque ? ' · Destaque na home' : ''}</small>
          <div className="service-admin-actions"><button onClick={() => { setEditando(servico); setAviso(''); }}>Editar serviço</button><button onClick={() => alternar(servico)}>{servico.ativo === false ? 'Ativar' : 'Pausar'}</button></div>
        </div>
      </article>)}</div>}
  </section>;
}

function ServiceForm({ servico, servicos, funcionarios, aoSalvar, aoVoltar }) {
  const [form, setForm] = useState(() => ({ ...servico, titulo: servico?.titulo || '', descricao: servico?.descricao || '', categoria: servico?.categoria || 'Cortes & Penteados', profissional: (servico ? profissionaisDoServico(servico, funcionarios).find(item => item.nome === servico.profissional || (servico.profissional === 'Fred' && item.nome === 'Fred Santos'))?.nome || profissionaisDoServico(servico, funcionarios)[0]?.nome : funcionarios.find(item => item.status === 'Ativo')?.nome) || '', minutos: servico ? duracaoEmMinutos(servico.duracao) : 45, valor: servico ? Number(servico.preco.replace(/[^\d,]/g, '').replace(',', '.')) : '', imagem: servico?.imagem || '', destaque: servico?.destaque ?? true }));
  const [erro, setErro] = useState('');
  const [lendoFoto, setLendoFoto] = useState(false);
  const mudar = (chave, valor) => { setForm(atual => ({ ...atual, [chave]: valor })); setErro(''); };
  const profissionais = funcionarios.filter(item => item.status === 'Ativo').map(item => item.nome);
  const escolherFoto = (arquivo) => {
    if (!arquivo) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type) || arquivo.size > 1500000) { setErro('Escolha uma imagem JPG, PNG ou WebP de até 1,5 MB.'); return; }
    setLendoFoto(true);
    const leitor = new FileReader();
    leitor.onload = () => { mudar('imagem', leitor.result); setLendoFoto(false); };
    leitor.onerror = () => { setErro('Não foi possível ler a foto. Tente novamente.'); setLendoFoto(false); };
    leitor.readAsDataURL(arquivo);
  };
  return <form className="service-editor" onSubmit={e => { e.preventDefault(); const erroValidacao = validarServico(form, servicos); if (erroValidacao) { setErro(erroValidacao); return; } const resultado = aoSalvar(montarServico(form)); if (!resultado.ok) setErro(resultado.erro); }}>
    <h2>{servico ? 'Editar serviço' : 'Novo serviço'}</h2>
    <div className="service-editor-grid"><div className="service-photo-field">
      {form.imagem ? <img src={form.imagem} alt="Prévia da foto do serviço" /> : <div className="service-photo-empty">Foto do serviço</div>}
      <label>Escolher foto<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => escolherFoto(e.target.files[0])} /></label>
      <small>JPG, PNG ou WebP. Até 1,5 MB.</small>
      <label>Ou link da imagem<input type="url" value={form.imagem.startsWith('data:') ? '' : form.imagem} onChange={e => mudar('imagem', e.target.value)} placeholder="https://..." /></label>
    </div><div>
      <label>Nome do serviço<input required maxLength={80} value={form.titulo} onChange={e => mudar('titulo', e.target.value)} /></label>
      <label>Descrição<textarea required maxLength={400} value={form.descricao} onChange={e => mudar('descricao', e.target.value)} /></label>
      <div className="form-row-2"><label>Preço (R$)<input required type="number" min="0" step="0.01" value={form.valor} onChange={e => mudar('valor', e.target.value)} /></label><label>Duração (minutos)<input required type="number" min="15" max="420" step="1" value={form.minutos} onChange={e => mudar('minutos', e.target.value)} /></label></div>
      <div className="form-row-2"><label>Categoria<input required maxLength={60} list="service-categories" value={form.categoria} onChange={e => mudar('categoria', e.target.value)} /><datalist id="service-categories">{[...new Set(servicos.map(item => item.categoria))].map(cat => <option key={cat} value={cat} />)}</datalist></label><label>Profissional<select value={form.profissional} onChange={e => mudar('profissional', e.target.value)}>{profissionais.map(nome => <option key={nome}>{nome}</option>)}</select></label></div>
      <label className="service-checkbox"><input type="checkbox" checked={form.destaque} onChange={e => mudar('destaque', e.target.checked)} /> Mostrar também na página inicial</label>
    </div></div>
    {erro && <p className="agenda-error" role="alert">{erro}</p>}
    <div className="service-editor-actions"><button type="button" onClick={aoVoltar}>Voltar ao catálogo</button><button disabled={lendoFoto} className="btn-burgundy" type="submit">{lendoFoto ? 'Carregando foto...' : 'Salvar serviço'}</button></div>
  </form>;
}
