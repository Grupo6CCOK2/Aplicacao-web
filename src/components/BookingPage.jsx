import { useState } from "react";
import { dataLocal, horarioDisponivel } from "../utils/agenda";

const servicosDisponiveis = [
  {
    titulo: "Corte Masculino",
    duracao: "45 min",
    preco: "R$ 80,00",
    profissional: "Fred",
    cargo: "Barbeiro Master",
    iniciais: "FR",
  },
  {
    titulo: "Barba e Acabamento",
    duracao: "30 min",
    preco: "R$ 50,00",
    profissional: "Fred",
    cargo: "Barbeiro Master",
    iniciais: "FR",
  },
  {
    titulo: "Combo Corte + Barba",
    duracao: "75 min",
    preco: "R$ 115,00",
    profissional: "Fred",
    cargo: "Barbeiro Master",
    iniciais: "FR",
  },
  {
    titulo: "Corte Feminino",
    duracao: "60 min",
    preco: "R$ 120,00",
    profissional: "Carla Soares",
    cargo: "Cortes e Finalização",
    iniciais: "CS",
  },
  {
    titulo: "Penteado Social",
    duracao: "90 min",
    preco: "R$ 190,00",
    profissional: "Carla Soares",
    cargo: "Cortes e Finalização",
    iniciais: "CS",
  },
  {
    titulo: "Escova Modelada",
    duracao: "45 min",
    preco: "R$ 75,00",
    profissional: "Carla Soares",
    cargo: "Cortes e Finalização",
    iniciais: "CS",
  },
  {
    titulo: "Coloração Premium",
    duracao: "120 min",
    preco: "R$ 280,00",
    profissional: "Ana Oliveira",
    cargo: "Colorista",
    iniciais: "AO",
  },
  {
    titulo: "Hidratação & Reconstrução",
    duracao: "50 min",
    preco: "R$ 110,00",
    profissional: "Ana Oliveira",
    cargo: "Colorista",
    iniciais: "AO",
  },
  {
    titulo: "Luzes & Mechas",
    duracao: "150 min",
    preco: "R$ 340,00",
    profissional: "Ana Oliveira",
    cargo: "Colorista",
    iniciais: "AO",
  },
];

const horariosGrade = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:30",
];

export default function BookingPage({
  servicoInicial,
  meusAgendamentos,
  aoAdicionarAgendamento,
  aoCancelarAgendamento,
}) {
  const [servicoSelecionado, setServicoSelecionado] = useState(
    servicoInicial || "Corte Masculino",
  );
  const [indiceMes, setIndiceMes] = useState(0);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const [erro, setErro] = useState("");
  const [mesBase] = useState(() => new Date());
  const dadosServico =
    servicosDisponiveis.find((s) => s.titulo === servicoSelecionado) ||
    servicosDisponiveis[0];

  const mesesConfig = Array.from({ length: 12 }, (_, offset) => {
    const inicio = new Date(
      mesBase.getFullYear(),
      mesBase.getMonth() + offset,
      1,
    );
    const totalDias = new Date(
      inicio.getFullYear(),
      inicio.getMonth() + 1,
      0,
    ).getDate();
    return {
      nome: inicio.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      }),
      ano: inicio.getFullYear(),
      mesNumero: String(inicio.getMonth() + 1).padStart(2, "0"),
      espacosVaziosInicio: (inicio.getDay() + 6) % 7,
      totalDias,
      diasDisponiveis: Array.from(
        { length: totalDias },
        (_, i) => i + 1,
      ).filter((dia) => {
        const data = dataLocal(
          new Date(inicio.getFullYear(), inicio.getMonth(), dia),
        );
        return horariosGrade.some((hora) =>
          horarioDisponivel(data, hora, dadosServico, meusAgendamentos),
        );
      }),
    };
  });

  const mesAtual = mesesConfig[indiceMes];

  const dataFormatada = diaSelecionado
    ? `${String(diaSelecionado).padStart(2, "0")}/${mesAtual.mesNumero}/${mesAtual.ano}`
    : null;

  const etapaAtual = !diaSelecionado || !horarioSelecionado ? 2 : 3;
  const dataISO = diaSelecionado
    ? `${mesAtual.ano}-${mesAtual.mesNumero}-${String(diaSelecionado).padStart(2, "0")}`
    : "";
  const prontoParaConfirmar = Boolean(
    dataISO &&
    horarioSelecionado &&
    horarioDisponivel(
      dataISO,
      horarioSelecionado,
      dadosServico,
      meusAgendamentos,
    ),
  );

  const confirmarAgendamento = () => {
    if (!prontoParaConfirmar) {
      setErro("Este horário não está disponível. Escolha outro.");
      return;
    }
    setErro("");

    const novo = {
      id: crypto.randomUUID(),
      duracao: dadosServico.duracao,
      servico: dadosServico.titulo,
      profissional: dadosServico.profissional,
      data: dataFormatada,
      horario: horarioSelecionado,
      valor: dadosServico.preco,
      status: "Confirmado",
    };

    aoAdicionarAgendamento(novo);
    setDiaSelecionado(null);
    setHorarioSelecionado(null);
    setModalAberto(true);
  };

  const cancelarAgendamento = (id) => {
    aoCancelarAgendamento(id);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Faixa Superior */}
      <section style={styles.topHeader}>
        <div className="container" style={styles.topHeaderRow}>
          <div>
            <span style={styles.kicker}>UM TEMPO PARA VOCÊ</span>
            <h1 style={styles.pageTitle}>Agendar atendimento</h1>
            <p style={styles.pageSubtitle}>
              Escolha o serviço, seu especialista e o melhor horário sem filas.
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            style={styles.myBookingsBtn}
          >
            <span>📅 Meus Agendamentos</span>
            <span style={styles.countBadge}>{meusAgendamentos.length}</span>
          </button>
        </div>

        {/* Barra de Progresso das 3 Etapas */}
        <div className="container" style={styles.stepperRow}>
          <div style={{ ...styles.stepItem, ...styles.stepDone }}>
            <span style={styles.stepCircleDone}>✓</span>
            <div>
              <strong style={styles.stepTitle}>Profissional e Serviço</strong>
              <span style={styles.stepDesc}>Escolha quem cuida de você</span>
            </div>
          </div>

          <div
            style={{
              ...styles.stepItem,
              ...(etapaAtual >= 2 ? styles.stepActive : {}),
            }}
          >
            <span
              style={
                etapaAtual === 3
                  ? styles.stepCircleDone
                  : styles.stepCircleActive
              }
            >
              {etapaAtual === 3 ? "✓" : "2"}
            </span>
            <div>
              <strong style={styles.stepTitle}>Data e Horário</strong>
              <span style={styles.stepDesc}>Encontre seu melhor horário</span>
            </div>
          </div>

          <div
            style={{
              ...styles.stepItem,
              ...(etapaAtual === 3 ? styles.stepActive : {}),
            }}
          >
            <span
              style={
                etapaAtual === 3
                  ? styles.stepCircleActive
                  : styles.stepCircleIdle
              }
            >
              3
            </span>
            <div>
              <strong style={styles.stepTitle}>Confirmação</strong>
              <span style={styles.stepDesc}>Revise e confirme</span>
            </div>
          </div>
        </div>
      </section>

      {/* Corpo Principal em 3 Colunas */}
      <section style={styles.mainSection}>
        <div className="container booking-grid">
          {/* ==================== ETAPA 1: SERVIÇO E PROFISSIONAL ==================== */}
          <div style={styles.card}>
            <span style={styles.stepTag}>ETAPA 1</span>
            <h2 style={styles.cardHeading}>Serviço e especialista</h2>

            <label style={styles.label}>Selecione o serviço</label>
            <select
              value={servicoSelecionado}
              onChange={(e) => {
                setServicoSelecionado(e.target.value);
                setDiaSelecionado(null);
                setErro("");
                setHorarioSelecionado(null);
              }}
              className="auth-input"
              style={{ marginBottom: "20px", fontWeight: 600 }}
            >
              {servicosDisponiveis.map((srv) => (
                <option key={srv.titulo} value={srv.titulo}>
                  {srv.titulo} — {srv.preco}
                </option>
              ))}
            </select>

            <label style={styles.label}>Profissional responsável</label>
            <div style={styles.specialistCard}>
              <div style={styles.avatarCircle}>{dadosServico.iniciais}</div>

              <div style={{ flex: 1 }}>
                <strong style={styles.specialistName}>
                  {dadosServico.profissional}
                </strong>
                <span style={styles.specialistRole}>{dadosServico.cargo}</span>
                <span style={styles.activePill}>Disponível</span>
              </div>

              <span style={styles.checkMark}>✓</span>
            </div>

            <p style={styles.helperNote}>
              O especialista é selecionado automaticamente conforme a
              especialidade do serviço escolhido.
            </p>
          </div>

          {/* ==================== ETAPA 2: DATA E HORÁRIO ==================== */}
          <div style={{ ...styles.card, ...styles.cardHighlighted }}>
            <span style={styles.stepTag}>ETAPA 2</span>
            <h2 style={styles.cardHeading}>Escolha data e horário</h2>

            {/* Cabeçalho do Calendário */}
            <div style={styles.calendarHeader}>
              <button
                type="button"
                disabled={indiceMes === 0}
                onClick={() => {
                  setIndiceMes((mes) => mes - 1);
                  setDiaSelecionado(null);
                  setHorarioSelecionado(null);
                }}
                style={
                  indiceMes === 0
                    ? styles.monthArrowDisabled
                    : styles.monthArrow
                }
              >
                ‹
              </button>

              <strong style={styles.monthTitle}>{mesAtual.nome}</strong>

              <button
                type="button"
                disabled={indiceMes === mesesConfig.length - 1}
                onClick={() => {
                  setIndiceMes((mes) => mes + 1);
                  setDiaSelecionado(null);
                  setHorarioSelecionado(null);
                }}
                style={
                  indiceMes === mesesConfig.length - 1
                    ? styles.monthArrowDisabled
                    : styles.monthArrow
                }
              >
                ›
              </button>
            </div>

            {/* Dias da semana */}
            <div className="calendar-days-grid" style={{ marginBottom: "8px" }}>
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                <span key={d} style={styles.weekDayLabel}>
                  {d}
                </span>
              ))}
            </div>

            {/* Grade de dias do mês */}
            <div className="calendar-days-grid">
              {Array.from({ length: mesAtual.espacosVaziosInicio }).map(
                (_, idx) => (
                  <div key={`empty-${idx}`} />
                ),
              )}

              {Array.from({ length: mesAtual.totalDias }).map((_, idx) => {
                const dia = idx + 1;
                const disponivel = mesAtual.diasDisponiveis.includes(dia);
                const selecionado = diaSelecionado === dia;

                let estiloDia = styles.dayDisabled;
                if (selecionado) estiloDia = styles.daySelected;
                else if (disponivel) estiloDia = styles.dayAvailable;

                return (
                  <button
                    key={dia}
                    type="button"
                    disabled={!disponivel}
                    onClick={() => {
                      setDiaSelecionado(dia);
                      setHorarioSelecionado(null);
                    }}
                    style={estiloDia}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>

            {/* Horários Disponíveis */}
            <div style={styles.slotsSection}>
              <strong style={styles.slotsHeading}>Horários disponíveis</strong>
              {!diaSelecionado ? (
                <p style={styles.slotsHint}>
                  Selecione uma data destacada acima para ver os horários.
                </p>
              ) : (
                <div className="time-slots-grid" style={{ marginTop: "12px" }}>
                  {horariosGrade.map((hora) => {
                    const ativo = horarioSelecionado === hora;
                    const disponivel = horarioDisponivel(
                      dataISO,
                      hora,
                      dadosServico,
                      meusAgendamentos,
                    );
                    return (
                      <button
                        key={hora}
                        type="button"
                        disabled={!disponivel}
                        onClick={() => setHorarioSelecionado(hora)}
                        style={{
                          ...(ativo ? styles.slotBtnSelected : styles.slotBtn),
                          ...(!disponivel
                            ? { opacity: 0.4, cursor: "not-allowed" }
                            : {}),
                        }}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              )}

              <span style={styles.advanceNote}>
                Agende com pelo menos 2 horas de antecedência.
              </span>
            </div>
          </div>

          {/* ==================== ETAPA 3: RESUMO ==================== */}
          <div style={styles.card}>
            <span style={styles.stepTag}>ETAPA 3</span>
            <h2 style={styles.cardHeading}>Resumo do agendamento</h2>

            <div style={styles.scissorsBadge}>✂️</div>

            <div style={styles.summaryList}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Profissional</span>
                <strong style={styles.summaryValue}>
                  {dadosServico.profissional}
                </strong>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Serviço</span>
                <strong style={styles.summaryValue}>
                  {dadosServico.titulo}
                </strong>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Data</span>
                <strong
                  style={
                    dataFormatada
                      ? styles.summaryValue
                      : styles.summaryPlaceholder
                  }
                >
                  {dataFormatada || "Selecione"}
                </strong>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Horário</span>
                <strong
                  style={
                    horarioSelecionado
                      ? styles.summaryValue
                      : styles.summaryPlaceholder
                  }
                >
                  {horarioSelecionado || "Selecione"}
                </strong>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Duração</span>
                <strong style={styles.summaryValue}>
                  {dadosServico.duracao}
                </strong>
              </div>
            </div>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Valor estimado</span>
              <strong style={styles.totalPrice}>{dadosServico.preco}</strong>
            </div>

            <button
              type="button"
              disabled={!prontoParaConfirmar}
              onClick={confirmarAgendamento}
              style={
                prontoParaConfirmar
                  ? styles.confirmBtnActive
                  : styles.confirmBtnDisabled
              }
            >
              Confirmar Agendamento ✓
            </button>

            {erro && (
              <p
                role="alert"
                style={{ color: "var(--burgundy)", marginTop: "12px" }}
              >
                {erro}
              </p>
            )}
            <p style={styles.footerInfo}>
              O horário fica reservado imediatamente após a confirmação.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== MODAL: MEUS AGENDAMENTOS ==================== */}
      {modalAberto && (
        <div style={styles.modalBackdrop} onClick={() => setModalAberto(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <span style={styles.kicker}>HISTÓRICO E RESERVAS</span>
                <h3 style={styles.modalTitle}>Meus agendamentos</h3>
              </div>

              <button
                onClick={() => setModalAberto(false)}
                style={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>

            {meusAgendamentos.length === 0 ? (
              <p style={styles.emptyModalText}>
                Você ainda não possui horários agendados.
              </p>
            ) : (
              <div style={styles.bookingsList}>
                {meusAgendamentos.map((ag) => {
                  const isConfirmado = ag.status === "Confirmado";
                  return (
                    <div key={ag.id} style={styles.bookingItem}>
                      <div>
                        <strong style={styles.bookingService}>
                          {ag.servico}
                        </strong>
                        <span style={styles.bookingDetails}>
                          {ag.profissional} • {ag.data} às {ag.horario} •{" "}
                          {ag.valor}
                        </span>
                      </div>

                      <div style={styles.bookingActions}>
                        <span
                          style={
                            isConfirmado
                              ? styles.pillConfirmed
                              : styles.pillCompleted
                          }
                        >
                          {ag.status}
                        </span>

                        {isConfirmado && (
                          <button
                            onClick={() => cancelarAgendamento(ag.id)}
                            style={styles.cancelLink}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: "var(--bg-page)",
    minHeight: "calc(100vh - 80px)",
  },
  topHeader: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid var(--border-warm)",
    padding: "52px 0 0",
  },
  topHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "28px",
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
    fontSize: "2.35rem",
    color: "var(--espresso)",
    lineHeight: 1.15,
  },
  pageSubtitle: {
    fontSize: "0.96rem",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  myBookingsBtn: {
    backgroundColor: "#ffffff",
    color: "var(--espresso)",
    border: "1.5px solid var(--espresso)",
    padding: "11px 18px",
    borderRadius: "10px",
    fontSize: "0.84rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
  },
  countBadge: {
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontSize: "0.75rem",
    padding: "2px 8px",
    borderRadius: "999px",
  },
  stepperRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "3px solid transparent",
  },
  stepDone: {
    borderBottomColor: "var(--gold)",
  },
  stepActive: {
    borderBottomColor: "var(--burgundy)",
  },
  stepCircleDone: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "var(--gold)",
    color: "var(--espresso)",
    fontWeight: 700,
    fontSize: "0.82rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepCircleActive: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "0.82rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepCircleIdle: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    color: "var(--text-muted)",
    fontWeight: 700,
    fontSize: "0.82rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepTitle: {
    display: "block",
    fontSize: "0.88rem",
    color: "var(--espresso)",
  },
  stepDesc: {
    display: "block",
    fontSize: "0.76rem",
    color: "var(--text-muted)",
  },
  mainSection: {
    padding: "36px 0 60px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-warm)",
    borderRadius: "var(--radius-lg)",
    padding: "26px",
    boxShadow: "0 8px 24px rgba(35, 20, 18, 0.04)",
  },
  cardHighlighted: {
    border: "1.5px solid var(--burgundy)",
    boxShadow: "0 12px 30px rgba(142, 36, 56, 0.08)",
  },
  stepTag: {
    display: "inline-block",
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "var(--burgundy)",
    marginBottom: "4px",
  },
  cardHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.45rem",
    color: "var(--espresso)",
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.84rem",
    fontWeight: 600,
    color: "var(--espresso)",
    marginBottom: "8px",
  },
  specialistCard: {
    backgroundColor: "var(--bg-cream)",
    border: "1.5px solid var(--gold)",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "14px",
  },
  avatarCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    backgroundColor: "var(--espresso)",
    color: "var(--gold)",
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  specialistName: {
    display: "block",
    fontSize: "0.98rem",
    color: "var(--espresso)",
  },
  specialistRole: {
    display: "block",
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    marginBottom: "5px",
  },
  activePill: {
    display: "inline-block",
    backgroundColor: "#ffffff",
    border: "1px solid var(--gold)",
    color: "var(--espresso)",
    fontSize: "0.68rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "999px",
  },
  checkMark: {
    color: "var(--burgundy)",
    fontWeight: 700,
    fontSize: "1.1rem",
  },
  helperNote: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  monthTitle: {
    fontSize: "0.98rem",
    color: "var(--espresso)",
  },
  monthArrow: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-cream)",
    color: "var(--espresso)",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  monthArrowDisabled: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-page)",
    color: "#c8bab5",
    fontSize: "1.2rem",
    cursor: "not-allowed",
  },
  weekDayLabel: {
    textAlign: "center",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--text-muted)",
  },
  dayDisabled: {
    height: "38px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#f5efea",
    color: "#bfb2ad",
    fontSize: "0.85rem",
    cursor: "not-allowed",
  },
  dayAvailable: {
    height: "38px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-cream)",
    color: "var(--espresso)",
    fontSize: "0.86rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  daySelected: {
    height: "38px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontSize: "0.86rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(142, 36, 56, 0.25)",
  },
  slotsSection: {
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid var(--border-warm)",
  },
  slotsHeading: {
    display: "block",
    fontSize: "0.92rem",
    color: "var(--espresso)",
    marginBottom: "4px",
  },
  slotsHint: {
    fontSize: "0.84rem",
    color: "var(--text-muted)",
    marginBottom: "12px",
  },
  slotBtn: {
    padding: "9px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-page)",
    color: "var(--espresso)",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  slotBtnSelected: {
    padding: "9px",
    borderRadius: "8px",
    border: "1px solid var(--gold)",
    backgroundColor: "var(--gold)",
    color: "var(--espresso)",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  advanceNote: {
    display: "block",
    fontSize: "0.76rem",
    color: "var(--text-muted)",
    marginTop: "14px",
  },
  scissorsBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    marginBottom: "18px",
  },
  summaryList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "1px solid var(--border-warm)",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
  },
  summaryLabel: {
    color: "var(--text-muted)",
  },
  summaryValue: {
    color: "var(--espresso)",
  },
  summaryPlaceholder: {
    color: "var(--burgundy)",
    fontWeight: 600,
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0 20px",
  },
  totalLabel: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--espresso)",
  },
  totalPrice: {
    fontSize: "1.35rem",
    color: "var(--burgundy)",
  },
  confirmBtnDisabled: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#dfd5cf",
    color: "#8c7e7a",
    fontSize: "0.84rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "not-allowed",
  },
  confirmBtnActive: {
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontSize: "0.84rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(142, 36, 56, 0.25)",
  },
  footerInfo: {
    textAlign: "center",
    fontSize: "0.78rem",
    color: "var(--text-muted)",
    marginTop: "12px",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(35, 20, 18, 0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 200,
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-warm)",
    borderTop: "4px solid var(--gold)",
    width: "100%",
    maxWidth: "580px",
    padding: "28px 32px",
    boxShadow: "0 24px 48px rgba(35, 20, 18, 0.22)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.65rem",
    color: "var(--espresso)",
  },
  closeModalBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "1px solid var(--border-warm)",
    backgroundColor: "var(--bg-cream)",
    color: "var(--espresso)",
    fontWeight: 700,
    cursor: "pointer",
  },
  emptyModalText: {
    color: "var(--text-muted)",
    textAlign: "center",
    padding: "24px 0",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "340px",
    overflowY: "auto",
  },
  bookingItem: {
    backgroundColor: "var(--bg-cream)",
    border: "1px solid var(--border-warm)",
    borderRadius: "12px",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  bookingService: {
    display: "block",
    fontSize: "0.98rem",
    color: "var(--espresso)",
    marginBottom: "2px",
  },
  bookingDetails: {
    fontSize: "0.82rem",
    color: "var(--text-muted)",
  },
  bookingActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  pillConfirmed: {
    backgroundColor: "var(--burgundy)",
    color: "#ffffff",
    fontSize: "0.74rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "999px",
  },
  pillCompleted: {
    backgroundColor: "var(--espresso)",
    color: "var(--gold)",
    fontSize: "0.74rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "999px",
  },
  cancelLink: {
    background: "none",
    border: "none",
    color: "var(--burgundy)",
    fontSize: "0.78rem",
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
  },
};
