import { useState } from "react";
import "./DashboardLayout.css";
import { filtrarAgenda, dataLocal, horarioFinal } from "../utils/agenda";
import DailyAgenda from "./DailyAgenda";
import ServiceManager from "./ServiceManager";
import FinancialDashboard from "./FinancialDashboard";
import AgendaBlockManager from "./AgendaBlockManager";
import NewEmployeeForm from "./NewEmployeeForm";
import RemoveEmployeeDialog from "./RemoveEmployeeDialog";

export default function AdminDashboard({
  usuarioLogado,
  servicos,
  aoSalvarServicos,
  funcionarios,
  setFuncionarios,
  agendamentos,
  setAgendamentos,
  bloqueios = [],
  aoAplicarBloqueio,
  aoRemoverBloqueio,
}) {
  const [abaAtiva, setAbaAtiva] = useState("visao-geral");
  const [modoFinanceiro, setModoFinanceiro] = useState(false);
  const [clienteFinanceiro, setClienteFinanceiro] = useState(null);
  const abrirFinanceiro = (nome = null) => {
    setClienteFinanceiro(nome);
    setAbaAtiva("visao-geral");
    setModoFinanceiro(true);
    setCadastrandoFuncionario(false);
  };
  const [cadastrandoFuncionario, setCadastrandoFuncionario] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);
  const [funcionarioRemovendo, setFuncionarioRemovendo] = useState(null);
  const [avisoFuncionario, setAvisoFuncionario] = useState("");

  // Filtros da Visão Geral / Financeiro
  const [filtroData, setFiltroData] = useState(dataLocal);
  const [filtroProfissional, setFiltroProfissional] = useState("");

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    data: dataLocal(),
    busca: "",
  });
  // Lista de Funcionários

  // Lista de Agendamentos


  const agendaFiltrada = filtrarAgenda(
    agendamentos.map((ag) => ({ ...ag, data: ag.data || "2026-11-11" })),
    filtrosAplicados.data,
    filtrosAplicados.busca,
  );
  const [selecao, setSelecao] = useState(agendamentos[1]?.id ?? null);
  const agendamentoSelecionado = agendamentos.find((item) => item.id === selecao) || null;
  const setAgendamentoSelecionado = (item) => setSelecao(item?.id ?? null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  // Lista de Clientes
  const [buscaCliente, setBuscaCliente] = useState("");
  const [filtroStatusCliente, setFiltroStatusCliente] = useState("Todos");
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: "Marina Costa",
      telefone: "(11) 98765-4321",
      email: "marina@email.com",
      atendimentos: 12,
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Camila Alves",
      telefone: "(11) 98765-4321",
      email: "camila@email.com",
      atendimentos: 8,
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Ana Lima",
      telefone: "(11) 98765-4321",
      email: "ana@email.com",
      atendimentos: 15,
      status: "Ativo",
    },
    {
      id: 4,
      nome: "Julia Rocha",
      telefone: "(11) 98765-4321",
      email: "julia@email.com",
      atendimentos: 5,
      status: "Ativo",
    },
    {
      id: 5,
      nome: "Carlos Pereira",
      telefone: "(11) 98765-0011",
      email: "carlos@email.com",
      atendimentos: 3,
      status: "Inativo",
    },
  ]);

  // Dados do Gráfico de Barras (Abr a Mar)
  const dadosGrafico = [
    { mes: "Abr", altura: 55 },
    { mes: "Mai", altura: 72 },
    { mes: "Jun", altura: 48 },
    { mes: "Jul", altura: 82 },
    { mes: "Ago", altura: 64 },
    { mes: "Set", altura: 88 },
    { mes: "Out", altura: 60 },
    { mes: "Nov", altura: 92 },
    { mes: "Dez", altura: 76 },
    { mes: "Jan", altura: 85 },
    { mes: "Fev", altura: 68 },
    { mes: "Mar", altura: 96 },
  ];

  // Funções auxiliares
  const handleCancelarHorario = () => {
    if (
      agendamentoSelecionado &&
      ["Concluído", "Cancelado"].includes(agendamentoSelecionado.status)
    )
      return;
    if (!agendamentoSelecionado || !motivoCancelamento.trim()) {
      alert("Informe o motivo do cancelamento.");
      return;
    }
    const atualizados = agendamentos.map((ag) =>
      ag.id === agendamentoSelecionado.id
        ? {
            ...ag,
            status: "Cancelado",
            motivoCancelamento: motivoCancelamento.trim(),
          }
        : ag,
    );
    setAgendamentos(atualizados);
    setAgendamentoSelecionado({
      ...agendamentoSelecionado,
      status: "Cancelado",
      motivoCancelamento: motivoCancelamento.trim(),
    });
    setMotivoCancelamento("");
  };

  const alternarStatusCliente = (id) => {
    setClientes(
      clientes.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Ativo" ? "Inativo" : "Ativo" }
          : c,
      ),
    );
  };

  const getBadgeStyle = (status) => {
    if (status === "Confirmado") return styles.badgeBlue;
    if (status === "Em atendimento") return styles.badgeOrange;
    if (status === "Concluído") return styles.badgeGreen;
    if (status === "Cancelado") return styles.badgeRed;
    return styles.badgeYellow;
  };

  const clientesFiltrados = clientes.filter((c) => {
    const matchBusca =
      c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
      c.telefone.includes(buscaCliente);
    const matchStatus =
      filtroStatusCliente === "Todos" || c.status === filtroStatusCliente;
    return matchBusca && matchStatus;
  });

  return (
    <div
      className={`dashboard-layout admin-dashboard ${modoFinanceiro && abaAtiva === "visao-geral" ? "admin-financial-layout" : ""}`}
      style={styles.dashboardLayout}
    >
      {/* SIDEBAR ESQUERDA */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarSection}>
          <span style={styles.sidebarCategory}>ADMINISTRAÇÃO</span>

          <button
            onClick={() => {
              setAbaAtiva("visao-geral");
              setModoFinanceiro(false);
              setCadastrandoFuncionario(false);
            }}
            style={
              abaAtiva === "visao-geral" && !modoFinanceiro
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Visão geral
          </button>

          <button onClick={() => { setAbaAtiva('minha-agenda'); setModoFinanceiro(false); }} style={abaAtiva === 'minha-agenda' ? styles.sidebarItemActive : styles.sidebarItem}>Minha agenda</button>

          <button
            onClick={() => {
              setAbaAtiva("agendamentos");
              setCadastrandoFuncionario(false);
            }}
            style={
              abaAtiva === "agendamentos"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Agendamentos
          </button>

          <button
            onClick={() => {
              setAbaAtiva("clientes");
              setCadastrandoFuncionario(false);
            }}
            style={
              abaAtiva === "clientes"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Clientes
          </button>

          <button
            onClick={() => {
              setAbaAtiva("funcionarios");
              setCadastrandoFuncionario(false);
            }}
            style={
              abaAtiva === "funcionarios"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Funcionários
          </button>

          {[
            ['servicos', 'Serviços'],
            ['bloqueios', 'Bloqueios do salão'],
          ].map(([aba, titulo]) => <button key={aba} onClick={() => { setAbaAtiva(aba); setModoFinanceiro(false); }} style={abaAtiva === aba ? styles.sidebarItemActive : styles.sidebarItem}>{titulo}</button>)}
          <button
            onClick={() => abrirFinanceiro()}
            style={
              abaAtiva === "visao-geral" && modoFinanceiro
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Painel financeiro
          </button>
        </div>

        <div style={styles.sidebarFooter}>
          <span style={styles.footerText}>FRED. • Gestão do salão</span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div
        className="dashboard-content"
        style={
          modoFinanceiro && abaAtiva === "visao-geral"
            ? { ...styles.mainContent, minWidth: 0 }
            : styles.mainContent
        }
      >
        {abaAtiva === "visao-geral" && modoFinanceiro && (
          <FinancialDashboard
            key={clienteFinanceiro || "geral"}
            usuarioLogado={usuarioLogado}
            clienteInicial={clienteFinanceiro}
            aoVoltarClientes={() => {
              setAbaAtiva("clientes");
              setClienteFinanceiro(null);
              setModoFinanceiro(false);
            }}
          />
        )}
        {/* ================= 1. VISÃO GERAL & PAINEL FINANCEIRO ================= */}
        {abaAtiva === "visao-geral" && !modoFinanceiro && (
          <div>
            {/* Cabeçalho */}
            <div style={styles.topHeaderRow}>
              <div>
                <h1 style={styles.pageTitle}>Visão geral</h1>
                <p style={styles.pageSubtitle}>
                  Acompanhe os resultados e a rotina do salão.
                </p>
              </div>

              <div style={styles.headerRightActions}>
                <span style={styles.dateStamp}>11 nov. 2026 • 09:00</span>
                <button
                  onClick={() => abrirFinanceiro()}
                  className="btn-burgundy"
                >
                  Ver Painel Financeiro →
                </button>
              </div>
            </div>

            {/* Barra de Filtros */}
            <div style={styles.filterCard}>
              <input
                type="date"
                aria-label="Data dos agendamentos"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                style={styles.filterInput}
                placeholder="Data"
              />
              <input
                type="text"
                value={filtroProfissional}
                onChange={(e) => setFiltroProfissional(e.target.value)}
                style={{ ...styles.filterInput, flex: 1 }}
                placeholder="Filtrar por profissional ou cliente..."
              />
              <button
                onClick={() => {
                  setFiltrosAplicados({
                    data: filtroData,
                    busca: filtroProfissional,
                  });
                  const resultados = filtrarAgenda(
                    agendamentos.map((ag) => ({
                      ...ag,
                      data: ag.data || "2026-11-11",
                    })),
                    filtroData,
                    filtroProfissional,
                  );
                  setAgendamentoSelecionado(resultados[0] || null);
                  setMotivoCancelamento("");
                }}
                style={styles.btnDark}
              >
                Aplicar filtros
              </button>
              <button
                onClick={() => {
                  setFiltroData("");
                  setFiltrosAplicados({ data: "", busca: "" });
                  setAgendamentoSelecionado(agendamentos[0] || null);
                  setMotivoCancelamento("");
                  setFiltroProfissional("");
                }}
                style={styles.btnText}
              >
                Limpar
              </button>
            </div>

            {/* 4 Cards de Métricas (KPIs) */}
            <div className="dashboard-kpis" style={styles.kpiGrid}>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Agendamentos</span>
                <strong style={styles.kpiValue}>{agendaFiltrada.length}</strong>
                <span style={styles.kpiSub}>no período selecionado</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Concluídos</span>
                <strong style={styles.kpiValue}>
                  {
                    agendaFiltrada.filter((ag) => ag.status === "Concluído")
                      .length
                  }
                </strong>
                <span style={styles.kpiSub}>no período selecionado</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Cancelados</span>
                <strong style={styles.kpiValue}>
                  {
                    agendaFiltrada.filter((ag) => ag.status === "Cancelado")
                      .length
                  }
                </strong>
                <span style={styles.kpiSub}>no período selecionado</span>
              </div>
              <div style={styles.kpiCard}>
                <span style={styles.kpiLabel}>Taxa de ocupação</span>
                <strong style={styles.kpiValue}>84%</strong>
                <span style={styles.kpiSub}>no período selecionado</span>
              </div>
            </div>

            {/* Gráficos Centrais (Barras + Ocupação por Profissional) */}
            <div className="dashboard-charts" style={styles.chartsGrid}>
              <div style={styles.panelCard}>
                <h3 style={styles.panelTitle}>
                  Gráfico de atendimentos por período
                </h3>
                <div style={styles.barChartContainer}>
                  {dadosGrafico.map((item) => (
                    <div key={item.mes} style={styles.barColumn}>
                      <div
                        style={{
                          ...styles.barFill,
                          height: `${item.altura * 1.6}px`,
                        }}
                      />
                      <span style={styles.barLabel}>{item.mes}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.panelCard}>
                <h3 style={styles.panelTitle}>Ocupação por profissional</h3>
                <div style={styles.occupationList}>
                  {funcionarios.map((f) => (
                    <div key={f.id} style={styles.occupationItem}>
                      <div style={styles.occupationHeader}>
                        <strong style={styles.occName}>{f.nome}</strong>
                        <span style={styles.occPercent}>{f.ocupacao}%</span>
                      </div>
                      <div style={styles.progressTrack}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${f.ocupacao}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agendamentos do Dia + Cancelamento */}
            <div className="dashboard-details" style={styles.bottomGrid}>
              <div style={styles.panelCard}>
                <div style={styles.panelHeaderRow}>
                  <h3 style={styles.panelTitle}>Agendamentos do período</h3>
                  <button
                    onClick={() => setAbaAtiva("agendamentos")}
                    style={styles.linkAction}
                  >
                    Ver agenda
                  </button>
                </div>

                <div className="dashboard-table-scroll">
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>HORA</th>
                        <th style={styles.th}>CLIENTE</th>
                        <th style={styles.th}>PROFISSIONAL</th>
                        <th style={styles.th}>SERVIÇO</th>
                        <th style={styles.th}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!agendaFiltrada.length && (
                        <tr>
                          <td colSpan="5" style={styles.td}>
                            Nenhum agendamento encontrado para estes filtros.
                          </td>
                        </tr>
                      )}
                      {agendaFiltrada.map((ag) => (
                        <tr
                          key={ag.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setAgendamentoSelecionado(ag);
                              setMotivoCancelamento("");
                            }
                          }}
                          onClick={() => {
                            setAgendamentoSelecionado(ag);
                            setMotivoCancelamento("");
                          }}
                          style={{
                            ...styles.tr,
                            backgroundColor:
                              agendamentoSelecionado?.id === ag.id
                                ? "var(--bg-cream-strong)"
                                : "#ffffff",
                          }}
                        >
                          <td style={styles.tdBold}>{ag.hora || ag.horario} às {horarioFinal(ag.hora || ag.horario, ag.duracao)}</td>
                          <td style={styles.tdBold}>{ag.cliente}</td>
                          <td style={styles.td}>{ag.profissional}</td>
                          <td style={styles.td}>{ag.servico}</td>
                          <td style={styles.td}>
                            <span style={getBadgeStyle(ag.status)}>
                              {ag.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card Lateral Cancelar Horário */}
              <div style={styles.panelCard}>
                <h3 style={styles.panelTitle}>Cancelar horário</h3>
                {agendamentoSelecionado ? (
                  <div>
                    <p style={styles.cancelMeta}>
                      <strong>{agendamentoSelecionado.cliente}</strong> •{" "}
                      {agendamentoSelecionado.hora}
                    </p>
                    <label style={styles.label}>Motivo do cancelamento *</label>
                    <textarea
                      rows="3"
                      placeholder="Informe o motivo"
                      value={motivoCancelamento}
                      onChange={(e) => setMotivoCancelamento(e.target.value)}
                      style={styles.textarea}
                    />
                    <span style={styles.hintText}>
                      Cancelamento demonstrativo, sem envio de mensagens.
                    </span>
                    <button
                      onClick={handleCancelarHorario}
                      disabled={["Concluído", "Cancelado"].includes(
                        agendamentoSelecionado.status,
                      )}
                      style={{
                        ...styles.btnDark,
                        width: "100%",
                        marginTop: "12px",
                      }}
                    >
                      Confirmar cancelamento
                    </button>
                  </div>
                ) : (
                  <p style={styles.pageSubtitle}>
                    Selecione um horário na tabela.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {abaAtiva === 'minha-agenda' && <DailyAgenda titulo="Minha agenda" profissional="Fred Santos" agendamentos={agendamentos} setAgendamentos={setAgendamentos} />}
        {abaAtiva === 'servicos' && <ServiceManager servicos={servicos} aoSalvar={aoSalvarServicos} funcionarios={funcionarios} />}
        {abaAtiva === 'bloqueios' && <div><h1 style={styles.pageTitle}>Bloqueios do salão</h1><p style={styles.pageSubtitle}>Feche um dia inteiro ou uma faixa de horários para todos os profissionais.</p><AgendaBlockManager agenda={agendamentos} bloqueios={bloqueios} aoAplicar={aoAplicarBloqueio} aoRemover={aoRemoverBloqueio} /></div>}
        {/* ================= 2. ABA AGENDAMENTOS ================= */}
        {abaAtiva === "agendamentos" && (
          <div>
            <div style={styles.topHeaderRow}>
              <div>
                <h1 style={styles.pageTitle}>Todos os Agendamentos</h1>
                <p style={styles.pageSubtitle}>
                  Gerencie a agenda completa de todos os profissionais do salão.
                </p>
              </div>
            </div>

            <div
              className="dashboard-details"
              style={{ ...styles.bottomGrid, marginTop: "24px" }}
            >
              <div style={styles.panelCard}>
                <div className="dashboard-table-scroll">
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>DATA</th>
                        <th style={styles.th}>HORÁRIO</th>
                        <th style={styles.th}>CLIENTE</th>
                        <th style={styles.th}>PROFISSIONAL</th>
                        <th style={styles.th}>SERVIÇO</th>
                        <th style={styles.th}>VALOR</th>
                        <th style={styles.th}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agendamentos.map((ag) => (
                        <tr
                          key={ag.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setAgendamentoSelecionado(ag);
                              setMotivoCancelamento("");
                            }
                          }}
                          onClick={() => {
                            setAgendamentoSelecionado(ag);
                            setMotivoCancelamento("");
                          }}
                          style={{
                            ...styles.tr,
                            backgroundColor:
                              agendamentoSelecionado?.id === ag.id
                                ? "var(--bg-cream-strong)"
                                : "#ffffff",
                          }}
                        >
                          <td style={styles.td}>{ag.data}</td>
                          <td style={styles.tdBold}>{ag.hora || ag.horario} às {horarioFinal(ag.hora || ag.horario, ag.duracao)}</td>
                          <td style={styles.tdBold}>{ag.cliente}</td>
                          <td style={styles.td}>{ag.profissional}</td>
                          <td style={styles.td}>{ag.servico}</td>
                          <td style={styles.td}>{ag.valor}</td>
                          <td style={styles.td}>
                            <span style={getBadgeStyle(ag.status)}>
                              {ag.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={styles.panelCard}>
                <h3 style={styles.panelTitle}>Detalhes do atendimento</h3>
                {agendamentoSelecionado && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <span style={styles.kpiLabel}>CLIENTE</span>
                      <strong>{agendamentoSelecionado.cliente}</strong>
                      <p style={styles.pageSubtitle}>
                        {agendamentoSelecionado.telefone}
                      </p>
                    </div>
                    <div>
                      <span style={styles.kpiLabel}>PROFISSIONAL</span>
                      <strong>{agendamentoSelecionado.profissional}</strong>
                    </div>
                    <div>
                      <span style={styles.kpiLabel}>SERVIÇO & VALOR</span>
                      <strong>
                        {agendamentoSelecionado.servico} (
                        {agendamentoSelecionado.valor})
                      </strong>
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid var(--border-warm)",
                        paddingTop: "12px",
                      }}
                    >
                      <label style={styles.label}>
                        Cancelar agendamento (Motivo *)
                      </label>
                      <input
                        type="text"
                        placeholder="Informe o motivo"
                        value={motivoCancelamento}
                        onChange={(e) => setMotivoCancelamento(e.target.value)}
                        style={{
                          ...styles.filterInput,
                          width: "100%",
                          marginBottom: "10px",
                        }}
                      />
                      <button
                        onClick={handleCancelarHorario}
                        disabled={["Concluído", "Cancelado"].includes(
                          agendamentoSelecionado.status,
                        )}
                        style={{ ...styles.btnDark, width: "100%" }}
                      >
                        Cancelar com motivo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. ABA CLIENTES ================= */}
        {abaAtiva === "clientes" && (
          <div>
            <div style={styles.topHeaderRow}>
              <div>
                <h1 style={styles.pageTitle}>Clientes</h1>
                <p style={styles.pageSubtitle}>
                  Encontre e acompanhe seus clientes.
                </p>
              </div>
            </div>

            <div style={styles.filterCard}>
              <input
                type="text"
                placeholder="Buscar por nome ou telefone"
                value={buscaCliente}
                onChange={(e) => setBuscaCliente(e.target.value)}
                style={{ ...styles.filterInput, flex: 1 }}
              />
              <select
                value={filtroStatusCliente}
                onChange={(e) => setFiltroStatusCliente(e.target.value)}
                style={styles.filterInput}
              >
                <option value="Todos">Todos os estados</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div style={styles.panelCard}>
              <div
                style={{
                  marginBottom: "14px",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                }}
              >
                {clientesFiltrados.length} clientes encontrados
              </div>

              <div className="dashboard-table-scroll">
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>CLIENTE</th>
                      <th style={styles.th}>TELEFONE</th>
                      <th style={styles.th}>E-MAIL</th>
                      <th style={styles.th}>ATEND.</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((c) => (
                      <tr
                        key={c.id}
                        className="admin-client-row"
                        onClick={() => abrirFinanceiro(c.nome)}
                        style={styles.tr}
                      >
                        <td style={styles.tdBold}>
                          <button
                            type="button"
                            className="admin-client-open"
                            aria-label={`Ver financeiro de ${c.nome}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirFinanceiro(c.nome);
                            }}
                          >
                            {c.nome}
                            <span>Ver financeiro →</span>
                          </button>
                        </td>
                        <td style={styles.td}>{c.telefone}</td>
                        <td style={styles.td}>{c.email}</td>
                        <td style={styles.td}>{c.atendimentos}</td>
                        <td style={styles.td}>
                          <span
                            style={
                              c.status === "Ativo"
                                ? styles.badgeGreen
                                : styles.badgeRed
                            }
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alternarStatusCliente(c.id);
                            }}
                            style={styles.linkAction}
                          >
                            {c.status === "Ativo" ? "Inativar" : "Reativar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. ABA FUNCIONÁRIOS (LISTA + CADASTRO) ================= */}
        {abaAtiva === "funcionarios" && !cadastrandoFuncionario && (
          <div>
            <div style={styles.topHeaderRow}>
              <div>
                <h1 style={styles.pageTitle}>Funcionários</h1>
                <p style={styles.pageSubtitle}>
                  Gerencie a equipe, especialidades e acessos do salão.
                </p>
              </div>

              <button
                onClick={() => {
                  setFuncionarioEditando(null);
                  setAvisoFuncionario("");
                  setCadastrandoFuncionario(true);
                }}
                className="btn-burgundy"
              >
                + Novo funcionário
              </button>
            </div>

            {avisoFuncionario && (
              <p className="employee-admin-notice" role="status">
                {avisoFuncionario}
              </p>
            )}
            <div style={{ ...styles.panelCard, marginTop: "24px" }}>
              <div className="dashboard-table-scroll">
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>PROFISSIONAL</th>
                      <th style={styles.th}>E-MAIL</th>
                      <th style={styles.th}>TELEFONE</th>
                      <th style={styles.th}>ESPECIALIDADES</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!funcionarios.length && (
                      <tr>
                        <td colSpan="6" style={styles.td}>
                          Nenhum funcionário cadastrado.
                        </td>
                      </tr>
                    )}
                    {funcionarios.map((f) => (
                      <tr key={f.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <img
                              src={f.avatar}
                              alt={f.nome}
                              style={styles.avatarSmall}
                            />
                            <div>
                              <strong style={{ display: "block" }}>
                                {f.nome}
                              </strong>
                              <span
                                style={{
                                  fontSize: "0.78rem",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {f.cargo}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>{f.email}</td>
                        <td style={styles.td}>{f.telefone}</td>
                        <td style={styles.td}>
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              flexWrap: "wrap",
                            }}
                          >
                            {f.especialidades.map((esp, idx) => (
                              <span key={idx} style={styles.espTag}>
                                {esp}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.badgeGreen}>{f.status}</span>
                        </td>
                        <td style={styles.td}>
                          <div className="employee-row-actions">
                            <button
                              type="button"
                              onClick={() => {
                                setFuncionarioEditando(f);
                                setCadastrandoFuncionario(true);
                                setAvisoFuncionario("");
                              }}
                            >
                              Editar / senha
                            </button>
                            <button
                              type="button"
                              onClick={() => setFuncionarioRemovendo(f)}
                            >
                              Remover
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === "funcionarios" && cadastrandoFuncionario && (
          <NewEmployeeForm
            key={funcionarioEditando?.id || "novo"}
            funcionarioInicial={funcionarioEditando}
            funcionarios={funcionarios}
            aoCancelar={() => setCadastrandoFuncionario(false)}
            aoCadastrar={(funcionario) => {
              setFuncionarios((atuais) =>
                funcionarioEditando
                  ? atuais.map((item) =>
                      item.id === funcionario.id ? funcionario : item,
                    )
                  : [...atuais, funcionario],
              );
              setAvisoFuncionario(
                funcionarioEditando
                  ? funcionario.redefinicaoSenhaEm !==
                    funcionarioEditando.redefinicaoSenhaEm
                    ? "Dados atualizados. A redefinição de senha foi simulada; ainda não existe autenticação real."
                    : "Dados do funcionário atualizados nesta sessão."
                  : "Funcionário adicionado nesta sessão.",
              );
              setFuncionarioEditando(null);
              setCadastrandoFuncionario(false);
            }}
          />
        )}

        {funcionarioRemovendo && (
          <RemoveEmployeeDialog
            funcionario={funcionarioRemovendo}
            aoCancelar={() => setFuncionarioRemovendo(null)}
            aoConfirmar={() => {
              setFuncionarios((atuais) =>
                atuais.filter((item) => item.id !== funcionarioRemovendo.id),
              );
              setAvisoFuncionario(
                "Funcionário removido da equipe nesta sessão.",
              );
              setFuncionarioRemovendo(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboardLayout: {
    display: "grid",
    gridTemplateColumns: "240px minmax(0, 1fr)",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "var(--bg-page)",
  },
  sidebar: {
    backgroundColor: "var(--espresso)",
    color: "#ffffff",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid var(--border-warm)",
  },
  sidebarSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sidebarCategory: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#b7d4f5",
    marginBottom: "12px",
    paddingLeft: "12px",
  },
  sidebarItem: {
    background: "none",
    border: "none",
    color: "#f2f3f5",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "0.92rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  sidebarItemActive: {
    backgroundColor: "var(--bg-cream)",
    color: "var(--espresso)",
    border: "none",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "0.92rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  sidebarFooter: {
    fontSize: "0.75rem",
    color: "#a9b1bb",
    paddingLeft: "12px",
  },
  mainContent: {
    padding: "32px 40px",
    overflowY: "auto",
  },
  topHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerRightActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  dateStamp: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    color: "var(--espresso)",
  },
  pageSubtitle: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  filterCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "12px",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "20px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  filterInput: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    fontSize: "0.88rem",
    color: "var(--espresso)",
    outline: "none",
  },
  btnDark: {
    backgroundColor: "var(--espresso)",
    color: "#ffffff",
    border: "none",
    padding: "11px 22px",
    borderRadius: "8px",
    fontSize: "0.86rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnText: {
    background: "none",
    border: "none",
    color: "var(--espresso)",
    fontSize: "0.86rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "22px",
  },
  kpiCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "14px",
    padding: "20px 22px",
    display: "flex",
    flexDirection: "column",
  },
  kpiLabel: {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: "var(--espresso)",
    marginBottom: "8px",
  },
  kpiValue: {
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "var(--espresso)",
    lineHeight: 1.1,
    marginBottom: "6px",
  },
  kpiSub: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1.55fr 1fr",
    gap: "20px",
    marginBottom: "22px",
  },
  panelCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "14px",
    padding: "22px",
  },
  panelHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  panelTitle: {
    fontSize: "0.96rem",
    fontWeight: 700,
    color: "var(--espresso)",
    marginBottom: "16px",
  },
  barChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "180px",
    paddingTop: "16px",
    gap: "8px",
  },
  barColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  barFill: {
    width: "100%",
    maxWidth: "34px",
    backgroundColor: "#2463a6",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.3s ease",
  },
  barLabel: {
    fontSize: "0.72rem",
    color: "var(--text-muted)",
  },
  occupationList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  occupationItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  occupationHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.84rem",
  },
  occName: {
    color: "var(--espresso)",
  },
  occPercent: {
    color: "var(--text-muted)",
    fontWeight: 600,
  },
  progressTrack: {
    width: "100%",
    height: "7px",
    backgroundColor: "var(--bg-cream)",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2463a6",
    borderRadius: "999px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1.8fr 0.9fr",
    gap: "20px",
    alignItems: "start",
  },
  linkAction: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHeaderRow: {
    backgroundColor: "var(--bg-cream)",
    borderBottom: "1px solid var(--border-warm)",
  },
  th: {
    padding: "12px 14px",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "var(--text-muted)",
  },
  tr: {
    borderBottom: "1px solid var(--border-warm)",
    cursor: "pointer",
  },
  td: {
    padding: "13px 14px",
    fontSize: "0.86rem",
    color: "var(--espresso)",
  },
  tdBold: {
    padding: "13px 14px",
    fontSize: "0.86rem",
    fontWeight: 700,
    color: "var(--espresso)",
  },
  badgeBlue: {
    backgroundColor: "#e1effe",
    color: "#1e429f",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.76rem",
    fontWeight: 600,
  },
  badgeOrange: {
    backgroundColor: "#fef3dc",
    color: "#8a580b",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.76rem",
    fontWeight: 600,
  },
  badgeGreen: {
    backgroundColor: "#e1f0e5",
    color: "#2e6b3e",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.76rem",
    fontWeight: 600,
  },
  badgeYellow: {
    backgroundColor: "#fef9c3",
    color: "#854d0e",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.76rem",
    fontWeight: 600,
  },
  badgeRed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "0.76rem",
    fontWeight: 600,
  },
  cancelMeta: {
    fontSize: "0.86rem",
    color: "var(--text-muted)",
    marginBottom: "12px",
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--espresso)",
    marginBottom: "6px",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    fontFamily: "inherit",
    fontSize: "0.86rem",
    marginBottom: "8px",
    resize: "vertical",
  },
  hintText: {
    display: "block",
    fontSize: "0.76rem",
    color: "var(--text-muted)",
  },
  avatarSmall: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  espTag: {
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "0.74rem",
    fontWeight: 600,
  },
};
