import { useState } from 'react';
import './DashboardLayout.css';
import DailyAgenda from './DailyAgenda';
import { agendaProfissional } from '../utils/agenda';
import EmployeeProfile from './EmployeeProfile';

export default function EmployeeDashboard({ funcionario, funcionarios, aoSalvarPerfil, agendamentos = [], setAgendamentos }) {
  const [abaAtiva, setAbaAtiva] = useState('agenda');
  const meusAtendimentos = agendaProfissional(agendamentos, funcionario?.nome);
  const clientes = [...new Map(meusAtendimentos.map(item => [item.clienteId || item.cliente, item])).values()];
  return <div className="dashboard-layout employee-dashboard" style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', minHeight: 'calc(100vh - 80px)', background: 'var(--bg-cream)' }}>
    <aside className="employee-nav"><span>FUNCIONÁRIO</span>{[['agenda', 'Agenda'], ['clientes', 'Clientes'], ['perfil', 'Meu perfil']].map(([aba, titulo]) => <button key={aba} aria-current={abaAtiva === aba ? 'page' : undefined} onClick={() => setAbaAtiva(aba)}>{titulo}</button>)}</aside>
    <div className="dashboard-content" style={{ padding: '36px 40px' }}>
      {abaAtiva === 'agenda' && <DailyAgenda profissional={funcionario?.nome || ''} agendamentos={agendamentos} setAgendamentos={setAgendamentos} />}
      {abaAtiva === 'clientes' && <section className="employee-clients"><h1>Meus clientes</h1><p>Clientes dos seus atendimentos.</p><div className="dashboard-table-scroll"><table><thead><tr><th>Cliente</th><th>Telefone</th><th>E-mail</th></tr></thead><tbody>{clientes.map(item => <tr key={item.clienteId || item.cliente}><td>{item.cliente}</td><td>{item.telefone || 'Não informado'}</td><td>{item.email || 'Não informado'}</td></tr>)}{!clientes.length && <tr><td colSpan="3">Nenhum cliente vinculado aos seus atendimentos.</td></tr>}</tbody></table></div></section>}
      {abaAtiva === 'perfil' && <EmployeeProfile key={funcionario?.id || 'vazio'} funcionario={funcionario} funcionarios={funcionarios} aoSalvar={aoSalvarPerfil} />}
    </div>
  </div>;
}
