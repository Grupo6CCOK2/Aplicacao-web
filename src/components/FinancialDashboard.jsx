import { useState } from "react";
import "./FinancialDashboard.css";
import { initialVisits, services } from "../data/financialDemo";
import { money, sum, dateLabel, initials } from "../utils/finance";
import { Metric, RevenueChart, Distribution } from "./FinancialCharts";
export default function FinancialDashboard({
  usuarioLogado,
  clienteInicial = null,
  aoVoltarClientes,
}) {
  const [client, setClient] = useState(clienteInicial);
  const [month, setMonth] = useState("2026-10");
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [payment, setPayment] = useState("");
  const [sort, setSort] = useState("desc");
  const [showAll, setShowAll] = useState(false);
  const rows = initialVisits.filter(
    (row) => row.date.startsWith(month) && (!client || row.client === client),
  );
  const total = sum(rows);
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = rows
    .filter(
      (row) =>
        normalize(
          `${row.client} ${row.service} ${row.professional} ${row.id}`,
        ).includes(normalize(query)) &&
        (!service || row.category === service) &&
        (!payment || row.payment === payment),
    )
    .sort(
      (a, b) =>
        (sort === "desc" ? -1 : 1) *
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    );
  const displayed = showAll || client ? filtered : filtered.slice(0, 6);
  const topService = services
    .map((name) => ({
      name,
      total: sum(rows.filter((row) => row.category === name)),
    }))
    .sort((a, b) => b.total - a.total)[0];
  const endDate = `${month}-${new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate()}`;
  const changeClient = (name) => {
    setClient(name);
    setQuery("");
    setService("");
    setPayment("");
    setShowAll(false);
  };
  const exportCsv = () => {
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const content = [
      [
        "Cliente",
        "Data",
        "Hora",
        "Serviço",
        "Profissional",
        "Pagamento",
        "Valor",
      ],
      ...filtered.map((row) => [
        row.client,
        dateLabel(row.date),
        row.time,
        row.service,
        row.professional,
        row.payment,
        row.amount.toFixed(2).replace(".", ","),
      ]),
    ]
      .map((row) => row.map(escape).join(";"))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["﻿", content], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `financeiro-${month}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  };
  return (
    <div className="finance-dashboard">
      <header className="finance-header">
        <div>
          {client && (
            <button
              className="finance-back"
              onClick={() =>
                clienteInicial && aoVoltarClientes
                  ? aoVoltarClientes()
                  : changeClient(null)
              }
            >
              {clienteInicial && aoVoltarClientes
                ? "← Voltar aos clientes"
                : "← Painel de controle financeiro"}
            </button>
          )}
          <h1>
            {client ? (
              <>
                Visão do cliente <span>– {client}</span>
              </>
            ) : (
              "Painel de controle financeiro"
            )}
          </h1>
          <p>
            Receitas e histórico de atendimentos{" "}
            <span className="finance-demo">Dados demonstrativos</span>
          </p>
        </div>
        <div className="finance-header-actions">
          <label className="finance-period">
            <span>Período</span>
            <input
              type="month"
              aria-label="Período financeiro"
              value={month}
              onChange={(e) => {
                if (e.target.value) setMonth(e.target.value);
              }}
            />
          </label>
          <span className="finance-user">
            <b>{initials(usuarioLogado || "Fred")}</b>
            {usuarioLogado || "Fred"}
          </span>
        </div>
      </header>
      <div
        className={`finance-metrics ${client ? "finance-metrics-client" : ""}`}
      >
        {client && (
          <article className="finance-client-card">
            <div className="finance-avatar">{initials(client)}</div>
            <div>
              <strong>{client}</strong>
              <span>Cliente desde 2021</span>
              <span>
                Última visita:{" "}
                {rows.length
                  ? dateLabel(
                      [...rows].sort((a, b) => b.date.localeCompare(a.date))[0]
                        .date,
                    )
                  : "—"}
              </span>
            </div>
          </article>
        )}
        {client ? (
          <>
            <Metric
              label="Gasto total no período"
              value={money(total)}
              detail="em serviços realizados"
            />

            <Metric
              label="Serviço de maior receita"
              value={money(topService.total)}
              detail={total ? topService.name : "Sem atendimentos"}
            />

            <Metric
              label="Ticket médio por visita"
              value={money(rows.length ? total / rows.length : 0)}
              detail="no período selecionado"
            />

            <Metric
              label="Total de visitas"
              value={rows.length}
              detail="no período selecionado"
            />
          </>
        ) : (
          <>
            <Metric
              label="Faturamento do último dia"
              value={money(sum(rows.filter((row) => row.date === endDate)))}
              detail={dateLabel(endDate)}
            />

            <Metric
              label="Faturamento da última semana"
              value={money(
                sum(
                  rows.filter(
                    (row) =>
                      Number(row.date.slice(8)) > Number(endDate.slice(8)) - 7,
                  ),
                ),
              )}
              detail="últimos 7 dias do período"
            />

            <Metric
              label="Faturamento mensal"
              value={money(total)}
              detail={`${rows.length} atendimentos no período`}
            />

            <Metric
              label="Ticket médio do mês"
              value={money(rows.length ? total / rows.length : 0)}
              detail="por atendimento realizado"
            />
          </>
        )}
      </div>
      <div className="finance-charts">
        <RevenueChart
          key={`${client}-${month}`}
          rows={rows}
          client={client}
          month={month}
        />

        <Distribution rows={rows} client={client} />
      </div>
      <section className="finance-panel finance-history">
        <div className="finance-panel-heading">
          <h2>
            {client
              ? "Histórico de consumo do cliente"
              : "Histórico de consumo e busca de clientes"}
          </h2>
          {client ? (
            <button onClick={exportCsv}>Exportar CSV ↓</button>
          ) : (
            <button onClick={() => setShowAll(!showAll)}>
              {showAll ? "Mostrar menos ↑" : "Ver todos →"}
            </button>
          )}
        </div>
        <div className="finance-filters">
          <input
            type="search"
            aria-label="Buscar no histórico"
            placeholder={
              client
                ? "Buscar serviço, profissional ou comanda..."
                : "Buscar cliente, serviço ou profissional..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div>
            <select
              aria-label="Ordenar por data"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="desc">Mais recentes</option>
              <option value="asc">Mais antigos</option>
            </select>
            <select
              aria-label="Filtrar serviço"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="">Todos os serviços</option>
              {services.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            {client && (
              <select
                aria-label="Filtrar pagamento"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="">Pagamentos</option>
                {[
                  "Pix",
                  "Cartão de crédito",
                  "Cartão de débito",
                  "Dinheiro",
                ].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="finance-table-scroll">
          <table>
            <thead>
              <tr>
                {!client && <th>Cliente</th>}
                <th>Data / hora</th>
                <th>Serviço</th>
                <th>Profissional</th>
                {client && <th>Forma de pagamento</th>}
                <th className="finance-number">Valor (R$)</th>
                {!client && <th className="finance-number">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {displayed.map((row) => (
                <tr key={row.id}>
                  {!client && (
                    <td>
                      <span className="finance-client-name">
                        <i>{initials(row.client)}</i>
                        {row.client}
                      </span>
                    </td>
                  )}
                  <td className="finance-muted">
                    {dateLabel(row.date)} · {row.time}
                  </td>
                  <td>
                    <span className="finance-tag">{row.service}</span>
                  </td>
                  <td>{row.professional}</td>
                  {client && <td>{row.payment}</td>}
                  <td className="finance-number">
                    <strong>{money(row.amount)}</strong>
                  </td>
                  {!client && (
                    <td className="finance-number">
                      <button
                        className="finance-view"
                        onClick={() => changeClient(row.client)}
                      >
                        Ver dashboard →
                        <span className="finance-sr"> de {row.client}</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <p className="finance-empty">
            Nenhum atendimento encontrado para estes filtros.
          </p>
        )}
        <div className="finance-table-footer">
          <span>
            {displayed.length} de {filtered.length} atendimentos
          </span>
          <span>
            Total filtrado: <strong>{money(sum(filtered))}</strong>
          </span>
        </div>
      </section>
    </div>
  );
}
