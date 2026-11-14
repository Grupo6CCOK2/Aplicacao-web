import { useState } from "react";
import "./DashboardLayout.css";
import EmployeeProfile from "./EmployeeProfile";
import {
  dataLocal,
  diaSeguinte,
  filtrarAgenda,
  formatarData,
} from "../utils/agenda";

export default function EmployeeDashboard({
  funcionario,
  funcionarios,
  aoSalvarPerfil,
}) {
  const [abaAtiva, setAbaAtiva] = useState("agenda");

  const [dataSelecionada, setDataSelecionada] = useState(dataLocal);
  const [dataExemplo] = useState(dataLocal);
  const [erroCancelamento, setErroCancelamento] = useState("");
  // Lista simulada de clientes e próximos agendamentos
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: "Marina Costa",
      telefone: "(11) 98765-4321",
      email: "marina@email.com",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      horario: "09:00",
      servico: "Corte e finalização",
      valor: "R$ 85,00",
      observacao: "Cliente prefere atendimento com água com gás.",
      status: "Concluído",
    },
    {
      id: 2,
      nome: "Camila Alves",
      telefone: "(11) 98765-4321",
      email: "camila@email.com",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      horario: "10:00",
      servico: "Coloração e mechas",
      valor: "R$ 220,00",
      observacao: "Atenção aos detalhes na raiz.",
      status: "Em atendimento",
    },
    {
      id: 3,
      nome: "Ana Lima",
      telefone: "(11) 98765-4321",
      email: "ana@email.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      horario: "11:00",
      servico: "Tratamento capilar",
      valor: "R$ 150,00",
      observacao: "Primeira vez fazendo hidratação profunda.",
      status: "Confirmado",
    },
    {
      id: 4,
      nome: "Julia Rocha",
      telefone: "(11) 98765-4321",
      email: "julia@email.com",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
      horario: "13:00",
      servico: "Corte e finalização",
      valor: "R$ 90,00",
      observacao: "Trazer revista de penteados.",
      status: "Confirmado",
    },
  ]);

  // Cliente selecionado para detalhamento na barra lateral
  const [clienteSelecionado, setClienteSelecionado] = useState(clientes[1]);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  const agendaDoDia = filtrarAgenda(
    clientes.map((cliente) => ({ ...cliente, data: dataExemplo })),
    dataSelecionada,
  );
  const detalhes = agendaDoDia.find(
    (item) => item.id === clienteSelecionado?.id,
  );
  const mudarData = (data) => {
    if (!data) return;
    setDataSelecionada(data);
    setMotivoCancelamento("");
    setErroCancelamento("");
  };
  const cancelarComMotivo = () => {
    if (!detalhes || ["Concluído", "Cancelado"].includes(detalhes.status))
      return;
    if (!motivoCancelamento.trim()) {
      setErroCancelamento("Informe o motivo do cancelamento.");
      return;
    }
    setClientes((atuais) =>
      atuais.map((item) =>
        item.id === detalhes.id
          ? {
              ...item,
              status: "Cancelado",
              motivoCancelamento: motivoCancelamento.trim(),
            }
          : item,
      ),
    );
    setMotivoCancelamento("");
    setErroCancelamento("");
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Cancelado":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      case "Concluído":
        return styles.badgeGreen;
      case "Em atendimento":
        return styles.badgeOrange;
      default:
        return styles.badgeBlue;
    }
  };

  return (
    <div
      className="dashboard-layout employee-dashboard"
      style={styles.dashboardLayout}
    >
      {/* MENU LATERAL ESQUERDO */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarSection}>
          <span style={styles.sidebarCategory}>FUNCIONÁRIO</span>
          <button
            onClick={() => setAbaAtiva("agenda")}
            style={
              abaAtiva === "agenda"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Agenda
          </button>
          <button
            onClick={() => setAbaAtiva("clientes")}
            style={
              abaAtiva === "clientes"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Clientes
          </button>
          <button
            onClick={() => setAbaAtiva("perfil")}
            style={
              abaAtiva === "perfil"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Meu perfil
          </button>
        </div>

        <div style={styles.sidebarFooter}>
          <span style={styles.footerText}>FRED. • Gestão do salão</span>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="dashboard-content" style={styles.mainContent}>
        {abaAtiva === "agenda" && (
          <div className="dashboard-details" style={styles.agendaGrid}>
            {/* COLUNA CENTRAL: Lista de Agendamentos */}
            <div>
              <div style={styles.pageHeaderRow}>
                <div>
                  <h1 style={styles.pageTitle}>Agenda diária</h1>
                  <p style={styles.pageSubtitle}>
                    Seus atendimentos, organizados em um só lugar.
                  </p>
                </div>
                <div style={styles.dateToggleRow}>
                  <button
                    onClick={() => mudarData(dataLocal())}
                    style={styles.dateBtn}
                  >
                    Hoje
                  </button>
                  <input
                    type="date"
                    aria-label="Dia da agenda"
                    value={dataSelecionada}
                    onChange={(e) => mudarData(e.target.value)}
                    style={styles.dateBtn}
                  />
                  <button
                    onClick={() => mudarData(diaSeguinte(dataSelecionada))}
                    style={styles.dateBtn}
                  >
                    Próximo dia
                  </button>
                </div>
              </div>

              <div style={styles.tableCard}>
                <div className="dashboard-table-scroll">
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>HORÁRIO</th>
                        <th style={styles.th}>CLIENTE</th>
                        <th style={styles.th}>SERVIÇO</th>
                        <th style={styles.th}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!agendaDoDia.length && (
                        <tr>
                          <td colSpan="4" style={styles.td}>
                            Nenhum atendimento para esta data.
                          </td>
                        </tr>
                      )}
                      {agendaDoDia.map((item) => (
                        <tr
                          key={item.id}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setClienteSelecionado(item);
                              setMotivoCancelamento("");
                              setErroCancelamento("");
                            }
                          }}
                          onClick={() => {
                            setClienteSelecionado(item);
                            setMotivoCancelamento("");
                            setErroCancelamento("");
                          }}
                          style={{
                            ...styles.tr,
                            backgroundColor:
                              clienteSelecionado?.id === item.id
                                ? "var(--bg-cream-strong)"
                                : "#ffffff",
                          }}
                        >
                          <td style={styles.tdBold}>{item.horario}</td>
                          <td style={styles.td}>
                            <div style={styles.clientCell}>
                              <img
                                src={item.avatar}
                                alt={item.nome}
                                style={styles.clientAvatar}
                              />
                              <span style={styles.clientName}>{item.nome}</span>
                            </div>
                          </td>
                          <td style={styles.td}>{item.servico}</td>
                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.badge,
                                ...getStatusBadgeStyle(item.status),
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr style={styles.intervalRow}>
                        <td colSpan="4" style={styles.intervalText}>
                          12:00–13:00 • Intervalo de almoço
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: Detalhes do Atendimento */}
            <aside style={styles.detailsCard}>
              <h2 style={styles.detailsTitle}>Detalhes do atendimento</h2>

              {detalhes ? (
                <div>
                  <div style={styles.detailsHeader}>
                    <img
                      src={detalhes.avatar}
                      alt={detalhes.nome}
                      style={styles.detailsAvatar}
                    />
                    <div>
                      <h3 style={styles.detailsName}>{detalhes.nome}</h3>
                      <span style={styles.detailsPhone}>
                        {detalhes.telefone}
                      </span>
                    </div>
                  </div>

                  <div style={styles.divider} />

                  <div style={styles.detailGroup}>
                    <span style={styles.detailLabel}>HORÁRIO</span>
                    <strong style={styles.detailValue}>
                      {detalhes.horario}
                    </strong>
                  </div>

                  <div style={styles.detailGroup}>
                    <span style={styles.detailLabel}>SERVIÇO</span>
                    <strong style={styles.detailValue}>
                      {detalhes.servico}
                    </strong>
                  </div>

                  <div style={styles.detailGroup}>
                    <span style={styles.detailLabel}>VALOR</span>
                    <strong style={styles.detailValue}>{detalhes.valor}</strong>
                  </div>

                  <div style={styles.detailGroup}>
                    <span style={styles.detailLabel}>OBSERVAÇÃO</span>
                    <p style={styles.detailText}>{detalhes.observacao}</p>
                  </div>

                  <div style={styles.detailGroup}>
                    <span style={styles.detailLabel}>Status</span>
                    <div style={styles.statusBox}>{detalhes.status}</div>
                  </div>

                  <div style={styles.cancelBox}>
                    <span style={styles.cancelTitle}>Cancelar agendamento</span>
                    <label
                      htmlFor="employee-cancel-reason"
                      style={styles.labelMotivo}
                    >
                      Motivo *
                    </label>
                    <input
                      type="text"
                      id="employee-cancel-reason"
                      placeholder="Informe o motivo"
                      value={motivoCancelamento}
                      onChange={(e) => setMotivoCancelamento(e.target.value)}
                      style={styles.inputMotivo}
                    />
                    <button
                      disabled={["Concluído", "Cancelado"].includes(
                        detalhes.status,
                      )}
                      onClick={cancelarComMotivo}
                      style={styles.btnCancelOutline}
                    >
                      Cancelar com motivo
                    </button>
                    {erroCancelamento && (
                      <p
                        role="alert"
                        style={{ color: "var(--burgundy)", marginTop: "8px" }}
                      >
                        {erroCancelamento}
                      </p>
                    )}
                    {detalhes.motivoCancelamento && (
                      <p style={styles.detailText}>
                        Motivo: {detalhes.motivoCancelamento}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>
                  Selecione um agendamento de {formatarData(dataSelecionada)} na
                  lista.
                </p>
              )}
            </aside>
          </div>
        )}

        {abaAtiva === "clientes" && (
          <div>
            <h1 style={styles.pageTitle}>Meus Clientes</h1>
            <p style={styles.pageSubtitle}>
              Histórico e cadastros vinculados aos seus atendimentos.
            </p>
            {/* Tabela simplificada de clientes */}
            <div style={{ ...styles.tableCard, marginTop: "24px" }}>
              <div className="dashboard-table-scroll">
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.th}>CLIENTE</th>
                      <th style={styles.th}>TELEFONE</th>
                      <th style={styles.th}>E-MAIL</th>
                      <th style={styles.th}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c) => (
                      <tr key={c.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={styles.clientCell}>
                            <img
                              src={c.avatar}
                              alt={c.nome}
                              style={styles.clientAvatar}
                            />
                            <span style={styles.clientName}>{c.nome}</span>
                          </div>
                        </td>
                        <td style={styles.td}>{c.telefone}</td>
                        <td style={styles.td}>{c.email}</td>
                        <td style={styles.td}>
                          <span style={styles.badgeGreen}>Ativo</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {abaAtiva === "perfil" && (
          <EmployeeProfile
            key={funcionario?.id || "vazio"}
            funcionario={funcionario}
            funcionarios={funcionarios}
            aoSalvar={aoSalvarPerfil}
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
    color: "var(--gold)",
    marginBottom: "12px",
    paddingLeft: "12px",
  },
  sidebarItem: {
    background: "none",
    border: "none",
    color: "#f7ebe1",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "0.92rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
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
    color: "#b8aba6",
    paddingLeft: "12px",
  },
  mainContent: {
    padding: "36px 40px",
    overflowY: "auto",
  },
  agendaGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 0.9fr",
    gap: "32px",
    alignItems: "start",
  },
  pageHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.1rem",
    color: "var(--espresso)",
    marginBottom: "4px",
  },
  pageSubtitle: {
    fontSize: "0.92rem",
    color: "var(--text-muted)",
  },
  dateToggleRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  dateBtn: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--espresso)",
    cursor: "pointer",
  },
  dateBtnActive: {
    backgroundColor: "var(--espresso)",
    color: "#ffffff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(35, 20, 18, 0.04)",
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
    padding: "14px 18px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
  },
  tr: {
    borderBottom: "1px solid var(--border-warm)",
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
  td: {
    padding: "16px 18px",
    fontSize: "0.9rem",
    color: "var(--espresso)",
  },
  tdBold: {
    padding: "16px 18px",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--espresso)",
  },
  clientCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  clientAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  clientName: {
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  badge: {
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  badgeGreen: {
    backgroundColor: "#e1f0e5",
    color: "#2e6b3e",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  badgeOrange: {
    backgroundColor: "#fef3dc",
    color: "#8a580b",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  badgeBlue: {
    backgroundColor: "#e1effe",
    color: "#1e429f",
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: 600,
  },
  intervalRow: {
    backgroundColor: "var(--bg-cream-strong)",
  },
  intervalText: {
    padding: "12px 18px",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--espresso)",
  },
  detailsCard: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "var(--radius-lg)",
    padding: "24px 26px",
    boxShadow: "0 4px 16px rgba(35, 20, 18, 0.04)",
  },
  detailsTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.35rem",
    color: "var(--espresso)",
    marginBottom: "20px",
  },
  detailsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },
  detailsAvatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  detailsName: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--espresso)",
  },
  detailsPhone: {
    fontSize: "0.84rem",
    color: "var(--text-muted)",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--border-warm)",
    margin: "16px 0",
  },
  detailGroup: {
    marginBottom: "14px",
  },
  detailLabel: {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--text-muted)",
    marginBottom: "2px",
  },
  detailValue: {
    fontSize: "0.94rem",
    color: "var(--espresso)",
  },
  detailText: {
    fontSize: "0.9rem",
    color: "var(--text-main)",
    lineHeight: 1.4,
  },
  statusBox: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-page)",
    fontSize: "0.9rem",
    color: "var(--espresso)",
    fontWeight: 600,
    marginTop: "4px",
  },
  cancelBox: {
    marginTop: "24px",
    paddingTop: "20px",
    borderTop: "1px solid var(--border-warm)",
  },
  cancelTitle: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "var(--espresso)",
    marginBottom: "12px",
  },
  labelMotivo: {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--espresso)",
    marginBottom: "6px",
  },
  inputMotivo: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    fontSize: "0.88rem",
    marginBottom: "12px",
    outline: "none",
  },
  btnCancelOutline: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid var(--burgundy)",
    color: "var(--burgundy)",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "0.84rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};
