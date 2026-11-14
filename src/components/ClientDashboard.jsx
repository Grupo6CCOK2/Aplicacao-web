import { useState } from "react";
import "./ClientDashboard.css";

export default function ClientDashboard({
  aoIrParaAgendamento,
  aoSair,
  agendamentos,
  cancelarAgendamento,
  perfilCliente,
  aoSalvarPerfil,
  dependentes,
  setDependentes,
}) {
  const [abaAtiva, setAbaAtiva] = useState("agendamentos");

  // Estado do perfil do usuário editável
  const [nomeUsuario, setNomeUsuario] = useState(perfilCliente.nome);
  const [fotoPerfil, setFotoPerfil] = useState(perfilCliente.foto);
  const [telefone, setTelefone] = useState(perfilCliente.telefone);
  const [email, setEmail] = useState(perfilCliente.email);
  const [perfilSalvo, setPerfilSalvo] = useState(false);

  // Estado de Dependentes
  const [novoNomeDep, setNovoNomeDep] = useState("");
  const [novoParentesco, setNovoParentesco] = useState("Filho(a)");

  const adicionarDependente = (e) => {
    e.preventDefault();
    if (!novoNomeDep.trim()) return;

    setDependentes([
      ...dependentes,
      { id: Date.now(), nome: novoNomeDep, parentesco: novoParentesco },
    ]);
    setNovoNomeDep("");
  };

  const removerDependente = (id) => {
    setDependentes(dependentes.filter((dep) => dep.id !== id));
  };

  return (
    <div className="client-dashboard" style={styles.dashboardLayout}>
      {/* MENU LATERAL ESQUERDO */}
      <aside className="client-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarSection}>
          <span style={styles.sidebarCategory}>MINHA CONTA</span>
          <button
            aria-current={abaAtiva === "agendamentos" ? "page" : undefined}
            onClick={() => setAbaAtiva("agendamentos")}
            style={
              abaAtiva === "agendamentos"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Meus agendamentos
          </button>
          <button
            aria-current={abaAtiva === "perfil" ? "page" : undefined}
            onClick={() => setAbaAtiva("perfil")}
            style={
              abaAtiva === "perfil"
                ? styles.sidebarItemActive
                : styles.sidebarItem
            }
          >
            Perfil e dependentes
          </button>
        </div>

        <button onClick={aoSair} style={styles.sidebarLogout}>
          Sair da conta
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="client-content" style={styles.mainContent}>
        {/* ================= ABA 1: AGENDAMENTOS ================= */}
        {abaAtiva === "agendamentos" && (
          <div>
            <div className="client-header" style={styles.topHeaderRow}>
              <div>
                <span style={styles.kicker}>MINHA CONTA</span>
                <h1 style={styles.pageTitle}>Olá, {nomeUsuario}</h1>
                <p style={styles.pageSubtitle}>
                  Acompanhe seus horários agendados ou marque um novo
                  atendimento.
                </p>
              </div>

              <button onClick={aoIrParaAgendamento} className="btn-burgundy">
                + Novo agendamento
              </button>
            </div>

            <div
              className="client-card client-appointments"
              style={styles.card}
            >
              <div className="client-card-header">
                <h2 style={styles.cardHeading}>Meus agendamentos</h2>
                <span className="client-count">
                  {agendamentos.length}{" "}
                  {agendamentos.length === 1 ? "agendamento" : "agendamentos"}
                </span>
              </div>

              {agendamentos.length === 0 ? (
                <div style={styles.emptyBox}>
                  <p style={styles.emptyText}>
                    Você não possui agendamentos no momento.
                  </p>
                  <button onClick={aoIrParaAgendamento} style={styles.linkBtn}>
                    Fazer meu primeiro agendamento →
                  </button>
                </div>
              ) : (
                <div style={styles.listContainer}>
                  {agendamentos.map((item) => (
                    <div
                      key={item.id}
                      className="client-booking"
                      style={styles.bookingItem}
                    >
                      <div
                        className="client-booking-date"
                        aria-label={`Data: ${item.data}`}
                      >
                        <strong>{item.data.split("/")[0]}</strong>
                        <span>
                          {
                            [
                              "JAN",
                              "FEV",
                              "MAR",
                              "ABR",
                              "MAI",
                              "JUN",
                              "JUL",
                              "AGO",
                              "SET",
                              "OUT",
                              "NOV",
                              "DEZ",
                            ][Number(item.data.split("/")[1]) - 1]
                          }
                        </span>
                      </div>
                      <div style={styles.bookingInfo}>
                        <span style={styles.serviceTitle}>{item.servico}</span>
                        <span style={styles.bookingDetails}>
                          Profissional: <strong>{item.profissional}</strong>
                        </span>
                        <span style={styles.bookingDetails}>
                          {item.data} às {item.horario}
                        </span>
                      </div>

                      <strong className="client-booking-price">
                        {item.valor}
                      </strong>
                      <div
                        className="client-booking-actions"
                        style={styles.bookingActions}
                      >
                        <span
                          style={
                            item.status === "Confirmado"
                              ? styles.statusConfirmed
                              : styles.statusWaiting
                          }
                        >
                          {item.status}
                        </span>
                        <button
                          onClick={() => cancelarAgendamento(item.id)}
                          style={styles.cancelBtn}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ABA 2: MEU PERFIL E DEPENDENTES ================= */}
        {abaAtiva === "perfil" && (
          <div>
            <div className="client-header" style={styles.topHeaderRow}>
              <div>
                <span style={styles.kicker}>CONFIGURAÇÕES</span>
                <h1 style={styles.pageTitle}>Perfil e dependentes</h1>
                <p style={styles.pageSubtitle}>
                  Atualize sua foto, dados pessoais e gerencie seus dependentes.
                </p>
              </div>
            </div>

            <div className="client-profile-grid" style={styles.profileGrid}>
              {/* Card de Dados Pessoais e Foto */}
              <form
                className="client-card"
                style={styles.card}
                onChange={() => setPerfilSalvo(false)}
                onSubmit={(e) => {
                  e.preventDefault();
                  aoSalvarPerfil({
                    nome: nomeUsuario.trim(),
                    telefone: telefone.trim(),
                    email: email.trim(),
                    foto: fotoPerfil,
                  });
                  setPerfilSalvo(true);
                }}
              >
                <h2 style={styles.cardHeading}>Dados Pessoais</h2>

                <div className="client-avatar-row" style={styles.avatarEditRow}>
                  <img
                    src={fotoPerfil}
                    alt={nomeUsuario}
                    style={styles.bigAvatar}
                  />
                  <div style={{ flex: 1 }}>
                    <label htmlFor="client-photo" style={styles.label}>
                      Link da foto (URL)
                    </label>
                    <input
                      id="client-photo"
                      type="text"
                      value={fotoPerfil}
                      onChange={(e) => setFotoPerfil(e.target.value)}
                      className="auth-input"
                      placeholder="Cole o link da sua foto aqui"
                    />
                    <span style={styles.hintText}>
                      Dica: Você pode colar o link de qualquer imagem da
                      internet.
                    </span>
                  </div>
                </div>

                <div className="form-row-2" style={styles.fieldGroup}>
                  <div>
                    <label htmlFor="client-name" style={styles.label}>
                      Seu nome
                    </label>
                    <input
                      id="client-name"
                      required
                      pattern=".*\S.*"
                      type="text"
                      value={nomeUsuario}
                      onChange={(e) => setNomeUsuario(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="client-phone" style={styles.label}>
                      Telefone / WhatsApp
                    </label>
                    <input
                      id="client-phone"
                      required
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label htmlFor="client-email" style={styles.label}>
                    E-mail
                  </label>
                  <input
                    id="client-email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>

                <div style={{ marginTop: "20px" }}>
                  <button type="submit" className="btn-burgundy">
                    Salvar Alterações
                  </button>
                </div>
                {perfilSalvo && (
                  <p
                    role="status"
                    style={{ color: "var(--text-muted)", marginTop: "12px" }}
                  >
                    Alterações salvas nesta sessão.
                  </p>
                )}
              </form>

              {/* Card de Dependentes */}
              <div className="client-card" style={styles.card}>
                <h2 style={styles.cardHeading}>Gerenciar Dependentes</h2>
                <p style={styles.subtext}>
                  Cadastre dependentes para poder agendar horários em nome deles
                  na mesma conta.
                </p>

                {/* Lista de dependentes cadastrados */}
                <div style={styles.dependentList}>
                  {dependentes.length === 0 ? (
                    <p style={styles.emptyText}>
                      Nenhum dependente cadastrado.
                    </p>
                  ) : (
                    dependentes.map((dep) => (
                      <div
                        key={dep.id}
                        className="client-dependent-row"
                        style={styles.dependentRow}
                      >
                        <div>
                          <strong style={styles.depName}>{dep.nome}</strong>
                          <span style={styles.depParentesco}>
                            {" "}
                            • {dep.parentesco}
                          </span>
                        </div>
                        <button
                          onClick={() => removerDependente(dep.id)}
                          style={styles.removeDepBtn}
                        >
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Formulário para adicionar novo dependente */}
                <form onSubmit={adicionarDependente} style={styles.addDepForm}>
                  <h3 style={styles.smallHeading}>Adicionar novo dependente</h3>
                  <div className="form-row-2" style={{ marginBottom: "12px" }}>
                    <div>
                      <label
                        htmlFor="client-dependent-name"
                        style={styles.label}
                      >
                        Nome
                      </label>
                      <input
                        id="client-dependent-name"
                        type="text"
                        placeholder="Nome do dependente"
                        value={novoNomeDep}
                        onChange={(e) => setNovoNomeDep(e.target.value)}
                        className="auth-input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="client-dependent-relation"
                        style={styles.label}
                      >
                        Parentesco
                      </label>
                      <select
                        id="client-dependent-relation"
                        value={novoParentesco}
                        onChange={(e) => setNovoParentesco(e.target.value)}
                        className="auth-input"
                      >
                        <option value="Filho(a)">Filho(a)</option>
                        <option value="Cônjuge">Cônjuge</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ width: "100%" }}
                  >
                    + Adicionar Dependente
                  </button>
                </form>
              </div>
            </div>
          </div>
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
  sidebarLogout: {
    backgroundColor: "transparent",
    border: "1px solid rgba(247, 235, 225, 0.3)",
    color: "#f7ebe1",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "0.84rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    textTransform: "uppercase",
  },
  mainContent: {
    padding: "32px 40px",
    minWidth: 0,
  },
  topHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  kicker: {
    display: "inline-block",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: "var(--burgundy)",
    marginBottom: "4px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    color: "var(--espresso)",
  },
  pageSubtitle: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "14px",
    padding: "22px",
  },
  cardHeading: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "0.95rem",
    color: "var(--espresso)",
    marginBottom: "18px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "30px 0",
  },
  emptyText: {
    color: "var(--text-muted)",
    marginBottom: "12px",
    fontSize: "0.9rem",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.9rem",
    textDecoration: "underline",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  bookingItem: {
    backgroundColor: "var(--bg-page)",
    border: "1px solid var(--border-warm)",
    borderRadius: "12px",
    padding: "16px 20px",
    display: "grid",
    gridTemplateColumns: "64px minmax(0, 1fr) auto auto",
    alignItems: "center",
    gap: "20px",
  },
  bookingInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  serviceTitle: {
    fontSize: "1.02rem",
    fontWeight: 700,
    color: "var(--espresso)",
  },
  bookingDetails: {
    fontSize: "0.84rem",
    color: "var(--text-muted)",
  },
  bookingActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statusConfirmed: {
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontSize: "0.74rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "999px",
  },
  statusWaiting: {
    backgroundColor: "var(--gold)",
    color: "var(--espresso)",
    fontSize: "0.74rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "999px",
  },
  cancelBtn: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
    gap: "20px",
    marginTop: "22px",
    alignItems: "start",
  },
  avatarEditRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid var(--border-warm)",
  },
  bigAvatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--gold)",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "var(--espresso)",
    marginBottom: "6px",
  },
  hintText: {
    display: "block",
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  subtext: {
    fontSize: "0.86rem",
    color: "var(--text-muted)",
    marginBottom: "18px",
  },
  dependentList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "22px",
  },
  dependentRow: {
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    padding: "10px 14px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  depName: {
    fontSize: "0.9rem",
    color: "var(--espresso)",
  },
  depParentesco: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
  },
  removeDepBtn: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  addDepForm: {
    backgroundColor: "var(--bg-page)",
    border: "1px solid var(--border-warm)",
    padding: "16px",
    borderRadius: "10px",
  },
  smallHeading: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--espresso)",
    marginBottom: "12px",
  },
};
